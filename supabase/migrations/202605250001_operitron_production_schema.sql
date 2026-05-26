begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  subscription_status text not null default 'inactive',
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  company text,
  phone text,
  subscription_id text,
  subscription_plan text not null default 'No subscription',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  status text not null,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  plan text,
  trial_ends_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id bigint primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  address text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id bigint references public.projects(id) on delete set null,
  analysis jsonb not null,
  created_at timestamptz not null default now(),
  inputs jsonb not null default '{}'::jsonb
);

create index if not exists projects_user_id_created_at_idx on public.projects (user_id, created_at desc);
create index if not exists analyses_user_id_created_at_idx on public.analyses (user_id, created_at desc);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.analyses enable row level security;

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
      and (subscription_status in ('active', 'trialing') or role = 'admin')
  );
$$;

revoke all on function public.has_product_access(uuid) from public;
grant execute on function public.has_product_access(uuid) to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscriptions"
on public.subscriptions for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Subscribers can read their own projects" on public.projects;
drop policy if exists "Users can read their own projects" on public.projects;
create policy "Subscribers can read their own projects"
on public.projects for select to authenticated
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Subscribers can insert their own projects" on public.projects;
drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Subscribers can insert their own projects"
on public.projects for insert to authenticated
with check (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Subscribers can update their own projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
create policy "Subscribers can update their own projects"
on public.projects for update to authenticated
using (auth.uid() = user_id and public.has_product_access(auth.uid()))
with check (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Subscribers can delete their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Subscribers can delete their own projects"
on public.projects for delete to authenticated
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Subscribers can read their own analyses" on public.analyses;
drop policy if exists "Users can read their own analyses" on public.analyses;
create policy "Subscribers can read their own analyses"
on public.analyses for select to authenticated
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Subscribers can delete their own analyses" on public.analyses;
drop policy if exists "Users can delete their own analyses" on public.analyses;
create policy "Subscribers can delete their own analyses"
on public.analyses for delete to authenticated
using (auth.uid() = user_id and public.has_product_access(auth.uid()));

drop policy if exists "Users can insert their own analyses" on public.analyses;

revoke all on public.profiles, public.subscriptions, public.projects, public.analyses from anon;
revoke insert, delete on public.profiles from authenticated;
revoke insert, update, delete on public.subscriptions from authenticated;
revoke insert, update on public.analyses from authenticated;
revoke update on public.profiles from authenticated;
grant select on public.profiles, public.subscriptions, public.projects, public.analyses to authenticated;
grant update (full_name, company, phone, updated_at) on public.profiles to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant delete on public.analyses to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company, phone)
  values (
    new.id,
    coalesce(new.email, ''),
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

commit;
