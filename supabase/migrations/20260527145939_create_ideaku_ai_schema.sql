create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'User',
  email text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text not null default '#7C5CFC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  description text not null default '',
  status text not null default 'in_progress' check (status in ('not_started', 'in_progress', 'completed', 'paused')),
  source_type text not null default 'manual' check (source_type in ('manual', 'voice', 'scan')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.idea_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  idea_id uuid not null references public.ideas(id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Chat umum',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.ai_chats(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists ideas_user_id_idx on public.ideas(user_id);
create index if not exists ideas_category_id_idx on public.ideas(category_id);
create index if not exists idea_tasks_idea_id_idx on public.idea_tasks(idea_id);
create index if not exists idea_tasks_user_id_idx on public.idea_tasks(user_id);
create index if not exists ai_chats_user_id_idx on public.ai_chats(user_id);
create index if not exists ai_messages_chat_id_idx on public.ai_messages(chat_id);
create index if not exists ai_messages_user_id_idx on public.ai_messages(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists ideas_set_updated_at on public.ideas;
create trigger ideas_set_updated_at
before update on public.ideas
for each row execute function public.set_updated_at();

drop trigger if exists idea_tasks_set_updated_at on public.idea_tasks;
create trigger idea_tasks_set_updated_at
before update on public.idea_tasks
for each row execute function public.set_updated_at();

drop trigger if exists ai_chats_set_updated_at on public.ai_chats;
create trigger ai_chats_set_updated_at
before update on public.ai_chats
for each row execute function public.set_updated_at();

create or replace function public.create_default_categories(target_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.categories (user_id, name, color)
  values
    (target_user_id, 'Produk', '#7C5CFC'),
    (target_user_id, 'Bisnis', '#F59E0B'),
    (target_user_id, 'Konten', '#22C55E'),
    (target_user_id, 'Edukasi', '#0EA5E9')
  on conflict (user_id, name) do nothing;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'User'),
    coalesce(new.email, ''),
    '/user-avatar.png'
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  perform public.create_default_categories(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.categories enable row level security;
alter table public.ideas enable row level security;
alter table public.idea_tasks enable row level security;
alter table public.ai_chats enable row level security;
alter table public.ai_messages enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can manage own settings" on public.user_settings;
create policy "Users can manage own settings" on public.user_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own categories" on public.categories;
create policy "Users can manage own categories" on public.categories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own ideas" on public.ideas;
create policy "Users can manage own ideas" on public.ideas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own idea tasks" on public.idea_tasks;
create policy "Users can manage own idea tasks" on public.idea_tasks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own ai chats" on public.ai_chats;
create policy "Users can manage own ai chats" on public.ai_chats
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own ai messages" on public.ai_messages;
create policy "Users can manage own ai messages" on public.ai_messages
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
