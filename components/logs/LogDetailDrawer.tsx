"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, RefreshCcw, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import { Separator } from "@/components/ui/separator"; // Assuming you have a Separator component from shadcn/ui

// --- NEW/UPDATED TYPES ---

// Base LogItem (from LogEntry model)
export type LogItem = {
  _id: string;
  rawText: string;
  source?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  [k: string]: unknown;
};

// Types corresponding to the Incident Zod/Mongoose model
export type IocItem = {
  type: string;
  value: string;
  confidence: number;
}

export type SuggestedActionItem = {
  actionId: string;
  type: string;
  target: string;
  justification: string;
  kestraFlowId?: string;
}

export type IncidentItem = {
  _id: string;
  incidentId: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical" | "Informational";
  status: "New" | "Triaged" | "Investigating" | "Contained" | "Closed";
  summary: string;
  iocs: IocItem[];
  suggestedActions: SuggestedActionItem[];
  createdAt: string;
};

// --- Component Props ---
type Props = {
  open: boolean;
  onClose: () => void;
  log: LogItem | null;
  onDelete: (id: string) => void;
  onUpdate?: (updatedLog: LogItem) => void;
};

// --- Helper for Severity Badges ---
const getSeverityColor = (severity: IncidentItem['severity']) => {
  switch (severity) {
    case 'Critical': return 'bg-red-600 hover:bg-red-700 text-white';
    case 'High': return 'bg-orange-600 hover:bg-orange-700 text-white';
    case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
    case 'Low': return 'bg-green-500 hover:bg-green-600 text-white';
    default: return 'bg-gray-400 hover:bg-gray-500 text-white';
  }
}


export default function LogDetailDrawer({ open, onClose, log, onDelete, onUpdate }: Props) {
  const [loadingAI, setLoadingAI] = useState(false);
  const [incident, setIncident] = useState<IncidentItem | null>(null); // NEW: State for the Incident
  const [loadingIncident, setLoadingIncident] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  // ⭕ Fetch Incident details when a new log is selected
  useEffect(() => {
    if (log?._id) {
      setIncident(null); // Clear previous incident
      setLoadingIncident(true);
      axios.get(`/api/incidents/${log._id}`)
        .then(res => {
          if (res.data.success) {
            setIncident(res.data.incident as IncidentItem);
          } else {
            console.warn(res.data.message);
            setIncident(null);
          }
        })
        .catch(err => {
          console.error("Failed to fetch incident:", err);
          setIncident(null);
        })
        .finally(() => {
          setLoadingIncident(false);
        });
    }
  }, [log?._id]);

  // Reset action status when drawer closes
  useEffect(() => {
    if (!open) {
      setActionStatus({});
    }
  }, [open]);

  if (!log) return null;

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Re-run AI Processing (now Re-Triage)
  const handleReprocess = async () => {
    try {
      setLoadingAI(true);
      const res = await axios.post("/api/logs/reprocess", { id: log._id });

      if (res.data.success) {
        // Update selected incident and notify LogClient (though log itself is unchanged)
        setIncident(res.data.incident as IncidentItem);
      } else {
        alert(`AI re-triage failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error("Error reprocessing AI:", err);
      alert("Error reprocessing log AI");
    } finally {
      setLoadingAI(false);
    }
  };

  // ⚡️ NEW: Trigger Kestra Action
  const handleExecuteAction = async (action: SuggestedActionItem) => {
    if (!action.kestraFlowId) {
      alert("Kestra flow ID is missing for this action.");
      return;
    }
    setActionStatus(prev => ({ ...prev, [action.actionId]: 'pending' }));

    try {
      // Call the Kestra execution endpoint
      const res = await axios.post("/api/kestra/execute", {
        flowId: action.kestraFlowId,
        payload: {
          incidentId: incident?._id,
          target: action.target,
          actionType: action.type,
          logId: log._id,
        }
      });

      if (res.data.success) {
        setActionStatus(prev => ({ ...prev, [action.actionId]: 'success' }));
        alert(`Kestra Flow ${action.kestraFlowId} triggered successfully!`);
      } else {
        setActionStatus(prev => ({ ...prev, [action.actionId]: 'error' }));
        alert(`Kestra execution failed: ${res.data.message}`);
      }
    } catch (err) {
      setActionStatus(prev => ({ ...prev, [action.actionId]: 'error' }));
      console.error("Kestra execution error:", err);
      alert("Failed to connect to Kestra service.");
    }
  };


  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[550px] sm:w-[600px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Log Details</SheetTitle>
          <SheetDescription>
            {incident?.incidentId ? `Incident ID: ${incident.incidentId}` : "Raw Log Data"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 overflow-y-auto flex-1 pr-1">
          {/* Incident Loading State */}
          {loadingIncident && <p className="text-center text-sm text-muted-foreground">Loading Triage Report...</p>}

          {/* Triage Report / Incident Details */}
          {incident ? (
            <div className="space-y-4">

              {/* Severity & Status */}
              <div className="flex gap-2 items-center flex-wrap">
                {incident.severity && (
                  <Badge className={`${getSeverityColor(incident.severity)} font-bold`}>
                    {incident.severity} SEVERITY
                  </Badge>
                )}
                {incident.status && (
                  <Badge variant="outline">{incident.status}</Badge>
                )}
                {log.source && <Badge variant="secondary">Source: {log.source}</Badge>}
              </div>

              {/* Incident Title & Summary */}
              <div>
                <h3 className="text-lg font-bold mb-1">{incident.title}</h3>
                <p className="text-sm whitespace-pre-wrap">{incident.summary}</p>
              </div>

              <Separator />

              {/* IOCs (Indicators of Compromise) */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Indicators of Compromise ({incident.iocs.length})
                </h3>
                <div className="space-y-1">
                  {incident.iocs.length > 0 ? incident.iocs.map((ioc, index) => (
                    <div key={index} className="text-xs bg-muted p-2 rounded-md flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold mr-2 text-primary">{ioc.value}</span>
                        <Badge variant="secondary" className="mr-2 capitalize">{ioc.type.replace('_', ' ')}</Badge>
                      </div>
                      <span className="text-muted-foreground">Conf: {ioc.confidence}%</span>
                    </div>
                  )) : <p className="text-sm italic text-muted-foreground">No definitive IOCs found by the agent.</p>}
                </div>
              </div>

              <Separator />

              {/* Suggested Actions */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Suggested Remediation Actions
                </h3>
                <div className="space-y-2">
                  {incident.suggestedActions.map((action, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <p className="font-medium text-sm mb-1">{action.type.replace('_', ' ').toUpperCase()} <span className="text-muted-foreground">on {action.target}</span></p>
                      <p className="text-xs text-muted-foreground italic mb-3">{action.justification}</p>

                      <Button
                        size="sm"
                        className="w-full h-auto whitespace-normal py-2 text-wrap"
                        onClick={() => handleExecuteAction(action)}
                        disabled={actionStatus[action.actionId] === 'pending'}
                      >
                        {actionStatus[action.actionId] === 'pending' && 'Executing...'}
                        {actionStatus[action.actionId] === 'success' && <><CheckCircle className="w-4 h-4 mr-2" /> Executed</>}
                        {actionStatus[action.actionId] === 'error' && 'Failed'}
                        {actionStatus[action.actionId] === undefined && `Approve & Run Kestra Flow: ${action.kestraFlowId}`}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

            </div>
          ) : (
            // No Incident Found / Raw Log Only View
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground italic">
                This LogEntry has not been triaged into an Incident.
                Run AI Processing to analyze it.
              </p>
            </div>
          )}

          {/* Raw Text (Always visible) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">Raw Log Text</h3>
              <Button size="icon" variant="ghost" onClick={() => copyText(log.rawText)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{log.rawText}</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t flex flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2"
            onClick={handleReprocess}
            disabled={loadingAI}
          >
            <RefreshCcw className="w-4 h-4" />
            {loadingAI ? "Performing Re-Triage..." : "Run AI Triage / Re-Triage"}
          </Button>

          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={() => onDelete(log._id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Log
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}