-- Run this in Supabase → SQL Editor → New query → Run

create table public.members (
  id uuid primary key,
  id_code text not null,
  full_name text not null,
  student_id text not null unique,
  program text not null,
  year_level text not null,
  section text,
  email text not null,
  phone text,
  photo_url text,
  created_at timestamptz default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  kind text not null check (kind in ('upcoming','past')),
  description text,
  image_url text,
  fb_url text,
  created_at timestamptz default now()
);

alter table public.members enable row level security;
alter table public.events  enable row level security;

-- Anyone can join; only signed-in admins can read member records
create policy "anyone can join"      on public.members for insert to anon, authenticated with check (true);
create policy "admins read members"  on public.members for select to authenticated using (true);

-- Everyone can view events; only signed-in admins can change them
create policy "public read events"   on public.events for select using (true);
create policy "admins write events"  on public.events for all to authenticated using (true) with check (true);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('event-images','event-images',true), ('member-photos','member-photos',true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects for select
  using (bucket_id in ('event-images','member-photos'));
create policy "anyone uploads member photo" on storage.objects for insert
  to anon, authenticated with check (bucket_id = 'member-photos');
create policy "admins manage event images" on storage.objects for all
  to authenticated using (bucket_id = 'event-images') with check (bucket_id = 'event-images');
