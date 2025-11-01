-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'staff', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = has_role.user_id
    AND user_roles.role = role_name
  );
END;
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  
  -- Assign client role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create visa_types table
CREATE TABLE public.visa_types (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'work', 'other')),
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  workflow_stages JSONB DEFAULT '[]'::jsonb,
  processing_time_estimate TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.visa_types ENABLE ROW LEVEL SECURITY;

-- Everyone can view active visa types
CREATE POLICY "Anyone can view active visa types"
  ON public.visa_types FOR SELECT
  TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Only admins can modify visa types
CREATE POLICY "Admins can insert visa types"
  ON public.visa_types FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update visa types"
  ON public.visa_types FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete visa types"
  ON public.visa_types FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_visa_types_updated_at
  BEFORE UPDATE ON public.visa_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create cases table
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visa_type_id UUID NOT NULL REFERENCES public.visa_types(id),
  current_stage TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'on_hold')),
  assigned_staff_id UUID REFERENCES public.profiles(id),
  deadline DATE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Clients can view their own cases
CREATE POLICY "Clients can view their own cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

-- Staff and admins can view all cases
CREATE POLICY "Staff can view all cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Staff can update cases
CREATE POLICY "Staff can update cases"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Admins can insert and delete cases
CREATE POLICY "Admins can insert cases"
  ON public.cases FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins can delete cases"
  ON public.cases FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate case numbers
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  new_number := year_prefix || LPAD((COUNT(*) + 1)::TEXT, 5, '0')
    FROM public.cases
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  RETURN new_number;
END;
$$;

-- Create case_timeline table
CREATE TABLE public.case_timeline (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  stage TEXT,
  status TEXT,
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.case_timeline ENABLE ROW LEVEL SECURITY;

-- Clients can view timeline for their own cases
CREATE POLICY "Clients can view their case timeline"
  ON public.case_timeline FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_timeline.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Staff can view all timelines
CREATE POLICY "Staff can view all timelines"
  ON public.case_timeline FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Staff can insert timeline entries
CREATE POLICY "Staff can insert timeline entries"
  ON public.case_timeline FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  document_category TEXT,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'resubmit_required')),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Clients can view documents for their cases
CREATE POLICY "Clients can view their case documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = documents.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Clients can upload documents to their cases
CREATE POLICY "Clients can upload documents to their cases"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = documents.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Staff can view all documents
CREATE POLICY "Staff can view all documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Staff can update document status
CREATE POLICY "Staff can update documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id UUID REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Clients can view non-internal messages for their cases
CREATE POLICY "Clients can view their case messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    is_internal = false AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = messages.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Clients can send messages for their cases
CREATE POLICY "Clients can send messages for their cases"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    is_internal = false AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = messages.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Staff can view all messages
CREATE POLICY "Staff can view all messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Staff can send messages
CREATE POLICY "Staff can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  description TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Clients can view payments for their cases
CREATE POLICY "Clients can view their case payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = payments.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Staff can view all payments
CREATE POLICY "Staff can view all payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Staff can manage payments
CREATE POLICY "Staff can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create consultation_requests table
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country_of_interest TEXT,
  visa_type_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Staff can view all consultation requests
CREATE POLICY "Staff can view consultation requests"
  ON public.consultation_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update consultation requests"
  ON public.consultation_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create form_templates table
CREATE TABLE public.form_templates (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  visa_type_id UUID REFERENCES public.visa_types(id),
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

-- Staff can view form templates
CREATE POLICY "Staff can view form templates"
  ON public.form_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can manage form templates
CREATE POLICY "Admins can manage form templates"
  ON public.form_templates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create form_submissions table
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  form_template_id UUID NOT NULL REFERENCES public.form_templates(id),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Clients can view their own form submissions
CREATE POLICY "Clients can view their form submissions"
  ON public.form_submissions FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

-- Clients can submit forms for their cases
CREATE POLICY "Clients can submit forms"
  ON public.form_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = form_submissions.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Staff can view all form submissions
CREATE POLICY "Staff can view all form submissions"
  ON public.form_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Create builder_io_webhooks table
CREATE TABLE public.builder_io_webhooks (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id TEXT NOT NULL,
  submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed BOOLEAN DEFAULT false,
  created_case_id UUID REFERENCES public.cases(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.builder_io_webhooks ENABLE ROW LEVEL SECURITY;

-- Only admins can view webhook logs
CREATE POLICY "Admins can view webhook logs"
  ON public.builder_io_webhooks FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets (these will need to be created via Supabase dashboard or API)
-- case-documents bucket for client uploads
-- profile-images bucket for avatars