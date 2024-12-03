import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqwupflrkgjagflgoowy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd3VwZmxya2dqYWdmbGdvb3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTk1NjEsImV4cCI6MjA0ODczNTU2MX0.9nn5K5i03ugGKdC2ouW_SFBpQVMxfoe14rf8mKViCVw'; // Your anon key

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema:
/*
create table users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text not null,
  role text not null check (role in ('Administrador', 'Operario')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table tasks (
  id uuid default uuid_generate_v4() primary key,
  reference text unique not null,
  status text not null check (status in ('Taller', 'Presupuesto', 'Pendiente de repuesto', 'Hecho')),
  previous_status text check (previous_status in ('Taller', 'Presupuesto', 'Pendiente de repuesto', 'Hecho')),
  created_by text references users(email) not null,
  updated_by text references users(email) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table logs (
  id uuid default uuid_generate_v4() primary key,
  task_reference text references tasks(reference) not null,
  previous_status text check (previous_status in ('Taller', 'Presupuesto', 'Pendiente de repuesto', 'Hecho')),
  new_status text not null check (new_status in ('Taller', 'Presupuesto', 'Pendiente de repuesto', 'Hecho')),
  user_email text references users(email) not null,
  user_name text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial admin user
insert into users (email, name, role) values ('admin@admin', 'Administrador', 'Administrador');

-- Create RLS policies
alter table users enable row level security;
alter table tasks enable row level security;
alter table logs enable row level security;

-- Users policies
create policy "Users can view all users"
  on users for select
  using (true);

create policy "Only admins can insert users"
  on users for insert
  using (exists (
    select 1 from users
    where users.email = auth.email()
    and users.role = 'Administrador'
  ));

create policy "Only admins can update users"
  on users for update
  using (exists (
    select 1 from users
    where users.email = auth.email()
    and users.role = 'Administrador'
  ));

create policy "Only admins can delete users"
  on users for delete
  using (exists (
    select 1 from users
    where users.email = auth.email()
    and users.role = 'Administrador'
  ));

-- Tasks policies
create policy "Users can view all tasks"
  on tasks for select
  using (true);

create policy "Authenticated users can create tasks"
  on tasks for insert
  with check (exists (
    select 1 from users
    where users.email = auth.email()
  ));

create policy "Users can update task status"
  on tasks for update
  using (exists (
    select 1 from users
    where users.email = auth.email()
  ));

create policy "Only admins can update task reference"
  on tasks for update
  using (exists (
    select 1 from users
    where users.email = auth.email()
    and users.role = 'Administrador'
  ));

-- Logs policies
create policy "Users can view all logs"
  on logs for select
  using (true);

create policy "Users can create logs"
  on logs for insert
  with check (exists (
    select 1 from users
    where users.email = auth.email()
  ));
*/