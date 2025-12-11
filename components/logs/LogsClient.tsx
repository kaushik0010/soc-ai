"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import LogFilters from "./LogFilters";
import LogRow from "./LogRow";
import LogDetailDrawer, { LogItem } from "./LogDetailDrawer"; // import LogItem type

export default function LogsClient() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [totalLogs, setTotalLogs] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [source, setSource] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);

  // Drawer state
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const highlightedLogRef = useRef<string | null>(null);

  // ⭕ Fetch logs with filters
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
    }
  }, [page, limit, search, source, classification]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ⭕ SSE Stream for real-time logs
  useEffect(() => {
    const eventSource = new EventSource("/api/logs/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_log") {
          const newLog: LogItem = data.log;

          // Respect filters
          if (source && newLog.source !== source) return;
          if (classification && newLog.classification !== classification) return;
          if (search && !newLog.rawText.toLowerCase().includes(search.toLowerCase())) return;

          highlightedLogRef.current = newLog._id;

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

  // Log selection handler
  const handleSelectLog = (log: LogItem) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  // Delete log handler
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/logs/${id}`);
      setLogs((prev) => prev.filter((log) => log._id !== id));
      setSelectedLog(null);
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  // 🟦 Update log handler (after AI reprocess)
  const handleUpdate = (updatedLog: LogItem) => {
    setLogs((prev) => prev.map((log) => (log._id === updatedLog._id ? updatedLog : log)));
    // If drawer is open on the same log, update selectedLog
    if (selectedLog?._id === updatedLog._id) {
      setSelectedLog(updatedLog);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Security Logs (Real-time)</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Filters */}
        <LogFilters
          onSourceChange={(v) => { setSource(v); setPage(1); }}
          onClassificationChange={(v) => { setClassification(v); setPage(1); }}
          onSearch={(q) => { setSearch(q); setPage(1); }}
        />

        {/* Logs List */}
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No logs found</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            {logs.map((log) => (
              <LogRow
                key={log._id}
                log={log}
                onSelect={handleSelectLog}
                highlight={highlightedLogRef.current === log._id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span>Page {page} / {Math.ceil(totalLogs / limit)}</span>
          <Button disabled={page >= Math.ceil(totalLogs / limit)} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </CardContent>

      {/* Drawer */}
      <LogDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        log={selectedLog}
        onDelete={handleDelete}
        onUpdate={handleUpdate} // ⬅️ Pass update handler
      />
    </Card>
  );
}
