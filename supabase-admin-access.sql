-- Run this in the Supabase SQL Editor after registering your private builder account.
-- Never store an administrator password in frontend code or source control.
-- Replace the email address below with the account you created through OPERITRON.COM.

update public.profiles
set role = 'admin',
    updated_at = now()
where lower(email) = lower('your-admin-email@example.com');

select id, email, role, subscription_status
from public.profiles
where role = 'admin';
