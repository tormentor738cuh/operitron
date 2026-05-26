-- Operitron owner admin access helper.
-- Run this once in the Supabase SQL Editor after migrations have created public.profiles.
-- It assigns product-builder access to the authenticated owner account only.

insert into public.profiles (id, email, role, subscription_status)
select
  users.id,
  coalesce(users.email, ''),
  'admin',
  'inactive'
from auth.users as users
where lower(coalesce(users.email, '')) = 'tormentor738@gmail.com'
on conflict (id) do update
set email = excluded.email,
    role = 'admin',
    updated_at = now();

select id, email, role, subscription_status
from public.profiles
where lower(email) = 'tormentor738@gmail.com';
