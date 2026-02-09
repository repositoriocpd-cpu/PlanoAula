-- 1. Table: annual_plans
create table if not exists public.annual_plans (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null default auth.uid(),
    discipline text,
    grade text,
    bimesters jsonb, -- Stores the list of bimesters structure
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.annual_plans enable row level security;
create policy "Users can view own annual plans" on public.annual_plans for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own annual plans" on public.annual_plans for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own annual plans" on public.annual_plans for delete to authenticated using (auth.uid() = user_id);

-- 2. Table: didactic_sequences
create table if not exists public.didactic_sequences (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null default auth.uid(),
    theme text,
    discipline text,
    grade text,
    num_classes integer,
    objectives jsonb, -- Array of strings
    bncc_skills jsonb, -- Array of strings
    classes jsonb, -- Array of class objects
    final_evaluation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.didactic_sequences enable row level security;
create policy "Users can view own sequences" on public.didactic_sequences for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own sequences" on public.didactic_sequences for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own sequences" on public.didactic_sequences for delete to authenticated using (auth.uid() = user_id);

-- 3. Table: assessments
create table if not exists public.assessments (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null default auth.uid(),
    title text,
    discipline text,
    grade text,
    type text,
    content text, -- Topic/Context
    questions jsonb, -- Array of questions
    rubric jsonb, -- Rubric criteria
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.assessments enable row level security;
create policy "Users can view own assessments" on public.assessments for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own assessments" on public.assessments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own assessments" on public.assessments for delete to authenticated using (auth.uid() = user_id);

-- 4. Table: reports
create table if not exists public.reports (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null default auth.uid(),
    student_name text,
    grade text,
    period text,
    content text, -- Full report text
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.reports enable row level security;
create policy "Users can view own reports" on public.reports for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own reports" on public.reports for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own reports" on public.reports for delete to authenticated using (auth.uid() = user_id);
