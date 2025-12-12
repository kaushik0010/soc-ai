// components/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  color: string; // Tailwind color class for background, e.g., 'bg-red-500'
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, color }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-[1.01] ${color} text-white`}>
      <h3 className="text-lg font-semibold opacity-80 mb-1">{title}</h3>
      <p className="text-4xl font-extrabold mb-2">
        {value}
      </p>
      <p className="text-sm opacity-90 border-t border-white border-opacity-30 pt-2">
        {description}
      </p>
    </div>
  );
};

export default DashboardCard;