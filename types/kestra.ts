// types/kestra.ts
export interface Execution {
    id: string;
    flowId: string; // e.g., system.block-ip
    status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CREATED' | 'WARNING' | 'KILLED';
    duration: string; // e.g., "10.7s"
    date: string;     // ISO date string
}