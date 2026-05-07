import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';
import { CLUB_CONFIG } from '@/src/constants';
import type { Reserva, Cancha } from '@/src/lib/supabase';

interface CourtGridProps {
  activeSport: 'tenis' | 'padel';
  reservas: Reserva[];
}

const HOURS = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`);

export function CourtGrid({ activeSport, reservas }: CourtGridProps) {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCanchas() {
      const { data } = await supabase
        .from('courts')
        .select('*')
        .eq('deporte', activeSport)
        .eq('esta_disponible', true)
        .order('numero', { ascending: true });
      
      if (data) setCanchas(data);
      setLoading(false);
    }
    fetchCanchas();
  }, [activeSport]);

  async function handleClick(court: Cancha, hour: string, isReserved: boolean, existingReserva?: Reserva) {
    if (isReserved) {
      const { data: { user } } = await supabase.auth.getUser();
      if (existingReserva?.user_id === user?.id) {
        const now = new Date();
        const resDate = new Date(`${existingReserva.fecha_reserva}T${existingReserva.hora_inicio}`);
        const diffMs = resDate.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins > 60) {
          if (confirm('¿Deseas cancelar esta reserva? El monto será reembolsado a tu monedero.')) {
            const { error } = await supabase
              .from('reservas')
              .update({ estado: 'cancelada' })
              .eq('id', existingReserva.id);
            if (error) alert(error.message);
          }
        } else {
          alert('Las cancelaciones deben realizarse con al menos 60 minutos de antelación.');
        }
      }
      return;
    }

    if (confirm(`¿Reservar ${court.nombre} a las ${hour}? Precio: $${court.precio_hora}`)) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase.from('reservas').insert({
        user_id: userData.user.id,
        cancha_id: court.numero,
        deporte: activeSport,
        fecha_reserva: new Date().toISOString().split('T')[0],
        hora_inicio: hour,
        duracion_minutos: 60,
        monto_pagado: court.precio_hora,
        estado: 'confirmada'
      });

      if (error) alert(error.message);
    }
  }

  if (loading) return <div className="h-64 flex items-center justify-center text-white/20 italic">Cargando disponibilidad...</div>;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header - Court Numbers */}
        <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(80px,1fr))] mb-4 border-b border-white/5 pb-4">
          <div className="text-[10px] uppercase font-bold tracking-widest text-white/20">Horario</div>
          {canchas.map(court => (
            <div key={court.id} className="text-center px-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Cancha</span>
              <div className="text-xl font-display italic text-brand-gold truncate" title={court.nombre}>{court.numero}</div>
            </div>
          ))}
        </div>
        
        {/* Rows - Hours */}
        <div className="space-y-4">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-[100px_repeat(auto-fill,minmax(80px,1fr))] items-center gap-4">
              <div className="text-sm font-medium text-white/40 font-mono tracking-tighter">
                {hour}
              </div>
              
              {canchas.map(court => {
                const existing = reservas.find(r => 
                  r.deporte === activeSport && 
                  r.cancha_id === court.numero && 
                  r.hora_inicio === hour &&
                  r.estado === 'confirmada'
                );
                const isReserved = !!existing;
                
                return (
                  <motion.button
                    key={`${court.id}-${hour}`}
                    onClick={() => handleClick(court, hour, isReserved, existing)}
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "h-12 rounded-xl border transition-all duration-300 relative group",
                      isReserved 
                        ? "bg-white/5 border-white/5" 
                        : "bg-brand-gold/5 border-brand-gold/20 hover:border-brand-gold/60 hover:bg-brand-gold/10"
                    )}
                  >
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-tighter",
                      isReserved ? "text-white/20" : "text-brand-gold/60"
                    )}>
                      {isReserved ? 'Ocupada' : 'Libre'}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-brand-gold/20 border border-brand-gold/40" />
          <span className="text-[10px] uppercase tracking-widest text-white/40">Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
          <span className="text-[10px] uppercase tracking-widest text-white/40">Ocupada</span>
        </div>
      </div>
    </div>
  );
}
