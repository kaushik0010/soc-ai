// components/dashboard/KestraStatusWidget.tsx
import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Loader, XCircle, Zap } from 'lucide-react';

interface Execution {
    id: string;
    flowId: string;
    status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CREATED';
    duration: string;
    date: string;
}

const getStatusIcon = (status: Execution['status']) => {
    switch (status) {
        case 'SUCCESS':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'FAILED':
            return <XCircle className="w-5 h-5 text-red-500" />; // XCircle is a good failure indicator
        case 'RUNNING':
            return <Loader className="w-5 h-5 text-blue-500 animate-spin" />; // Loader with spin animation
        case 'CREATED':
            return <AlertTriangle className="w-5 h-5 text-orange-500" />; // AlertTriangle for pending/created state
        default:
            return <Clock className="w-5 h-5 text-gray-400" />;
    }
};

const mockExecutions: Execution[] = [
    { id: '7YXT...FLg', flowId: 'system.create-ticket-jira', status: 'SUCCESS', duration: '16.2s', date: '5 mins ago' },
    { id: '8AWE...H4k', flowId: 'system.block-ip', status: 'FAILED', duration: '3.1s', date: '12 mins ago' },
    { id: '9BCF...R2z', flowId: 'system.create-ticket-jira', status: 'RUNNING', duration: '30s', date: '1 min ago' },
    { id: '6DGY...Q7p', flowId: 'system.disable-user', status: 'SUCCESS', duration: '5.8s', date: '45 mins ago' },
];

const KestraStatusWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                Kestra Remediation Status 🚀
            </h2>
            <div className="space-y-3">
                {mockExecutions.map((exec) => (
                    <div key={exec.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                            {getStatusIcon(exec.status)}
                            <div className="text-sm font-medium">{exec.flowId}</div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{exec.duration}</span>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[10px]">{exec.id.substring(0, 8)}...</span>
                            <span>{exec.date}</span>
                            {/* Link to Kestra UI for full log details */}
                            <a 
                                href={`http://localhost:8080/ui/main/executions/${exec.flowId}/${exec.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                                View
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KestraStatusWidget;