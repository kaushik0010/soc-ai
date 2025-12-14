"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import LogFilters from "./LogFilters";
import LogRow from "./LogRow";
import LogDetailDrawer, { LogItem } from "./LogDetailDrawer";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function LogsClient() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [source, setSource] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);

  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const highlightedLogRef = useRef<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/logs/list", {
        params: { page, limit, search, source, classification },
      });

      if (res.data.success) {
        setLogs(res.data.logs);
        setTotalLogs(res.data.totalLogs);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, search, source, classification]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const eventSource = new EventSource("/api/logs/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_log") {
          const newLog: LogItem = data.log;

          if (source && newLog.source !== source) return;
          if (classification && newLog.classification !== classification) return;
          if (search && !newLog.rawText.toLowerCase().includes(search.toLowerCase())) return;

          highlightedLogRef.current = newLog._id;
          setTimeout(() => {
            highlightedLogRef.current = null;
          }, 3000);

          if (page === 1) {
            setLogs((prev) => [newLog, ...prev.slice(0, limit - 1)]);
            setTotalLogs((prev) => prev + 1);
          }
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => console.error("SSE error:", err);
    return () => eventSource.close();
  }, [source, classification, search, page, limit]);

  const handleSelectLog = (log: LogItem) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/logs/${id}`);
      setLogs((prev) => prev.filter((log) => log._id !== id));
      setSelectedLog(null);
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const handleUpdate = (updatedLog: LogItem) => {
    setLogs((prev) => prev.map((log) => (log._id === updatedLog._id ? updatedLog : log)));
    if (selectedLog?._id === updatedLog._id) {
      setSelectedLog(updatedLog);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Security Logs
              <span className="text-sm font-normal text-gray-600 ml-2 bg-white/70 px-3 py-1 rounded-full border">
                Real-time Stream
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Total: {totalLogs} logs • Showing {logs.length} on page {page}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="border-indigo-200 hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-6">
          {/* Filters */}
          <LogFilters
            onSourceChange={(v) => { setSource(v); setPage(1); }}
            onClassificationChange={(v) => { setClassification(v); setPage(1); }}
            onSearch={(q) => { setSearch(q); setPage(1); }}
          />

          {/* Logs List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="text-gray-600">Loading security logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600 max-w-md">
                {search || source || classification 
                  ? "Try adjusting your filters to see more results." 
                  : "Logs will appear here as they are ingested."}
              </p>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Recent Security Events</span>
                <span className="text-xs text-gray-500">{logs.length} items</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {logs.map((log) => (
                  <LogRow
                    key={log._id}
                    log={log}
                    onSelect={handleSelectLog}
                    highlight={highlightedLogRef.current === log._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalLogs > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Page {page} of {Math.ceil(totalLogs / limit)}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="cursor-pointer transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, Math.ceil(totalLogs / limit)) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 1, Math.ceil(totalLogs / limit) - 3)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`h-8 w-8 p-0 cursor-pointer transition-all duration-300 ${
                          page === pageNum 
                            ? "bg-indigo-600 hover:bg-indigo-700" 
                            : "hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page >= Math.ceil(totalLogs / limit) || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="cursor-pointer transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Drawer */}
      <LogDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        log={selectedLog}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </Card>
  );
}