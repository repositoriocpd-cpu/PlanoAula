-- CORREÇÃO DE RLS PARA VISIBILIDADE DE USUÁRIOS
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Remover políquota antiga que limitava a visão apenas ao próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Permitir que qualquer usuário autenticado veja a lista de perfis (necessário para a tela de gerenciamento)
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Permitir que o próprio usuário atualize seu perfil
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 4. Permitir que administradores atualizem qualquer perfil
-- Observação: Assume que o campo 'role' existe e pode ser 'admin'
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
