// components/LogPlayground.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Send, Zap, RotateCw } from 'lucide-react';
import { testLogs, TestLog } from '@/lib/testLogs';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';

const LogPlayground: React.FC = () => {
    const [selectedLogId, setSelectedLogId] = useState<string>(testLogs[0].id);
    const [logText, setLogText] = useState<string>(testLogs[0].text);
    const [logSource, setLogSource] = useState<"webhook" | "manual">(testLogs[0].source);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const selectedLog: TestLog | undefined = testLogs.find(l => l.id === selectedLogId);

    const handleSelectChange = (id: string) => {
        const log = testLogs.find(l => l.id === id);
        if (log) {
            setSelectedLogId(id);
            setLogText(log.text);
            setLogSource(log.source);
            setResult(null); // Clear previous result
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);

        // Determine which API endpoint to call
        const apiPath = logSource === "webhook" ? "/api/logs/webhook" : "/api/logs/create";

        try {
            const response = await axios.post(apiPath, { 
                rawText: logText,
                // Add a unique identifier for the dashboard logs
                userId: `playground-${logSource}`, 
            });

            setResult({
                success: response.data.success,
                message: response.data.message,
                status: response.status,
                logId: response.data.log?._id,
                incidentId: response.data.incident?.incidentId,
                severity: response.data.incident?.severity,
            });
            
            // Optionally notify the main dashboard component to refresh its log list
            // For a complete demo, a state management system (e.g., global context) would trigger this.

        } catch (error: any) {
            setResult({
                success: false,
                message: error.response?.data?.message || error.message || "Unknown error occurred.",
                status: error.response?.status || 500,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="col-span-12 h-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                    <Terminal className="w-6 h-6 mr-2 text-green-600" /> Log Triage Playground
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- INPUT PANEL --- */}
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Simulate log ingestion via Webhook or Manual Input to demonstrate the Oumi Triage Agent's capabilities.
                    </p>

                    <div className="flex items-center space-x-2">
                        <Select onValueChange={handleSelectChange} value={selectedLogId}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select a Test Log" />
                            </SelectTrigger>
                            <SelectContent>
                                {testLogs.map(log => (
                                    <SelectItem key={log.id} value={log.id}>
                                        {log.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(v) => setLogSource(v as "webhook" | "manual")} value={logSource}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="webhook">Source: Webhook (/api/logs/webhook)</SelectItem>
                                <SelectItem value="manual">Source: Manual (/api/logs/create)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Textarea
                        value={logText}
                        onChange={(e) => setLogText(e.target.value)}
                        placeholder="Paste your raw log entry here..."
                        rows={10}
                        className="font-mono text-xs"
                    />
                    
                    {selectedLog && (
                        <p className="text-xs text-muted-foreground italic">
                            Description: {selectedLog.description}
                        </p>
                    )}

                    <Button onClick={handleSubmit} disabled={loading || logText.trim() === ""} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? <RotateCw className="w-4 h-4 animate-spin mr-2" /> : 'Submit & Run Triage Agent'}
                    </Button>
                </div>

                {/* --- OUTPUT PANEL --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Triage Result</h3>
                    
                    <div className="h-[300px] overflow-y-auto bg-gray-50 p-4 rounded-md border text-sm font-mono whitespace-pre-wrap">
                        {result ? (
                            <>
                                <p className={result.success ? "text-green-600" : "text-red-600"}>
                                    {result.success ? 'SUCCESS' : 'FAILURE'} ({result.status})
                                </p>
                                <Separator className='my-2' />
                                <p>Message: {result.message}</p>
                                {result.incidentId && <p>Incident ID: 'soc-ai-incident-id'</p>}
                                {result.severity && <p className='flex items-center'>Severity: <Zap className='w-4 h-4 ml-1 mr-1 text-orange-500' /> {result.severity}</p>}
                                {result.logId && <p>Log ID: 'soc-ai-log-id'</p>}
                            </>
                        ) : (
                            <p className="text-muted-foreground">Results will appear here after submission.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogPlayground;