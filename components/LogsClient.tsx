"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import LogFilters from "./LogFilters";

type LogItem = {
  _id: string;
  rawText: string;
  summary?: string | null;
  classification?: string | null;
  createdAt: string;
};

export default function LogsClient() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [totalLogs, setTotalLogs] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [source, setSource] = useState<string | null>(null); // 🔥 Added

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchLogs();

    // Auto-refresh every 5 seconds
    intervalRef.current = window.setInterval(() => {
      fetchLogs(true); // silent refresh
    }, 5000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [page, source, search]); // 🔥 Now reacts to filters also

  async function fetchLogs(silent: boolean = false) {
    try {
      if (!silent) setLoading(true);

      const res = await axios.get("/api/logs/list", {
        params: { page, limit, search, source }, // 🔥 Filters applied
      });

      if (res.data.success) {
        setLogs(res.data.logs);
        setTotalLogs(res.data.totalLogs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  function handleSearchSubmit() {
    setPage(1);
    fetchLogs();
  }

  function Row({ index, style, data }: { index: number; style: React.CSSProperties; data: LogItem[] }) {
    const item = data[index];

    return (
      <div style={style} className="border-b p-3">
        <p className="font-medium">{item.rawText}</p>
        <p className="text-sm text-muted-foreground">
          {item.summary ? `Summary: ${item.summary}` : "Summary: N/A"}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.classification ? (
            <>
              Classification: <Badge variant="secondary">{item.classification}</Badge>
            </>
          ) : (
            "Classification: N/A"
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Security Logs</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">

        {/* 🔥 Added Filters Component */}
        <LogFilters
          onSourceChange={(s) => {
            setSource(s);
            setPage(1);
          }}
          onSearch={(q) => {
            setSearch(q);
            setPage(1);
          }}
        />

        {/* Search Bar for manual search as well (optional) — you can remove if redundant */}
        <div className="flex gap-2">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          <Button onClick={handleSearchSubmit}>Search</Button>
        </div>

        {/* Logs List */}
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <List height={400} itemCount={logs.length} itemSize={120} width="100%" itemData={logs}>
            {Row}
          </List>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>

          <span>
            Page {page} / {Math.ceil(totalLogs / limit)}
          </span>

          <Button disabled={page >= Math.ceil(totalLogs / limit)} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}