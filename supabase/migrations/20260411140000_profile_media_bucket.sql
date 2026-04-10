insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-media',
  'profile-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Profile media is publicly accessible"
  on storage.objects for select
  using (bucket_id = 'profile-media');

create policy "Users can upload their own profile media"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-media' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own profile media"
  on storage.objects for update
  using (
    bucket_id = 'profile-media' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own profile media"
  on storage.objects for delete
  using (
    bucket_id = 'profile-media' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
