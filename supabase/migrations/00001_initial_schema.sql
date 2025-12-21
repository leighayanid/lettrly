-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  is_owner boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Letters table
create table public.letters (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_display_name text, -- For anonymous users who want to leave a name
  is_anonymous boolean default true,
  is_read boolean default false,
  is_favorited boolean default false,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Indexes
create index letters_created_at_idx on public.letters(created_at desc);
create index letters_is_read_idx on public.letters(is_read);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.letters enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Letters policies
-- Anyone can insert a letter (public submission)
create policy "Anyone can send a letter"
  on public.letters for insert
  with check (true);

-- Only owner can read letters
create policy "Only owner can read letters"
  on public.letters for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Only owner can update letters (mark read, favorite, etc.)
create policy "Only owner can update letters"
  on public.letters for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Only owner can delete letters
create policy "Only owner can delete letters"
  on public.letters for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
