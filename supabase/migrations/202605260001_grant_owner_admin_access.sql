begin;

-- Grant owner access without changing billing status. The admin role is an
-- intentional product-access bypass for the authenticated platform owner.
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

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company',
    new.raw_user_meta_data ->> 'phone',
    case when lower(coalesce(new.email, '')) = 'tormentor738@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do update
  set email = excluded.email,
      role = case
        when lower(excluded.email) = 'tormentor738@gmail.com' then 'admin'
        else profiles.role
      end,
      updated_at = now();
  return new;
end;
$$;

commit;
