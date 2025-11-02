-- Create the case-documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-documents', 'case-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Clients can upload documents to their own cases
CREATE POLICY "Clients can upload to their case folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'case-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.cases WHERE client_id = auth.uid()
  )
);

-- Policy 2: Clients can view/download their own case documents
CREATE POLICY "Clients can view their case documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'case-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.cases WHERE client_id = auth.uid()
  )
);

-- Policy 3: Staff can upload to any case
CREATE POLICY "Staff can upload to any case"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'case-documents'
  AND (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('staff', 'admin'))
  )
);

-- Policy 4: Staff can view all documents
CREATE POLICY "Staff can view all case documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'case-documents'
  AND (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('staff', 'admin'))
  )
);

-- Policy 5: Users can delete their pending documents
CREATE POLICY "Users can delete their pending documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'case-documents'
  AND (
    owner = auth.uid()
    OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('staff', 'admin'))
  )
);