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
import { Copy, Trash2, RefreshCcw, Zap, AlertTriangle, CheckCircle, Clock, Shield, FileText, X } from 'lucide-react';
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import OumiFeedbackModal from "./OumiFeedbackModal";

export type LogItem = {
  _id: string;
  rawText: string;
  source?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  [k: string]: unknown;
};

export type IocItem = {
  type: string;
  value: string;
  confidence: number;
};

export type SuggestedActionItem = {
  actionId: string;
  type: string;
  target: string;
  justification: string;
  kestraFlowId?: string;
};

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

type Props = {
  open: boolean;
  onClose: () => void;
  log: LogItem | null;
  onDelete: (id: string) => void;
  onUpdate?: (updatedLog: LogItem) => void;
};

const getSeverityColor = (severity: IncidentItem['severity']) => {
  switch (severity) {
    case 'Critical': return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg';
    case 'High': return 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md';
    case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 shadow-sm';
    case 'Low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Triaged': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Investigating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Contained': return 'bg-green-100 text-green-800 border-green-200';
    case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function LogDetailDrawer({ open, onClose, log, onDelete, onUpdate }: Props) {
  const [loadingAI, setLoadingAI] = useState(false);
  const [incident, setIncident] = useState<IncidentItem | null>(null);
  const [loadingIncident, setLoadingIncident] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  const fetchIncidentDetails = () => {
    if (log?._id) {
      setIncident(null);
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
  };

  useEffect(() => {
    fetchIncidentDetails();
  }, [log?._id]);

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

  const handleReprocess = async () => {
    try {
      setLoadingAI(true);
      const res = await axios.post("/api/logs/reprocess", { id: log._id });
      if (res.data.success) {
        setIncident(res.data.incident as IncidentItem);
      }
    } catch (err) {
      console.error("Error reprocessing AI:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExecuteAction = async (action: SuggestedActionItem) => {
    if (!action.kestraFlowId) return;
    setActionStatus(prev => ({ ...prev, [action.actionId]: 'pending' }));
    try {
      const res = await axios.post("/api/kestra/execute", {
        flowId: action.kestraFlowId,
        payload: { incidentId: incident?._id, target: action.target, actionType: action.type, logId: log._id }
      });
      if (res.data.success) {
        setActionStatus(prev => ({ ...prev, [action.actionId]: 'success' }));
      } else {
        setActionStatus(prev => ({ ...prev, [action.actionId]: 'error' }));
      }
    } catch (err) {
      setActionStatus(prev => ({ ...prev, [action.actionId]: 'error' }));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[700px] lg:w-[800px] xl:w-[900px] flex flex-col p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click if needed
      >
        {/* Custom Close Button - positioned absolutely */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 h-8 w-8 cursor-pointer rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
        >
          <X className="h-4 w-4 text-gray-700" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-50 to-purple-50 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="pr-10"> {/* Add padding to prevent text overlap with close button */}
              <SheetTitle className="text-xl font-bold text-gray-900">Security Incident Details</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <FileText className="h-3 w-3" />
                {incident?.incidentId ? `Incident ID: ${incident.incidentId}` : "Raw Log Inspection"}
              </SheetDescription>
            </div>
            
            <div className="flex items-center gap-3">
              {incident && (
                <OumiFeedbackModal 
                  incidentId={incident.incidentId}
                  onFeedbackSubmitted={fetchIncidentDetails}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Loading State */}
          {loadingIncident && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading triage report...</span>
            </div>
          )}

          {/* Triage Report */}
          {incident ? (
            <div className="space-y-6 animate-fade-in">
              {/* Incident Header */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${getSeverityColor(incident.severity)} font-bold px-4 py-2 text-sm min-w-[100px] text-center`}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(incident.status)} border px-3 py-2`}>
                      {incident.status}
                    </Badge>
                    {log.source && (
                      <Badge variant="secondary" className="px-3 py-2">
                        Source: {log.source}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created {new Date(incident.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{incident.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50/50 p-4 rounded-lg border text-sm lg:text-base">
                  {incident.summary}
                </p>
              </div>

              {/* IOCs Section */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Indicators of Compromise ({incident.iocs.length})
                </h3>
                {incident.iocs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {incident.iocs.map((ioc, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border hover:shadow-md transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize self-start">
                            {ioc.type.replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                              {ioc.confidence}% confidence
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-sm break-all bg-gray-900 text-gray-100 p-3 rounded border">
                          {ioc.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 italic">
                    No definitive IOCs identified by the AI agent
                  </div>
                )}
              </div>

              {/* Suggested Actions */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Recommended Actions ({incident.suggestedActions.length})
                </h3>
                <div className="space-y-4">
                  {incident.suggestedActions.map((action, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4 text-indigo-600" />
                            <span className="font-bold text-gray-900 uppercase text-sm lg:text-base">
                              {action.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{action.target}</p>
                        </div>
                        {action.kestraFlowId && (
                          <Badge variant="outline" className="border-indigo-300 text-indigo-700 self-start sm:self-auto">
                            Flow: {action.kestraFlowId}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-4 italic border-l-4 border-indigo-400 pl-3 py-1">
                        {action.justification}
                      </p>
                      <Button
                        size="sm"
                        className={`w-full h-auto py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                          actionStatus[action.actionId] === 'success'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : actionStatus[action.actionId] === 'error'
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        }`}
                        onClick={() => handleExecuteAction(action)}
                        disabled={actionStatus[action.actionId] === 'pending'}
                      >
                        {actionStatus[action.actionId] === 'pending' && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        {actionStatus[action.actionId] === 'pending' && 'Executing...'}
                        {actionStatus[action.actionId] === 'success' && (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Action Executed
                          </>
                        )}
                        {actionStatus[action.actionId] === 'error' && 'Execution Failed'}
                        {actionStatus[action.actionId] === undefined && `Execute via Kestra`}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border shadow-sm text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Triage Report Available</h3>
              <p className="text-gray-600 mb-6">
                This log has not been processed by the AI triage agent yet.
              </p>
            </div>
          )}

          {/* Raw Text Section */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Raw Log Text
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyText(log.rawText)}
                  className="cursor-pointer transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">
              {log.rawText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t p-6 space-y-3">
          <Button
            variant="secondary"
            className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 cursor-pointer group"
            onClick={handleReprocess}
            disabled={loadingAI}
          >
            <RefreshCcw className={`h-5 w-5 mr-3 ${loadingAI ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            {loadingAI ? "AI Triage in Progress..." : "Re-run AI Triage Analysis"}
          </Button>
          
          <Button
            variant="destructive"
            className="w-full py-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 hover:text-red-800 hover:border-red-300 transition-all duration-300 cursor-pointer"
            onClick={() => onDelete(log._id)}
          >
            <Trash2 className="h-5 w-5 mr-3" />
            Delete Log Entry
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}