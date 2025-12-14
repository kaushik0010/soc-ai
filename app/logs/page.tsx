import LogPlayground from "@/components/logs/LogPlayground";
import LogsClient from "@/components/logs/LogsClient";
import React from "react";
import { Suspense } from "react";
import { Activity, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Logs · SOC-AI",
};

export default async function LogsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              Security Operations Center
              <span className="text-sm font-normal bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full">
                AI-Powered
              </span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Real-time security log monitoring, AI triage analysis, and automated incident response
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border">
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            <span>Live stream active</span>
          </div>
        </div>

        {/* Log Playground Section */}
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Terminal className="h-6 w-6 text-green-400" />
              AI Triage Playground
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              Test the Oumi AI agent with sample security logs and observe real-time triage results
            </p>
          </div>
          <div className="p-6">
            <LogPlayground />
          </div>
        </div>

        {/* Main Logs Section */}
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Security Event Logs</h2>
            <p className="text-gray-600 text-sm mt-1">
              Real-time monitoring, filtering, and management of all security events
            </p>
          </div>
          <div className="p-4">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-4 text-gray-600">Loading security logs...</span>
              </div>
            }>
              <LogsClient />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add missing icons
const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.33 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Terminal = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);