create table if not exists public.lesson_plans (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null default auth.uid(),
    title text,
    discipline text,
    grade text,
    theme text,
    duration text,
    context text,
    content jsonb, -- Stores the AI structured data
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.lesson_plans enable row level security;

-- Policies
create policy "Users can view own lesson plans" on public.lesson_plans
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own lesson plans" on public.lesson_plans
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can delete own lesson plans" on public.lesson_plans
    for delete to authenticated using (auth.uid() = user_id);
