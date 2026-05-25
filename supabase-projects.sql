create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  phone text,
  stripe_customer_id text unique,
  subscription_id text,
  subscription_status text not null default 'inactive',
  subscription_plan text not null default 'No subscription',
  is_admin boolean not null default false,
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

create table if not exists public.analyses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id bigint references public.projects(id) on delete set null,
  inputs jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  plan text not null,
  status text not null,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles alter column subscription_plan set default 'No subscription';
alter table public.projects enable row level security;
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.subscriptions enable row level security;

create or replace function public.has_product_access(check_user uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user
      and (subscription_status in ('active', 'trialing') or is_admin = true)
  );
$$;
revoke all on function public.has_product_access(uuid) from public;
grant execute on function public.has_product_access(uuid) to authenticated;

drop policy if exists "Users can read their own projects" on public.projects;
create policy "Users can read their own projects"
on public.projects for select
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Users can insert their own projects"
on public.projects for insert
with check (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = user_id and public.has_product_access(auth.uid()))
with check (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Users can delete their own projects"
on public.projects for delete
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read their own analyses" on public.analyses;
create policy "Users can read their own analyses"
on public.analyses for select using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can insert their own analyses" on public.analyses;
create policy "Users can insert their own analyses"
on public.analyses for insert with check (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can delete their own analyses" on public.analyses;
create policy "Users can delete their own analyses"
on public.analyses for delete using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can read their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscriptions"
on public.subscriptions for select using (auth.uid() = user_id);

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
