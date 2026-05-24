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

create policy "Users can read their own projects"
on public.projects for select
using (auth.uid() = user_id);

create policy "Users can insert their own projects"
on public.projects for insert
with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
on public.projects for delete
using (auth.uid() = user_id);
