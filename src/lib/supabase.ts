import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'socio' | 'coach' | 'admin' | 'recepcion';
  saldo_monedero: number;
  updated_at: string;
};

export type Reserva = {
  id: string;
  user_id: string;
  cancha_id: number;
  deporte: 'tenis' | 'padel';
  fecha_reserva: string;
  hora_inicio: string;
  duracion_minutos: number;
  monto_pagado: number;
  estado: 'confirmada' | 'cancelada';
  created_at: string;
};

export type Transaccion = {
  id: string;
  user_id: string;
  monto: number;
  monto_bs: number | null;
  tasa_euro: number | null;
  tipo: 'recarga' | 'pago_reserva' | 'reembolso';
  referencia_bancaria: string | null;
  comprobante_url: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  created_at: string;
};

export type TasaDiaria = {
  id: string;
  moneda: string;
  valor: number;
  fecha: string;
  created_at: string;
};

export type Cancha = {
  id: number;
  numero: number;
  nombre: string;
  deporte: 'tenis' | 'padel';
  precio_hora: number;
  esta_disponible: boolean;
};
