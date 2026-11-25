import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarCheck,
  Users,
  CreditCard,
  MessageSquare,
  ConciergeBell,
  ArrowLeft,
  Crown,
  Tag,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Analytics & Overview', icon: LayoutDashboard },
    { id: 'hotels', label: 'Hotel Management', icon: Building2 },
    { id: 'rooms', label: 'Room Categories', icon: BedDouble },
    { id: 'bookings', label: 'All Reservations', icon: CalendarCheck },
    { id: 'services', label: 'Room Service Requests', icon: ConciergeBell },
    { id: 'coupons', label: 'Promotional Coupons', icon: Tag },
    { id: 'customers', label: 'Guest Directory', icon: Users },
    { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
    { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#0B132B] text-stone-300 min-h-screen p-5 flex flex-col justify-between shrink-0 border-r border-[#C5A059]/30">
      <div>
        {/* Brand */}
        <div className="flex items-center space-x-3 pb-6 border-b border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-[#1C2541] flex items-center justify-center border border-[#C5A059]">
            <Crown className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-white leading-tight">StayEase</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C5A059] text-[#0B132B] font-bold shadow-lg scale-[1.02]'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B132B]' : 'text-[#C5A059]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Return to website */}
      <div className="pt-6 border-t border-stone-800">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>Exit to Main Site</span>
        </Link>
      </div>
    </aside>
  );
};
