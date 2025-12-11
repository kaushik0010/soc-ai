"use client";

import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";

// UPDATED: Added incidentDetails to the Log type
type Log = {
  _id: string;
  rawText: string;
  source?: string | null;
  createdAt: string;
  incidentDetails: { // Array of incidents (usually one per log in this setup)
    severity: 'Low' | 'Medium' | 'High' | 'Critical' | 'Informational';
    title: string;
    summary: string;
  }[];
};

type Props = {
  log: Log;
  onSelect?: (log: Log) => void;
  highlight?: boolean;
};

// Helper for Severity Badges (Copy from LogDetailDrawer for consistency)
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-red-600 hover:bg-red-700 text-white';
    case 'High': return 'bg-orange-600 hover:bg-orange-700 text-white';
    case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
    case 'Low': return 'bg-green-500 hover:bg-green-600 text-white';
    default: return 'bg-gray-400 hover:bg-gray-500 text-white';
  }
}


export default function LogRow({ log, onSelect, highlight = false }: Props) {
  // Access the primary incident's details
  const incident = log.incidentDetails?.[0];

  return (
    <div
      onClick={() => onSelect && onSelect(log)}
      className={`p-3 border-b last:border-b-0 hover:bg-muted/40 cursor-pointer transition ${highlight ? "bg-green-200/40" : ""
        }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect && onSelect(log);
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Display Incident Title or Raw Text Preview */}
          <div className="text-sm font-medium text-foreground truncate">
            {incident?.title ?? log.rawText}
          </div>

          {/* Display Incident Summary if available */}
          <div className="text-xs text-muted-foreground mt-1">
            {incident?.summary ?? <span className="italic">Raw log text preview...</span>}
          </div>

          <div className="text-xs text-muted-foreground mt-2 flex gap-3 items-center">
            <span>
              Source: <span className="font-medium">{log.source ?? "unknown"}</span>
            </span>
            <span>•</span>
            <span>{formatDistanceToNowStrict(new Date(log.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Display Severity Level or Untriaged Status */}
        <div className="w-40 text-right">
          {incident ? (
            <Badge className={`${getSeverityColor(incident.severity)} font-bold`}>
              {incident.severity.toUpperCase()}
            </Badge>
          ) : (
            <div className="text-xs text-muted-foreground italic">— Untriaged —</div>
          )}
        </div>
      </div>
    </div>
  );
}