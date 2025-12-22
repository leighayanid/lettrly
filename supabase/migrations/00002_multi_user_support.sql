-- Add username field to profiles for personal links
alter table public.profiles add column username text unique;

-- Add recipient_id to letters table
alter table public.letters add column recipient_id uuid references public.profiles(id) on delete cascade;

-- Create index for recipient lookups
create index letters_recipient_id_idx on public.letters(recipient_id);
create index profiles_username_idx on public.profiles(username);

-- Update the handle_new_user function to include username
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop old owner-based policies
drop policy if exists "Only owner can read letters" on public.letters;
drop policy if exists "Only owner can update letters" on public.letters;
drop policy if exists "Only owner can delete letters" on public.letters;

-- Create new user-specific policies
-- Users can read their own letters (letters sent to them)
create policy "Users can read their own letters"
  on public.letters for select
  using (recipient_id = auth.uid());

-- Users can update their own letters (mark read, favorite, etc.)
create policy "Users can update their own letters"
  on public.letters for update
  using (recipient_id = auth.uid());

-- Users can delete their own letters
create policy "Users can delete their own letters"
  on public.letters for delete
  using (recipient_id = auth.uid());

-- Function to get user id by username
create or replace function public.get_user_id_by_username(lookup_username text)
returns uuid as $$
  select id from public.profiles where username = lookup_username limit 1;
$$ language sql security definer;
