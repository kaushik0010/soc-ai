"use client";

import React from 'react';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  Tooltip
} from "recharts";
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface TrendChartProps {
  data: Array<{ _id: string; count: number }>;
  title?: string;
  subtitle?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const hour = label;
    const count = payload[0].value;
    const time = `${hour}:00 - ${parseInt(hour) + 1}:00`;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-gray-900">{time}</span>
        </div>
        <p className="text-2xl font-bold text-indigo-600">{count} logs</p>
        <p className="text-sm text-gray-600">Hourly event volume</p>
      </div>
    );
  }
  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  title = "Log Activity Trend", 
  subtitle = "Last 24 hours" 
}) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Activity className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Data</h3>
        <p className="text-gray-600 max-w-xs">
          Log activity trend will appear here as events are processed.
        </p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    hour: item._id,
    count: item.count,
    time: `${item._id}:00`
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0);
  const averageCount = chartData.length > 0 ? totalCount / chartData.length : 0;
  const highAlertThreshold = averageCount * 1.5;
  const maxValue = Math.max(...chartData.map(d => d.count));

  const alertHours = chartData.filter(d => d.count > highAlertThreshold);
  const hasAlert = alertHours.length > 0;

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasAlert && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
              <AlertTriangle className="h-3 w-3" />
              {alertHours.length} alert hour{alertHours.length !== 1 ? 's' : ''}
            </div>
          )}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            <TrendingUp className="h-3 w-3" />
            {totalCount.toLocaleString()} total events
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={highAlertThreshold} 
              stroke="#EF4444" 
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: 'Alert Threshold',
                position: 'insideTopRight',
                fill: '#EF4444',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{averageCount.toFixed(0)}</div>
          <div className="text-sm text-gray-600">Avg/Hour</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{maxValue}</div>
          <div className="text-sm text-gray-600">Peak/Hour</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {hasAlert ? '🚨' : '✅'}
          </div>
          <div className="text-sm text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;