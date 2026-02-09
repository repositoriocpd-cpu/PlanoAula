-- 1. Adicionar coluna 'email' na tabela profiles se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email text;
    END IF;
END $$;

-- 2. Atualizar a função do trigger para salvar o email automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'teacher')
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Sincronizar (Backfill) usuários existentes da auth.users para public.profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuário sem Nome'), 
    'teacher'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email;
