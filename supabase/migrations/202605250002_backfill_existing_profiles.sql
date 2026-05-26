begin;

-- Accounts created before the signup trigger was installed have no public profile.
insert into public.profiles (id, email, full_name, company, phone)
select
  users.id,
  coalesce(users.email, ''),
  users.raw_user_meta_data ->> 'full_name',
  users.raw_user_meta_data ->> 'company',
  users.raw_user_meta_data ->> 'phone'
from auth.users as users
on conflict (id) do update
set email = excluded.email,
    updated_at = now();

commit;
