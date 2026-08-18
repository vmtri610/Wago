-- 1. Tạo bảng Thư mục (folders)
create table if not exists public.folders (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tạo bảng Từ vựng (words)
create table if not exists public.words (
  id uuid default gen_random_uuid() primary key,
  folder_id uuid references public.folders(id) on delete set null,
  jp text not null,
  romaji text not null,
  vi text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bật Row Level Security (RLS) và cấp quyền truy cập
alter table public.folders enable row level security;
alter table public.words enable row level security;

drop policy if exists "Allow public read/write folders" on public.folders;
create policy "Allow public read/write folders" on public.folders for all using (true) with check (true);

drop policy if exists "Allow public read/write words" on public.words;
create policy "Allow public read/write words" on public.words for all using (true) with check (true);
