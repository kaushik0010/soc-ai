"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle, BarChart3, TrendingUp, Eye } from 'lucide-react';

interface SeverityPieProps {
  data: Record<string, number>;
  total: number;
}

const severityColors: Record<string, string> = {
  'Critical': '#EF4444', // red-500
  'High': '#F97316', // orange-500
  'Medium': '#EAB308', // yellow-500
  'Low': '#3B82F6', // blue-500
  'Informational': '#10B981', // emerald-500
};

const severityIcons: Record<string, React.ReactNode> = {
  'Critical': <AlertTriangle className="h-4 w-4" />,
  'High': <AlertTriangle className="h-4 w-4" />,
  'Medium': <BarChart3 className="h-4 w-4" />,
  'Low': <TrendingUp className="h-4 w-4" />,
  'Informational': <Eye className="h-4 w-4" />,
};

const SeverityPie: React.FC<SeverityPieProps> = ({ data, total }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Incidents Yet</h3>
        <p className="text-gray-600 max-w-xs">
          Incident severity distribution will appear here as triage results come in.
        </p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / total) * 100).toFixed(1),
    color: severityColors[name] || '#6B7280',
  }));

  const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-gray-900">{data.name}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.value} incidents</p>
          <p className="text-gray-600">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Severity Distribution
          </h3>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-900">{total}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {sortedData.map((item, index) => (
            <div 
              key={item.name}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${
                activeIndex === index ? 'bg-gray-50 border-gray-300' : 'border-gray-200'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-md" 
                     style={{ backgroundColor: `${item.color}20` }}>
                  <div style={{ color: item.color }}>
                    {severityIcons[item.name] || severityIcons['Informational']}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 text-lg">{item.value}</div>
                <div className="text-xs text-gray-500">incidents</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeverityPie;