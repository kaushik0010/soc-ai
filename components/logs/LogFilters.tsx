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
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onSourceChange: (s: string | null) => void;
  onClassificationChange: (s: string | null) => void;
  onSearch: (q: string) => void;
};

export default function LogFilters({
  onSourceChange,
  onClassificationChange,
  onSearch
}: Props) {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState(0);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleSourceChange = (value: string) => {
    onSourceChange(value === "all" ? null : value);
    setActiveFilters(prev => value === "all" ? prev - 1 : prev + 1);
  };

  const handleClassificationChange = (value: string) => {
    onClassificationChange(value === "all" ? null : value);
    setActiveFilters(prev => value === "all" ? prev - 1 : prev + 1);
  };

  const clearAllFilters = () => {
    onSourceChange(null);
    onClassificationChange(null);
    handleSearchChange("");
    setActiveFilters(0);
  };

  return (
    <div className="space-y-4">
      {/* Active filters indicator */}
      {activeFilters > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">{activeFilters} active filter{activeFilters !== 1 ? 's' : ''}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs, incidents, or summaries…"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 text-sm border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300 rounded-lg"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Source Filter */}
          <Select onValueChange={handleSourceChange} defaultValue="all">
            <SelectTrigger className="w-full md:w-48 h-10 text-sm border-gray-300 hover:border-indigo-300 transition-colors duration-300 rounded-lg cursor-pointer">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="manual" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Manual
                </div>
              </SelectItem>
              <SelectItem value="webhook" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  Webhook
                </div>
              </SelectItem>
              <SelectItem value="api" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  API
                </div>
              </SelectItem>
              <SelectItem value="kestra" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  Kestra
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select onValueChange={handleClassificationChange} defaultValue="all">
            <SelectTrigger className="w-full md:w-48 h-10 text-sm border-gray-300 hover:border-indigo-300 transition-colors duration-300 rounded-lg cursor-pointer">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical" className="cursor-pointer text-red-600 font-medium">
                🔴 Critical
              </SelectItem>
              <SelectItem value="High" className="cursor-pointer text-orange-600 font-medium">
                🟠 High
              </SelectItem>
              <SelectItem value="Medium" className="cursor-pointer text-yellow-600 font-medium">
                🟡 Medium
              </SelectItem>
              <SelectItem value="Low" className="cursor-pointer text-green-600 font-medium">
                🟢 Low
              </SelectItem>
              <SelectItem value="Informational" className="cursor-pointer text-gray-600">
                ⚪ Informational
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}