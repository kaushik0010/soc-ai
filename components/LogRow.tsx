"use client";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Log = {
  _id: string;
  rawText: string;
  summary?: string | null;
  classification?: string | null;
  source?: string;
  createdAt: string;
};

export default function LogRow({ log }: { log: Log }) {
  return (
    <div className="p-3 border-b last:border-b-0 hover:bg-muted/40">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{log.rawText}</div>
          <div className="text-xs text-muted-foreground mt-1">{log.summary ?? <span className="italic">No summary</span>}</div>
          <div className="text-xs text-muted-foreground mt-2 flex gap-3 items-center">
            <span>Source: <span className="font-medium">{log.source ?? "unknown"}</span></span>
            <span>•</span>
            <span>{formatDistanceToNowStrict(new Date(log.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="w-40 text-right">
          {log.classification ? (
            <Badge variant="secondary">{log.classification}</Badge>
          ) : (
            <div className="text-xs text-muted-foreground">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
