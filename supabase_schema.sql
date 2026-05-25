-- 1. Profiles Table (Foydalanuvchilar va ularning rollari)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text,
  full_name text,
  role text check (role in ('admin', 'author', 'reviewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Profiles uchun RLS (Row Level Security)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);


-- 2. Articles Table (Maqolalar)
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  keywords text not null,
  abstract text not null,
  authors jsonb not null, -- Mualliflar ro'yxati array ko'rinishida
  reviewer_notes text,
  has_docx boolean default false,
  has_pdf boolean default false,
  status text check (status in ('pending', 'published', 'rejected')) default 'pending',
  volume integer default 1, -- Birinchi jild (Volume 1)
  issue integer default 1,  -- Birinchi nashr (Issue 1)
  author_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Articles uchun RLS
alter table public.articles enable row level security;
create policy "Articles are viewable by everyone if published" on public.articles for select using (status = 'published');
create policy "Authors can view their own articles" on public.articles for select using (auth.uid() = author_id);
create policy "Admins and Reviewers can view all articles" on public.articles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'reviewer'))
);
create policy "Authors can insert articles" on public.articles for insert with check (auth.uid() = author_id);
create policy "Admins can update articles (publish/reject)" on public.articles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
