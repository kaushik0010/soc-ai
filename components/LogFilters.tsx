"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  onSourceChange: (s: string | null) => void;
  onSearch: (q: string) => void;
};

export default function LogFilters({ onSourceChange, onSearch }: Props) {
  return (
    <div className="flex gap-3 items-center">
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

      <Input
        placeholder="Search raw text…"
        onChange={(e) => onSearch(e.target.value)}
        className="w-72 h-9 text-sm"
      />
    </div>
  );
}
