import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm hover:shadow-md transition-all flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">{title}</p>
        <h3 className="font-serif text-3xl font-extrabold text-[#0B132B]">{value}</h3>
        {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
        {trend && (
          <span className="inline-block mt-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {trend}
          </span>
        )}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] flex items-center justify-center text-[#C5A059] shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
