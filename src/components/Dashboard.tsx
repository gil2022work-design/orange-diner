import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Wallet, Clock, Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { supabase, type Reserva, type Profile } from '@/src/lib/supabase';
import { CLUB_CONFIG } from '@/src/constants';
import { CourtGrid } from './CourtGrid';

interface DashboardProps {
  profile: Profile | null;
}

export function Dashboard({ profile }: DashboardProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [activeSport, setActiveSport] = useState<'tenis' | 'padel'>('tenis');

  useEffect(() => {
    fetchReservas();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('reservas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservas' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchReservas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchReservas() {
    const { data } = await supabase
      .from('reservas')
      .select('*')
      .eq('estado', 'confirmada')
      .gte('fecha_reserva', new Date().toISOString().split('T')[0]);
    
    if (data) setReservas(data);
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-display italic text-brand-white">
            Bienvenido, <span className="text-brand-gold">{profile?.full_name?.split(' ')[0] || 'Premium'}</span>
          </h2>
          <p className="text-white/40 mt-1 tracking-wide">Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="glass-button flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="premium-card relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Saldo Monedero</p>
          <h3 className="text-3xl font-display text-brand-gold">{formatCurrency(profile?.saldo_monedero || 0)}</h3>
          <div className="flex items-center text-[10px] text-green-400 mt-2">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Listo para reservar</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="premium-card relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-24 h-24" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Próxima Reserva</p>
          <h3 className="text-2xl font-display text-white">Mañana, 10:00 AM</h3>
          <p className="text-xs text-white/40 mt-2">Cancha 3 - Tenis</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="premium-card relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Nivel Socio</p>
          <h3 className="text-2xl font-display text-white">Platinum Member</h3>
          <p className="text-xs text-brand-gold mt-2">Beneficios exclusivos activos</p>
        </motion.div>
      </div>

      {/* Main Availability Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveSport('tenis')}
              className={cn(
                "text-lg font-display italic transition-all",
                activeSport === 'tenis' ? "text-brand-gold border-b-2 border-brand-gold pb-4" : "text-white/40 hover:text-white"
              )}
            >
              Tenis ({CLUB_CONFIG.deportes.tenis.canchas} Canchas)
            </button>
            <button 
              onClick={() => setActiveSport('padel')}
              className={cn(
                "text-lg font-display italic transition-all",
                activeSport === 'padel' ? "text-brand-gold border-b-2 border-brand-gold pb-4" : "text-white/40 hover:text-white"
              )}
            >
              Pádel ({CLUB_CONFIG.deportes.padel.canchas} Canchas)
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
          <CourtGrid activeSport={activeSport} reservas={reservas} />
        </div>
      </div>
    </div>
  );
}
