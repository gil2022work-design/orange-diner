import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, Wallet, Users, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';
import type { Profile } from '@/src/lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  profile: Profile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, profile, activeTab, setActiveTab }: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Reservas', icon: Calendar },
    { id: 'wallet', label: 'Monedero', icon: Wallet },
    { id: 'community', label: 'Club', icon: Users },
    { id: 'messages', label: 'Buzón', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-brand-navy flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col pt-8 pb-4">
        <div className="px-8 mb-12">
          <h1 className="text-2xl font-display italic text-brand-gold tracking-tight">
            AceReserve
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
            Premium Club
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-brand-gold text-brand-navy" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide font-sans">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="premium-card p-4 flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-tight">
                {profile?.full_name || 'Premium Member'}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                {profile?.role || 'Socio'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-brand-navy via-brand-navy to-black/40">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
