"use client";

import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, AlertTriangle, Shield, FileText } from "lucide-react";

type Log = {
  _id: string;
  rawText: string;
  source?: string | null;
  createdAt: string;
  incidentDetails: {
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md';
    case 'High': return 'bg-gradient-to-r from-orange-600 to-orange-700 text-white';
    case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900';
    case 'Low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'Critical': return <AlertTriangle className="h-3 w-3 mr-1" />;
    case 'High': return <AlertTriangle className="h-3 w-3 mr-1" />;
    case 'Medium': return <Shield className="h-3 w-3 mr-1" />;
    default: return <FileText className="h-3 w-3 mr-1" />;
  }
};

const getSourceIcon = (source?: string | null) => {
  switch (source) {
    case 'webhook': return <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>;
    case 'manual': return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
    case 'api': return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
    case 'kestra': return <div className="h-2 w-2 rounded-full bg-indigo-500"></div>;
    default: return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
  }
};

export default function LogRow({ log, onSelect, highlight = false }: Props) {
  const incident = log.incidentDetails?.[0];

  return (
    <div
      onClick={() => onSelect && onSelect(log)}
      className={`
        group p-4 border-b last:border-b-0 transition-all duration-300 cursor-pointer
        hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50
        ${highlight 
          ? "animate-pulse bg-gradient-to-r from-green-100/80 to-emerald-100/80 border-l-4 border-l-green-500" 
          : "hover:border-l-4 hover:border-l-indigo-300"
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect && onSelect(log);
        }
      }}
    >
      <div className="flex items-start gap-4">
        {/* Left side: Time and Source */}
        <div className="w-24 flex-shrink-0">
          <div className="text-xs text-gray-500 mb-2">
            {formatDistanceToNowStrict(new Date(log.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {getSourceIcon(log.source)}
            <span className="font-medium capitalize">{log.source || "unknown"}</span>
          </div>
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 truncate">
                {incident?.title ?? log.rawText.substring(0, 120) + (log.rawText.length > 120 ? "..." : "")}
              </h4>
              {incident?.summary && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {incident.summary}
                </p>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
          </div>

          {/* Raw text preview */}
          {!incident && (
            <div className="text-xs text-gray-500 bg-gray-50/50 px-3 py-2 rounded-md border">
              <div className="font-medium mb-1 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Raw Log Preview
              </div>
              <div className="font-mono truncate">{log.rawText}</div>
            </div>
          )}
        </div>

        {/* Right side: Severity Badge */}
        <div className="w-32 flex-shrink-0 flex justify-end">
          {incident ? (
            <Badge className={`${getSeverityColor(incident.severity)} font-bold px-3 py-1.5 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
              <div className="flex items-center justify-center">
                {getSeverityIcon(incident.severity)}
                {incident.severity.toUpperCase()}
              </div>
            </Badge>
          ) : (
            <div className="text-center">
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border">
                <span className="font-medium">Untriaged</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 italic">Awaiting analysis</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}