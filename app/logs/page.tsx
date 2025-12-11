// src/app/logs/page.tsx
import LogsClient from "@/components/logs/LogsClient";
import React from "react";
import { Suspense } from "react";

export const metadata = {
  title: "Logs · SOC-AI",
};

export default async function LogsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Logs</h1>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <Suspense fallback={<div className="text-sm text-muted-foreground">Loading logs UI...</div>}>
            <LogsClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
