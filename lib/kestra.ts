// /lib/kestra.ts
// Standardized Kestra Client using native fetch and basic auth helper

// Define the base URL and fetch Basic Auth credentials
const KESTRA_BASE_URL = process.env.KESTRA_API_URL || "http://localhost:8080/api/v1";
// Kestra Open Source v0.23+ requires the tenant ID in the URI path
const KESTRA_TENANT_ID = "main"; 

const KESTRA_USERNAME = process.env.KESTRA_USERNAME;
const KESTRA_PASSWORD = process.env.KESTRA_PASSWORD;

export const KESTRA_FLOW_NAMESPACE = "system"; 

export const AVAILABLE_KESTRA_FLOWS = {
    BLOCK_IP: `${KESTRA_FLOW_NAMESPACE}.block-ip`, 
    DISABLE_USER: `${KESTRA_FLOW_NAMESPACE}.disable-user`, 
    CREATE_TICKET: `${KESTRA_FLOW_NAMESPACE}.create-ticket-jira`,
};

export interface KestraFlowExecution {
    flowId: string;
    executionId: string; 
    flowUri: string; 
    message: string;
}

/**
 * Helper function to create Basic Auth headers for Kestra.
 * This is exported and reused by the /api/kestra/status route.
 */
export function getKestraAuthHeaders(): HeadersInit {
    if (!KESTRA_USERNAME || !KESTRA_PASSWORD) {
        throw new Error("KESTRA_USERNAME or KESTRA_PASSWORD environment variables are missing.");
    }
    
    // Base64 encoding for Basic Auth
    // NOTE: Node.js Buffer is available in Next.js Route Handlers/Server Components
    const authString = Buffer.from(`${KESTRA_USERNAME}:${KESTRA_PASSWORD}`).toString('base64');
    
    return {
        'Authorization': `Basic ${authString}`,
        // Note: For POSTing FormData, fetch often handles the 'Content-Type' header automatically.
    };
}


/**
 * Triggers a Kestra flow execution using native fetch and FormData.
 */
export async function runKestraFlow(
    flowId: string,
    payload: Record<string, any>
): Promise<KestraFlowExecution> {
    
    if (!KESTRA_USERNAME || !KESTRA_PASSWORD) {
        throw new Error("KESTRA_USERNAME or KESTRA_PASSWORD environment variables are missing. Cannot authenticate with Kestra.");
    }

    // Parse flowId: system.block-ip -> namespace=system, simpleFlowId=block-ip
    const [namespace, simpleFlowId] = flowId.split('.');
    
    // Correct Kestra Execution URI structure (using the global KESTRA_TENANT_ID)
    const executionUri = `${KESTRA_BASE_URL}/${KESTRA_TENANT_ID}/executions/${namespace}/${simpleFlowId}`;
    
    console.log(`[Kestra Live] Attempting to trigger flow: ${flowId} at ${executionUri}`);

    const formData = new FormData();
    // Kestra expects form data where each payload key is a separate field
    for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
            const value = typeof payload[key] === 'object' && payload[key] !== null
                ? JSON.stringify(payload[key])
                : payload[key];
            
            formData.append(key, value); 
        }
    }

    try {
        const headers = getKestraAuthHeaders();

        // 🚨 Use native fetch instead of axios
        const response = await fetch(
            executionUri,
            {
                method: 'POST',
                headers: headers, // Basic Auth included
                body: formData, // FormData body
            }
        );

        const responseData = await response.json().catch(() => ({}));

        if (response.ok && responseData.id) {
            return {
                flowId: flowId,
                executionId: responseData.id, 
                flowUri: executionUri,
                message: `Kestra flow triggered successfully! Execution ID: ${responseData.id}`,
            };
        } else {
             // Handle specific API errors
             const status = response.status;
             const errorResponse = status === 404 ? "Flow not found." : JSON.stringify(responseData);
             
             if (status === 401 || status === 403) {
                 throw new Error(`Authentication failed (401/403). Check KESTRA_USERNAME and KESTRA_PASSWORD.`);
             }
             if (status === 404) {
                 throw new Error(`Kestra flow not found (404). Check if the flow is deployed in the '${namespace}' namespace.`);
             }

             throw new Error(`Kestra API returned status ${status}. Response: ${errorResponse}`);
        }

    } catch (error: any) {
        console.error("Kestra Execution Error:", error);
        if (error.code === 'ECONNREFUSED') {
            throw new Error(`Failed to connect to Kestra server. Is the server running at ${KESTRA_BASE_URL}?`);
        }
        throw new Error(`Kestra API error during trigger: ${error.message}`);
    }
}