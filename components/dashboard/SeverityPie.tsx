// components/dashboard/SeverityPie.tsx
import React from 'react';

interface SeverityPieProps {
  data: Record<string, number>; // e.g., { Critical: 5, High: 10, Medium: 20 }
  total: number;
}

const severityColors: Record<string, string> = {
  'Critical': 'text-red-600',
  'High': 'text-orange-500',
  'Medium': 'text-yellow-500',
  'Low': 'text-blue-500',
  'Informational': 'text-green-500',
};

const SeverityPie: React.FC<SeverityPieProps> = ({ data, total }) => {
  if (total === 0) {
    return <div className="text-gray-500 text-center py-4">No incidents triaged yet.</div>;
  }

  const sortedSeverities = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-4">
      {sortedSeverities.map(([severity, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const color = severityColors[severity] || 'text-gray-400';

        return (
          <div key={severity} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className={`font-medium text-sm ${color}`}>{severity}</span>
              <span className="text-gray-700 font-semibold">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${color.replace('text-', 'bg-')}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SeverityPie;