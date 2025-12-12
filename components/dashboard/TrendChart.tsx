// components/dashboard/TrendChart.tsx
import React from 'react';

interface TrendChartProps {
  data: Array<{ _id: string; count: number }>; // Array of hourly counts
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="text-gray-500 text-center py-4">No log trend data available for the last 24 hours.</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count));
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col h-full justify-end">
      <div className="flex items-end h-48 border-b border-gray-300 pb-1">
        {data.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const isHighAlert = item.count > (totalCount / data.length) * 1.5; // Simple heuristic for a spike

          return (
            <div key={index} className="flex flex-col items-center flex-1 h-full px-1 group relative">
              <div 
                className={`w-full rounded-t-lg transition-all duration-300 ${isHighAlert ? 'bg-red-500' : 'bg-indigo-400'}`} 
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1 absolute bottom-0 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                {item._id} ({item.count})
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>Oldest Logs</span>
        <span>Most Recent Logs</span>
      </div>
    </div>
  );
};

export default TrendChart;