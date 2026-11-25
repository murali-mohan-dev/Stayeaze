import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Bell, Sparkles } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-[#EBE3D5] px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-stone-600">Enterprise Live Management Node</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 pl-4 border-l border-stone-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C5A059]"
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#0B132B]">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
