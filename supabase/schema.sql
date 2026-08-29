-- =============================================================
-- KIẾN TRÚC DATABASE QUAN HỆ (RELATIONAL SCHEMA) CHO WAGO N5
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

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can view all profiles" on public.profiles;
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

-- -------------------------------------------------------------
-- 2. BẢNG FOLDERS (THƯ MỤC CÁ NHÂN & CHIA SẺ)
-- -------------------------------------------------------------
create table if not exists public.folders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  shared_with uuid[] default '{}',
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.folders enable row level security;

drop policy if exists "Users can access owned or shared folders" on public.folders;
create policy "Users can access owned or shared folders" 
  on public.folders for all 
  using (auth.uid() = user_id or auth.uid() = any(shared_with)) 
  with check (auth.uid() = user_id or auth.uid() = any(shared_with));

-- -------------------------------------------------------------
-- 3. BẢNG LESSONS (DANH MỤC BÀI HỌC)
-- -------------------------------------------------------------
create table if not exists public.lessons (
  id integer primary key,
  title text not null,
  short_title text not null,
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

drop policy if exists "Allow all users to read lessons" on public.lessons;
create policy "Allow all users to read lessons" on public.lessons for select using (true);

drop policy if exists "Allow authenticated to manage lessons" on public.lessons;
create policy "Allow authenticated to manage lessons" on public.lessons for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- -------------------------------------------------------------
-- 4. BẢNG WORDS (TỪ VỰNG - LIÊN KẾT TRỰC TIẾP VỚI LESSONS)
-- -------------------------------------------------------------
create table if not exists public.words (
  id uuid default gen_random_uuid() primary key,
  lesson_id integer references public.lessons(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  shared_with uuid[] default '{}',
  jp text not null,
  romaji text not null,
  vi text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.words add column if not exists lesson_id integer references public.lessons(id) on delete cascade;
alter table public.words add column if not exists order_index integer default 0;

alter table public.words enable row level security;

drop policy if exists "Users can access owned or shared words" on public.words;
create policy "Users can access owned or shared words" 
  on public.words for all 
  using (lesson_id is not null or auth.uid() = user_id or auth.uid() = any(shared_with)) 
  with check (lesson_id is not null or auth.uid() = user_id or auth.uid() = any(shared_with));

-- -------------------------------------------------------------
-- 5. BẢNG LESSON_GRAMMAR (MẪU NGỮ PHÁP RIÊNG BIỆT)
-- -------------------------------------------------------------
create table if not exists public.lesson_grammar (
  id uuid default gen_random_uuid() primary key,
  lesson_id integer references public.lessons(id) on delete cascade not null,
  order_label text not null, -- '2', '3', '4', '4.1', '4.2', '5'
  title text not null,       -- 'N1 の N2', 'N1 は N2 じゃ ありません'
  meaning text not null,     -- 'N2 của/thuộc N1'
  usage text,                -- 'Dùng khi nói về nơi làm việc...'
  formula text,              -- 'N1 の N2'
  notes text[] default '{}', -- Mảng các lưu ý
  responses jsonb default '{}'::jsonb, -- {"affirmative": [...], "negative": [...]}
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lesson_grammar enable row level security;

drop policy if exists "Allow all to read grammar" on public.lesson_grammar;
create policy "Allow all to read grammar" on public.lesson_grammar for select using (true);

drop policy if exists "Allow auth to manage grammar" on public.lesson_grammar;
create policy "Allow auth to manage grammar" on public.lesson_grammar for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- -------------------------------------------------------------
-- 6. BẢNG LESSON_GRAMMAR_EXAMPLES (VÍ DỤ MINH HOẠ CHO NGỮ PHÁP)
-- -------------------------------------------------------------
create table if not exists public.lesson_grammar_examples (
  id uuid default gen_random_uuid() primary key,
  grammar_id uuid references public.lesson_grammar(id) on delete cascade not null,
  speaker text, -- 'A', 'B' hoặc null
  jp text not null,
  romaji text,
  vi text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lesson_grammar_examples enable row level security;

drop policy if exists "Allow all to read grammar examples" on public.lesson_grammar_examples;
create policy "Allow all to read grammar examples" on public.lesson_grammar_examples for select using (true);

drop policy if exists "Allow auth to manage grammar examples" on public.lesson_grammar_examples;
create policy "Allow auth to manage grammar examples" on public.lesson_grammar_examples for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- -------------------------------------------------------------
-- 7. BẢNG LESSON_EXPANSIONS (MỤC MỞ RỘNG GIAO TIẾP)
-- -------------------------------------------------------------
create table if not exists public.lesson_expansions (
  id uuid default gen_random_uuid() primary key,
  lesson_id integer references public.lessons(id) on delete cascade not null,
  order_label text not null, -- 'Mở rộng 2', 'Mở rộng 3'
  title text not null,       -- 'Cách hỏi công việc', 'Cách giới thiệu bản thân'
  formula text,
  meaning text,
  notes text[] default '{}',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lesson_expansions enable row level security;

drop policy if exists "Allow all to read expansions" on public.lesson_expansions;
create policy "Allow all to read expansions" on public.lesson_expansions for select using (true);

drop policy if exists "Allow auth to manage expansions" on public.lesson_expansions;
create policy "Allow auth to manage expansions" on public.lesson_expansions for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- -------------------------------------------------------------
-- 8. BẢNG LESSON_EXPANSION_DIALOGUES (HỘI THOẠI MẪU MỞ RỘNG)
-- -------------------------------------------------------------
create table if not exists public.lesson_expansion_dialogues (
  id uuid default gen_random_uuid() primary key,
  expansion_id uuid references public.lesson_expansions(id) on delete cascade not null,
  speaker text, -- 'A', 'B' hoặc null
  jp text not null,
  romaji text,
  vi text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lesson_expansion_dialogues enable row level security;

drop policy if exists "Allow all to read expansion dialogues" on public.lesson_expansion_dialogues;
create policy "Allow all to read expansion dialogues" on public.lesson_expansion_dialogues for select using (true);

drop policy if exists "Allow auth to manage expansion dialogues" on public.lesson_expansion_dialogues;
create policy "Allow auth to manage expansion dialogues" on public.lesson_expansion_dialogues for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- -------------------------------------------------------------
-- 9. BẢNG USER_LESSON_PROGRESS (TIẾN TRÌNH BÀI HỌC THEO TỪNG USER)
-- -------------------------------------------------------------
create table if not exists public.user_lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  lesson_id integer references public.lessons(id) on delete cascade not null,
  status text default 'not_started' not null, -- 'not_started' | 'in_progress' | 'completed'
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;

drop policy if exists "Users can manage their own lesson progress" on public.user_lesson_progress;
create policy "Users can manage their own lesson progress" 
  on public.user_lesson_progress for all 
  using (auth.uid() = user_id) 
  with check (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 10. BẢNG USER_WORD_PROGRESS (TIẾN TRÌNH TỪ VỰNG SRS THEO TỪNG USER)
-- -------------------------------------------------------------
create table if not exists public.user_word_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  word_id uuid references public.words(id) on delete cascade not null,
  srs_level integer default 0 not null,
  next_review_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, word_id)
);

alter table public.user_word_progress enable row level security;

drop policy if exists "Users can access their own srs progress" on public.user_word_progress;
create policy "Users can access their own srs progress" 
  on public.user_word_progress for all 
  using (auth.uid() = user_id) 
  with check (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 11. BẢNG WORD_REPORTS (BÁO CÁO LỖI NHẬP LIỆU)
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
