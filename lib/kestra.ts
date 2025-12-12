import axios from "axios";

// Define the base URL and fetch Basic Auth credentials
const KESTRA_BASE_URL = "http://localhost:8080/api/v1";
// FIX 1: Set the mandatory tenant ID for Kestra Open Source v0.23+
const KESTRA_TENANT_ID = "main"; 

const KESTRA_USERNAME = process.env.KESTRA_USERNAME;
const KESTRA_PASSWORD = process.env.KESTRA_PASSWORD;

const KESTRA_FLOW_NAMESPACE = "system"; // Use the readily available default namespace

export const AVAILABLE_KESTRA_FLOWS = {
    BLOCK_IP: `${KESTRA_FLOW_NAMESPACE}.block-ip`,         // default.block-ip
    DISABLE_USER: `${KESTRA_FLOW_NAMESPACE}.disable-user`,   // default.disable-user
    CREATE_TICKET: `${KESTRA_FLOW_NAMESPACE}.create-ticket-jira`, // default.create-ticket-jira
};

export interface KestraFlowExecution {
    flowId: string;
    executionId: string; 
    flowUri: string; 
    message: string;
}

export async function runKestraFlow(
    flowId: string,
    payload: Record<string, any>
): Promise<KestraFlowExecution> {
    
    // Check for credentials immediately
    if (!KESTRA_USERNAME || !KESTRA_PASSWORD) {
        throw new Error("KESTRA_USERNAME or KESTRA_PASSWORD environment variables are missing. Cannot authenticate with Kestra.");
    }

    // Split flowId (e.g., socai.remediation.block-ip) into parts
    const parts = flowId.split('.');
    const namespace = parts[0]; // system
    const simpleFlowId = parts[1]; // block-ip

    // FIX 2: Correct URI by injecting the KESTRA_TENANT_ID
    const executionUri = `${KESTRA_BASE_URL}/${KESTRA_TENANT_ID}/executions/${namespace}/${simpleFlowId}`;
    
    console.log(`[Kestra Live] Attempting to trigger flow: ${flowId} at ${executionUri}`);

    const formData = new FormData();
    
    // Iterate over the payload and add each key-value pair to the form data
    // Kestra expects inputs at the root level of the form data
    for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
            // Convert objects/arrays to JSON string if needed, as per Kestra documentation
            const value = typeof payload[key] === 'object' && payload[key] !== null
                ? JSON.stringify(payload[key])
                : payload[key];
            
            // Append the input field directly by its ID (e.g., 'target', 'incidentId')
            formData.append(key, value); 
        }
    }

    try {
        const response = await axios.post(
            executionUri,
            formData, 
            {
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // Use Axios 'auth' property for HTTP Basic Authentication
                auth: {
                    username: KESTRA_USERNAME,
                    password: KESTRA_PASSWORD
                }
            }
        );

        // Kestra returns HTTP 201 upon successful trigger
        if ((response.status === 200 || response.status === 201) && response.data.id) {
            return {
                flowId: flowId,
                executionId: response.data.id, 
                flowUri: executionUri,
                message: `Kestra flow triggered successfully! Execution ID: ${response.data.id}`,
            };
        } else {
             throw new Error(`Kestra API returned unexpected status ${response.status}. Response: ${JSON.stringify(response.data)}`);
        }

    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error(`Failed to connect to Kestra server. Is the server running at ${KESTRA_BASE_URL}?`);
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error(`Authentication failed (401/403). Check if KESTRA_USERNAME and KESTRA_PASSWORD are correct.`);
        }

        // Handle the original 404 failure gracefully if it was the tenant ID issue
        if (error.response?.status === 404) {
             throw new Error(`Kestra flow not found (404). Check if the flow is deployed in the 'system' namespace.`);
        }

        if (error.response?.status === 415) {
             throw new Error(`Kestra 415 Error: Payload format rejected. Ensure flow YAML has matching 'inputs' section defined for all fields.`);
        }

        console.error("Kestra Execution Error:", error);
        throw new Error(`Kestra API error during trigger: ${error.message}`);
    }
}