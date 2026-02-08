import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = "text-blue-400" }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-slate-700/50 ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};
