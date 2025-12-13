// components/KestraStatusWidget.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Execution } from '@/types/kestra'; // Import the defined type

// Helper function to format the status badge
const getStatusBadge = (status: Execution['status']) => {
    switch (status) {
        case 'SUCCESS':
            return <Badge className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" /> SUCCESS</Badge>;
        case 'FAILED':
            return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> FAILED</Badge>;
        case 'RUNNING':
            return <Badge className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> RUNNING</Badge>;
        case 'WARNING':
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black"><AlertTriangle className="w-3 h-3 mr-1" /> WARNING</Badge>;
        case 'KILLED':
            return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">KILLED</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

// Helper function to format the flow ID (e.g., system.block-ip -> block-ip)
const formatFlowId = (flowId: string) => {
    return flowId.split('.').pop()?.replace(/-/g, ' ') || flowId;
};

const KestraStatusWidget: React.FC = () => {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExecutions = async () => {
            try {
                const response = await fetch('/api/kestra/status');
                const data = await response.json();

                if (data.success) {
                    setExecutions(data.executions);
                    setError(null);
                } else {
                    // Handle API failure (e.g., Kestra server down)
                    setError(data.message || "Failed to fetch Kestra executions.");
                    setExecutions([]);
                }
            } catch (err: any) {
                // Handle network error
                console.error("Fetch error:", err);
                setError("Network error or server unreachable.");
                setExecutions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExecutions();
    }, []);

    return (
        <Card className="col-span-12 lg:col-span-6 xl:col-span-4 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-indigo-600" /> Live Kestra Remediation Status
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full min-h-[200px] text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Fetching live Kestra execution data...
                    </div>
                ) : error ? (
                    <div className="text-center p-4 text-red-600 border border-red-300 rounded min-h-[200px] flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 mr-2" /> {error}
                    </div>
                ) : executions.length === 0 ? (
                    <div className="text-center p-4 text-gray-500 min-h-[200px] flex items-center justify-center">
                        No recent remediation executions found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Flow ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {executions.map((exec) => (
                                <TableRow key={exec.id}>
                                    <TableCell className="font-medium capitalize">
                                        {formatFlowId(exec.flowId)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(exec.status)}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {new Date(exec.date).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        {exec.duration}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default KestraStatusWidget;