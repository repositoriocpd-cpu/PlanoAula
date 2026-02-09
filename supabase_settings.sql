-- 1. Table: profiles (Extends auth.users)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text,
    role text default 'teacher', -- 'admin' or 'teacher'
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'teacher');
  return new;
end;
$$ language plpgsql security definer;

-- Check if trigger exists before creating to avoid errors in repeated runs
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;

-- 2. Table: school_settings (Dados da Escola)
create table if not exists public.school_settings (
    id uuid not null default uuid_generate_v4() primary key,
    school_name text not null,
    address text,
    phone text,
    email text,
    principal_name text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: system_logs (Log do Sistema)
create table if not exists public.system_logs (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id),
    action text not null, -- e.g., 'LOGIN', 'CREATE_PLAN', 'UPDATE_SETTINGS'
    details jsonb,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.school_settings enable row level security;
alter table public.system_logs enable row level security;

-- Policies

-- Profiles: Users see their own, Admins see all
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);

-- School Settings: Readable by all authenticated, Updatable by Admin (simplified to all for now/MVP)
create policy "Authenticated users can read school settings" on public.school_settings
    for select to authenticated using (true);
create policy "Authenticated users can update school settings" on public.school_settings
    for insert to authenticated with check (true);
create policy "Authenticated users can update school settings 2" on public.school_settings
    for update to authenticated using (true);

-- Logs: Admins see all (simplified to authenticated for MVP dashboard demo)
create policy "Authenticated users can read logs" on public.system_logs
    for select to authenticated using (true);
create policy "System can insert logs" on public.system_logs
    for insert to authenticated with check (true);
