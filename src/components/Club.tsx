import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Megaphone, Users, Award, Star, ChevronRight } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ClubProps {
  onBack: () => void;
}

export function Club({ onBack }: ClubProps) {
  const announcements = [
    {
      id: 1,
      title: "Mantenimiento Canchas de Tenis",
      content: "Las canchas 1 y 2 estarán cerradas por re-asfaltado el próximo lunes 12 de mayo.",
      date: "Hoy, 10:30 AM",
      category: "Infraestructura"
    },
    {
      id: 2,
      title: "Torneo Masters Padel 2026",
      content: "Inscripciones abiertas para el torneo de verano. Cupos limitados para categoría A y B.",
      date: "Ayer",
      category: "Eventos"
    }
  ];

  const gallery = [
    { id: 1, url: "https://images.unsplash.com/photo-1595435063821-689396f4236e?auto=format&fit=crop&q=80&w=800", title: "Final de Temporada" },
    { id: 2, url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800", title: "Nuevas Canchas Techadas" },
    { id: 3, url: "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?auto=format&fit=crop&q=80&w=800", title: "Clínica de Tenis Pro" },
    { id: 4, url: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?auto=format&fit=crop&q=80&w=800", title: "Evento Networking" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="glass-button py-2 px-4 flex items-center space-x-2 text-xs"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver a Inicio</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-display italic text-brand-white">Vida de Club</h2>
          <p className="text-white/40 text-sm italic">Comunidad, noticias y momentos exclusivos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* News Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Megaphone className="w-4 h-4 text-brand-gold" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Comunicados</h3>
          </div>
          
          {announcements.map((news) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded">
                  {news.category}
                </span>
                <span className="text-[10px] text-white/20 font-mono italic">{news.date}</span>
              </div>
              <h4 className="text-brand-white font-display text-lg mb-2">{news.title}</h4>
              <p className="text-white/60 text-xs leading-relaxed">{news.content}</p>
            </motion.div>
          ))}

          <div className="premium-card bg-brand-gold/5 border-brand-gold/20 flex flex-col items-center text-center p-8">
            <Award className="w-8 h-8 text-brand-gold mb-3" />
            <h4 className="text-brand-white font-display text-lg mb-1">Rankings del Club</h4>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Temporada Mayo 2026</p>
            <button className="text-xs font-bold text-brand-gold hover:underline">Ver Tablas de Clasificación</button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Galería de Momentos</h3>
            </div>
            <button className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">Ver Toda la Galería</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gallery.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-64 overflow-hidden rounded-2xl border border-white/10"
              >
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-display text-lg italic translate-y-2 group-hover:translate-y-0 transition-transform">{img.title}</p>
                  <div className="flex items-center space-x-1 text-brand-gold text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-3 h-3 fill-brand-gold" />
                    <span>Evento Destacado</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
