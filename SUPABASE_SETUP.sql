-- AceReserve Premium Club: Supabase Database Schema

-- 1. Create Profiles Table (extends Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('socio', 'coach', 'admin', 'recepcion')) DEFAULT 'socio',
  saldo_monedero DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Reservas Table
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cancha_id INTEGER NOT NULL,
  deporte TEXT NOT NULL CHECK (deporte IN ('tenis', 'padel')),
  fecha_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  duracion_minutos INTEGER DEFAULT 60,
  monto_pagado DECIMAL(10,2) DEFAULT 0.00,
  estado TEXT DEFAULT 'confirmada' CHECK (estado IN ('confirmada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Transacciones Table
CREATE TABLE transacciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  monto DECIMAL(10,2) NOT NULL, -- Monto en USD
  monto_bs DECIMAL(15,2), -- Monto en Bs.
  tasa_euro DECIMAL(10,4), -- Tasa aplicada
  tipo TEXT NOT NULL CHECK (tipo IN ('recarga', 'pago_reserva', 'reembolso')),
  referencia_bancaria TEXT,
  comprobante_url TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. New Table for Daily Rates
CREATE TABLE tasas_diarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moneda TEXT DEFAULT 'EUR',
  valor DECIMAL(10,4) NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasas_diarias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasas are viewable by everyone" ON tasas_diarias FOR SELECT USING (true);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Reservas Policies
CREATE POLICY "Reservas are viewable by everyone" ON reservas
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reservations" ON reservas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON reservas
  FOR UPDATE USING (auth.uid() = user_id);

-- Transacciones Policies
CREATE POLICY "Transactions are viewable only by owner" ON transacciones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can report recharges" ON transacciones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage (Optional but recommended)
-- Create a bucket 'comprobantes' and add RLS for private access.
