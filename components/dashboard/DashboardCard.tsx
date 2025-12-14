import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  color: string;
  trend?: number;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  description, 
  color, 
  trend = 0,
  icon 
}) => {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Glow effect on hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      <div className="relative p-6 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
              {title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {value}
              </p>
              {trend !== 0 && (
                <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="ml-1">{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          </div>
          
          {icon && (
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-opacity-20`}>
              {icon}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;