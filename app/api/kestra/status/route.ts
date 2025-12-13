// app/api/kestra/status/route.ts
import { NextResponse } from "next/server";
import { getKestraAuthHeaders, KESTRA_FLOW_NAMESPACE, AVAILABLE_KESTRA_FLOWS } from "@/lib/kestra"; 

// Update KestraExecution interface to match the response you received
interface KestraExecution {
    id: string;
    flowId: string;
    namespace: string;
    // The state object you received has duration as a string (e.g., "PT16.262074S") and uses startDate
    state: {
        current: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CREATED' | 'WARNING' | 'KILLED';
        duration: string; // Changed from number to string ("PTxxS") based on your response
        startDate: string;
        endDate?: string;
    };
}

// Helper to convert Kestra's "PTxxS" duration string to milliseconds
const parseKestraDurationToMs = (duration: string): number => {
    // Basic regex to extract seconds (e.g., "PT16.262074S" -> 16.262074)
    const match = duration.match(/PT([\d\.]+)S/);
    if (match && match[1]) {
        return parseFloat(match[1]) * 1000;
    }
    return 0; // Default to 0 if parsing fails
};


/**
 * Fetches the most recent Kestra flow executions for the dashboard status widget.
 * FIX: This chains multiple single-flow API calls since Kestra does not support multi-flow queries.
 */
export async function GET() {
    const KESTRA_API_URL = process.env.KESTRA_API_URL || "http://localhost:8080/api/v1";
    const EXECUTION_URL = `${KESTRA_API_URL}/executions`;
    const headers = getKestraAuthHeaders();
    
    // Get the list of remediation flows (e.g., 'block-ip', 'disable-user', 'create-ticket-jira')
    const simpleFlowIds = Object.values(AVAILABLE_KESTRA_FLOWS).map(fullId => fullId.split('.')[1]);

    // 1. Create an array of Promises, one for each single-flow API call
    const fetchPromises = simpleFlowIds.map(flowId => {
        const params = new URLSearchParams({ 
            namespace: KESTRA_FLOW_NAMESPACE, 
            flowId: flowId, 
            size: "10", // Fetch 10 results per flow
            sort: "startDate", // You observed this works
            order: "DESC",    // You observed this works
        }).toString();
        
        return fetch(`${EXECUTION_URL}?${params}`, { headers, cache: 'no-store' })
            .then(res => res.json())
            .then(data => data.results as KestraExecution[] || []) // Extract results or return empty array
            .catch(error => {
                console.error(`Error fetching Kestra flow ${flowId}:`, error);
                return []; // Fail gracefully for one flow
            });
    });

    try {
        // 2. Execute all promises concurrently
        const resultsByFlow = await Promise.all(fetchPromises);
        
        // 3. Flatten the array of arrays into a single list of all executions
        const allExecutions = resultsByFlow.flat();

        // 4. Sort the combined list by startDate (the original source of truth)
        allExecutions.sort((a, b) => 
            new Date(b.state.startDate).getTime() - new Date(a.state.startDate).getTime()
        );
        
        // 5. Take only the top 10 most recent executions overall
        const finalExecutions = allExecutions.slice(0, 10);

        // 6. Map and format the final 10 executions for the frontend
        const formattedExecutions = finalExecutions.map(exec => ({
            id: exec.id,
            flowId: `${exec.namespace}.${exec.flowId}`,
            status: exec.state.current,
            // Convert the Kestra duration string (PTxxS) to a readable format (seconds)
            duration: `${(parseKestraDurationToMs(exec.state.duration) / 1000).toFixed(1)}s`, 
            date: exec.state.startDate,
        }));
        
        return NextResponse.json({
            success: true,
            executions: formattedExecutions,
        });

    } catch (error: any) {
        console.error("Kestra Status Proxy Error (Chain Failed):", error.message);
        return NextResponse.json(
            { success: false, message: "Could not fetch Kestra status. Check Kestra server connection." },
            { status: 500 }
        );
    }
}