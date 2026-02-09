-- Drop existing restrictive policy
drop policy if exists "Users can view own profile" on public.profiles;

-- Create new policies
-- 1. View: Allow authenticated users to view all profiles (so Admins/Teachers can see colleagues)
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- 2. Update: Allow users to update their own profile OR Admins to update any
create policy "Users can update own profile or Admin updates all"
  on public.profiles for update
  to authenticated
  using (
    auth.uid() = id OR 
    (select role from public.profiles where id = auth.uid()) = 'admin'
  )
  with check (
    auth.uid() = id OR 
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Ensure the trigger handles metadata correctly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    coalesce(new.raw_user_meta_data->>'role', 'teacher')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Add email column to profiles if it doesn't exist (it was missing in previous definition but used in UI logic)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;
end $$;
