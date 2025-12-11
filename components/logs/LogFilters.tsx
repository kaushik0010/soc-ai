"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Props = {
  onSourceChange: (s: string | null) => void;
  onClassificationChange: (s: string | null) => void; // Now handles Incident Severity
  onSearch: (q: string) => void;
};

export default function LogFilters({
  onSourceChange,
  onClassificationChange,
  onSearch
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* SOURCE FILTER */}
      <Select onValueChange={(v) => onSourceChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-44 h-9 text-sm">
          <SelectValue placeholder="All sources" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="webhook">Webhook</SelectItem>
          <SelectItem value="api">API</SelectItem>
          <SelectItem value="kestra">Kestra</SelectItem>
        </SelectContent>
      </Select>

      {/* CLASSIFICATION FILTER -> NOW INCIDENT SEVERITY FILTER */}
      <Select onValueChange={(v) => onClassificationChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-44 h-9 text-sm">
          <SelectValue placeholder="All severities" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="Critical">Critical</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Informational">Informational</SelectItem>
        </SelectContent>
      </Select>

      {/* SEARCH INPUT */}
      <Input
        placeholder="Search raw text or summary…"
        onChange={(e) => onSearch(e.target.value)}
        className="w-72 h-9 text-sm"
      />
    </div>
  );
}