// components/dashboard/TrendChart.tsx
"use client";

import React from 'react';
// 🚨 Import necessary Recharts components and Shadcn wrappers 🚨
import { Bar, BarChart, XAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"; // ADJUST THIS PATH IF NECESSARY

interface TrendChartProps {
  data: Array<{ _id: string; count: number }>; // Array of hourly counts
}

// Define chart configuration colors and keys
const chartConfig = {
  total: {
    label: "Log Count",
    color: "hsl(222.2 47.4% 11.2%)", // Shadcn primary/dark color
  },
  spike: {
    label: "Spike",
    color: "hsl(0 84.2% 60.2%)", // Shadcn destructive/red color
  }
} satisfies Record<string, { label: string; color: string }>;


const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="text-gray-500 text-center py-4">No log trend data available for the last 24 hours.</div>;
  }

  // 1. Prepare Data for Charting and Calculate Threshold
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);
  const averageCount = data.length > 0 ? (totalCount / data.length) : 0;
  const highAlertThreshold = averageCount * 1.5;

  // Map data to include the 'total' value and a 'spike' value if it crosses the threshold
  const chartData = data.map(item => ({
    hour: item._id, 
    total: item.count, 
    // Conditional value for the red spike overlay
    spike: item.count > highAlertThreshold ? item.count : 0,
    // Add the timestamp for sorting/display
    timestamp: new Date(item._id).getTime(), 
  }));

  // Find the maximum value to correctly set the domain
  const maxValue = Math.max(...data.map(d => d.count));
  
  // Define the configuration object for the ChartContainer
  const chartProps = {
    data: chartData,
    config: chartConfig,
    yDomain: [0, maxValue * 1.1], // Set domain slightly above max value
  };

  return (
    <div className="h-[250px] w-full">
      <ChartContainer
        config={chartProps.config}
        // data={chartProps.data}
        className="w-full h-full"
      >
        <BarChart
          accessibilityLayer
          data={chartProps.data}
          margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
        >
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}h`} // Add 'h' for hour
            className='text-xs'
          />
          {/* Note: YAxis is often omitted in small trend charts for minimalism.
             If needed, uncomment and configure YAxis */}
          
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          
          {/* Bar 1: The standard blue/indigo bar (The base log count) */}
          <Bar 
            dataKey="total" 
            fill="var(--color-total)" 
            radius={4} 
            className="opacity-70"
          />

          {/* Bar 2: The Red/Spike overlay. Only renders if 'spike' is > 0 */}
          <Bar 
            dataKey="spike" 
            fill="var(--color-spike)" 
            radius={4} 
            stackId="a" // Using stackId to layer the bars
            className="opacity-95"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TrendChart;