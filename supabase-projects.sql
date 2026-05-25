create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  phone text,
  stripe_customer_id text unique,
  subscription_id text,
  subscription_status text not null default 'inactive',
  subscription_plan text not null default 'Free Trial',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id bigint primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text,
  address text,
  arv numeric default 0,
  purchase numeric default 0,
  repairs numeric default 0,
  expenses numeric default 0,
  rent numeric default 0,
  profit numeric default 0,
  date text,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Users can read their own projects" on public.projects;
create policy "Users can read their own projects"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Users can insert their own projects"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Users can delete their own projects"
on public.projects for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update using (auth.uid() = id)
with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (full_name, company, phone, updated_at) on public.profiles to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();
