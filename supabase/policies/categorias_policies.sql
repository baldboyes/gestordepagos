-- Enable Row Level Security
alter table categorias enable row level security;

-- Create policy for inserting categories (authenticated users only)
create policy "Users can insert their own categories"
  on categorias
  for insert
  with check (auth.uid() = user_id);

-- Create policy for selecting categories (authenticated users can see their own)
create policy "Users can view their own categories"
  on categorias
  for select
  using (auth.uid() = user_id);

-- Create policy for updating categories (authenticated users can update their own)
create policy "Users can update their own categories"
  on categorias
  for update
  using (auth.uid() = user_id);

-- Create policy for deleting categories (authenticated users can delete their own)
create policy "Users can delete their own categories"
  on categorias
  for delete
  using (auth.uid() = user_id);