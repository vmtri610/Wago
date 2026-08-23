-- =============================================================
-- SCRIPT CẤU HÌNH SUPABASE DATABASE CHO WAGO (CHO PHÉP SELECT PROFILES ĐỂ CHIA SẺ)
-- =============================================================

-- -------------------------------------------------------------
-- 1. BẢNG PROFILES (HỒ SƠ NGƯỜI DÙNG)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------
-- 2. BẢNG FOLDERS (THƯ MỤC)
-- -------------------------------------------------------------
create table if not exists public.folders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  shared_with uuid[] default '{}',
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.folders 
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  add column if not exists shared_with uuid[] default '{}';

-- -------------------------------------------------------------
-- 3. BẢNG WORDS (TỪ VỰNG)
-- -------------------------------------------------------------
create table if not exists public.words (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  shared_with uuid[] default '{}',
  folder_id uuid references public.folders(id) on delete set null,
  jp text not null,
  romaji text not null,
  vi text not null,
  srs_level integer default 0,
  next_review_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.words 
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  add column if not exists shared_with uuid[] default '{}';

-- -------------------------------------------------------------
-- 4. BẬT ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.folders enable row level security;
alter table public.words enable row level security;

-- -------------------------------------------------------------
-- 5. XÓA TẤT CẢ CÁC POLICY CŨ
-- -------------------------------------------------------------
drop policy if exists "Allow public read/write folders" on public.folders;
drop policy if exists "Allow public read/write words" on public.words;
drop policy if exists "Users can manage their own folders" on public.folders;
drop policy if exists "Users can manage their own words" on public.words;
drop policy if exists "Users can manage shared folders" on public.folders;
drop policy if exists "Users can manage shared words" on public.words;
drop policy if exists "Users can access owned or shared folders" on public.folders;
drop policy if exists "Users can access owned or shared words" on public.words;
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Authenticated users can view all profiles" on public.profiles;

-- -------------------------------------------------------------
-- 6. XÓA CÁC CỘT DƯ THỪA
-- -------------------------------------------------------------
alter table public.profiles drop column if exists target_jlpt cascade;
alter table public.profiles drop column if exists daily_goal cascade;

alter table public.folders drop column if exists user_ids cascade;
alter table public.words drop column if exists user_ids cascade;

-- -------------------------------------------------------------
-- 7. THIẾT LẬP RLS POLICIES MỚI
-- -------------------------------------------------------------
-- Profiles: Người dùng đã đăng nhập đều có thể XEM (SELECT) profiles của nhau để chọn chia sẻ
create policy "Authenticated users can view all profiles" 
  on public.profiles for select 
  to authenticated 
  using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Folders & Words (Cho phép Người tạo hoặc Người được chia sẻ)
create policy "Users can access owned or shared folders" 
  on public.folders for all 
  using (auth.uid() = user_id or auth.uid() = any(shared_with)) 
  with check (auth.uid() = user_id or auth.uid() = any(shared_with));

create policy "Users can access owned or shared words" 
  on public.words for all 
  using (auth.uid() = user_id or auth.uid() = any(shared_with)) 
  with check (auth.uid() = user_id or auth.uid() = any(shared_with));

-- -------------------------------------------------------------
-- 8. TRIGGER TỰ ĐỘNG KHỞI TẠO PROFILE KHI ĐĂNG NHẬP OAUTH LẦN ĐẦU
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------
-- 9. BẢNG WORD_REPORTS (BÁO CÁO LỖI NHẬP LIỆU TỪ VỰNG)
-- -------------------------------------------------------------
create table if not exists public.word_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  word_id uuid references public.words(id) on delete cascade,
  word_jp text not null,
  word_romaji text not null,
  word_vi text not null,
  reason text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.word_reports enable row level security;

drop policy if exists "Users can access owned reports" on public.word_reports;
create policy "Users can access owned reports" 
  on public.word_reports for all 
  using (auth.uid() = user_id) 
  with check (auth.uid() = user_id);

