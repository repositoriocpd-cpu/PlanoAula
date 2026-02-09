-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: lessons (Aulas Diárias)
create table if not exists public.lessons (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text,
    discipline text not null,
    grade text not null,
    theme text not null,
    duration text,
    context text,
    content jsonb, -- Stores the structured AI functionality
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: annual_plans (Plano Anual)
create table if not exists public.annual_plans (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    discipline text not null,
    grade text not null,
    bimesters jsonb, -- Stores the array of bimesters
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: didactic_sequences (Sequência Didática)
create table if not exists public.didactic_sequences (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    theme text not null,
    discipline text not null,
    grade text not null,
    num_classes integer,
    objectives jsonb,
    bncc_skills jsonb,
    classes jsonb, -- Stores the array of class plans
    final_evaluation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table: assessments (Avaliações)
create table if not exists public.assessments (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text,
    discipline text not null,
    grade text not null,
    type text not null, -- 'Prova', 'Atividade', 'Rubrica', 'Diagnóstica'
    content_topic text, -- Original content input
    questions jsonb, -- Array of questions
    rubric jsonb, -- Array of rubric criteria
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Table: reports (Relatórios Individuais)
create table if not exists public.reports (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    student_name text not null,
    grade text not null,
    period text,
    content text, -- The generated report text
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.lessons enable row level security;
alter table public.annual_plans enable row level security;
alter table public.didactic_sequences enable row level security;
alter table public.assessments enable row level security;
alter table public.reports enable row level security;

-- Create Policies (Allow users to manage their own data)

-- Lessons
create policy "Users can view their own lessons" on public.lessons
    for select using (auth.uid() = user_id);
create policy "Users can insert their own lessons" on public.lessons
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own lessons" on public.lessons
    for update using (auth.uid() = user_id);
create policy "Users can delete their own lessons" on public.lessons
    for delete using (auth.uid() = user_id);

-- Annual Plans
create policy "Users can view their own annual plans" on public.annual_plans
    for select using (auth.uid() = user_id);
create policy "Users can insert their own annual plans" on public.annual_plans
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own annual plans" on public.annual_plans
    for update using (auth.uid() = user_id);
create policy "Users can delete their own annual plans" on public.annual_plans
    for delete using (auth.uid() = user_id);

-- Didactic Sequences
create policy "Users can view their own sequences" on public.didactic_sequences
    for select using (auth.uid() = user_id);
create policy "Users can insert their own sequences" on public.didactic_sequences
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own sequences" on public.didactic_sequences
    for update using (auth.uid() = user_id);
create policy "Users can delete their own sequences" on public.didactic_sequences
    for delete using (auth.uid() = user_id);

-- Assessments
create policy "Users can view their own assessments" on public.assessments
    for select using (auth.uid() = user_id);
create policy "Users can insert their own assessments" on public.assessments
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own assessments" on public.assessments
    for update using (auth.uid() = user_id);
create policy "Users can delete their own assessments" on public.assessments
    for delete using (auth.uid() = user_id);

-- Reports
create policy "Users can view their own reports" on public.reports
    for select using (auth.uid() = user_id);
create policy "Users can insert their own reports" on public.reports
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own reports" on public.reports
    for update using (auth.uid() = user_id);
create policy "Users can delete their own reports" on public.reports
    for delete using (auth.uid() = user_id);
