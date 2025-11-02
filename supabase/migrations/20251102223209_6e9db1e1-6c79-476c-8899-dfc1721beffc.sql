-- Create tables for Builder.io integration

-- Table to store published content from Builder.io
CREATE TABLE public.builder_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL UNIQUE,
  model text NOT NULL,
  url_path text NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table to store form submissions from Builder.io forms
CREATE TABLE public.builder_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name text NOT NULL,
  submission_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone DEFAULT now(),
  user_email text,
  processed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Table to store analytics events
CREATE TABLE public.builder_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Table to log webhook events
CREATE TABLE public.builder_webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.builder_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for builder_content
CREATE POLICY "Public can view published content"
ON public.builder_content
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage content"
ON public.builder_content
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for builder_forms
CREATE POLICY "Anyone can submit forms"
ON public.builder_forms
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all form submissions"
ON public.builder_forms
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins can update form submissions"
ON public.builder_forms
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- RLS Policies for builder_analytics
CREATE POLICY "Anyone can insert analytics"
ON public.builder_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
ON public.builder_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- RLS Policies for builder_webhook_logs
CREATE POLICY "Admins can view webhook logs"
ON public.builder_webhook_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage webhook logs"
ON public.builder_webhook_logs
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger for builder_content
CREATE TRIGGER update_builder_content_updated_at
BEFORE UPDATE ON public.builder_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_builder_content_url_path ON public.builder_content(url_path);
CREATE INDEX idx_builder_content_published ON public.builder_content(published);
CREATE INDEX idx_builder_forms_created_at ON public.builder_forms(created_at);
CREATE INDEX idx_builder_analytics_created_at ON public.builder_analytics(created_at);
CREATE INDEX idx_builder_webhook_logs_created_at ON public.builder_webhook_logs(created_at);