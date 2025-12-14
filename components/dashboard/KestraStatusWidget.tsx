'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Loader2, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Server
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Execution } from '@/types/kestra';

const getStatusBadge = (status: Execution['status']) => {
  const config = {
    'SUCCESS': { 
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600', 
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      text: 'SUCCESS'
    },
    'FAILED': { 
      bg: 'bg-gradient-to-r from-red-500 to-red-600', 
      icon: <XCircle className="w-3 h-3 mr-1" />,
      text: 'FAILED'
    },
    'RUNNING': { 
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse', 
      icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
      text: 'RUNNING'
    },
    'WARNING': { 
      bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600', 
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      text: 'WARNING'
    },
    'KILLED': { 
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600', 
      icon: <PauseCircle className="w-3 h-3 mr-1" />,
      text: 'KILLED'
    },
    'CREATED': {
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: <PlayCircle className="w-3 h-3 mr-1" />,
      text: 'CREATED'
    }
  };

  const { bg, icon, text } = config[status] || { 
    bg: 'bg-gray-100 text-gray-800', 
    icon: null, 
    text: status 
  };

  return (
    <Badge className={`${bg} text-white font-medium px-2.5 py-1`}>
      {icon}
      {text}
    </Badge>
  );
};

const formatFlowId = (flowId: string) => {
  return flowId.split('.').pop()?.replace(/-/g, ' ').toUpperCase() || flowId;
};

const KestraStatusWidget: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchExecutions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/kestra/status');
      const data = await response.json();

      if (data.success) {
        setExecutions(data.executions.slice(0, 8)); // Limit to 8 most recent
        setError(null);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(data.message || "Failed to fetch Kestra executions.");
        setExecutions([]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Unable to connect to Kestra server.");
      setExecutions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
    const interval = setInterval(fetchExecutions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/);
    if (!match) return duration;
    
    const [, hours, minutes, seconds] = match;
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${parseFloat(seconds).toFixed(1)}s`);
    return parts.join(' ');
  };

  return (
    <Card className="w-full border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Kestra Automation Status
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Live execution monitoring • {executions.length} active flows
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Server className="h-3 w-3" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchExecutions}
              disabled={isLoading}
              className="cursor-pointer hover:bg-white/80 transition-colors duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-indigo-200"></div>
              <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600">Connecting to Kestra server...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4 max-w-md">{error}</p>
            <Button 
              onClick={fetchExecutions}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
            >
              Retry Connection
            </Button>
          </div>
        ) : executions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Executions</h3>
            <p className="text-gray-600 max-w-md">
              Kestra workflows will appear here when triggered by security incidents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-700">WORKFLOW</TableHead>
                  <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                  <TableHead className="font-semibold text-gray-700">TRIGGERED</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">DURATION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((exec) => (
                  <TableRow 
                    key={exec.id} 
                    className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-colors duration-300"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatFlowId(exec.flowId)}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {exec.flowId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(exec.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(exec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(exec.date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-900 font-mono text-sm font-medium">
                        {formatDuration(exec.duration)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KestraStatusWidget;