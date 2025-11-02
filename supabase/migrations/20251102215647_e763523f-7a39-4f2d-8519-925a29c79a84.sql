-- Create client_profiles table for extended personal information
CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  place_of_birth TEXT,
  nationality TEXT,
  passport_number TEXT,
  passport_issue_date DATE,
  passport_expiry_date DATE,
  passport_issuing_country TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated')),
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_travel_history table
CREATE TABLE public.client_travel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  purpose TEXT CHECK (purpose IN ('tourism', 'business', 'study', 'work', 'other')),
  entry_date DATE NOT NULL,
  exit_date DATE NOT NULL,
  visa_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_education table
CREATE TABLE public.client_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree_level TEXT CHECK (degree_level IN ('high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other')),
  field_of_study TEXT,
  country TEXT NOT NULL,
  city TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  gpa_or_grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_employment table
CREATE TABLE public.client_employment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employer_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  industry TEXT,
  country TEXT NOT NULL,
  city TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_family_members table
CREATE TABLE public.client_family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship TEXT CHECK (relationship IN ('spouse', 'child', 'parent', 'sibling', 'other')),
  date_of_birth DATE NOT NULL,
  nationality TEXT,
  passport_number TEXT,
  is_accompanying BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_languages table
CREATE TABLE public.client_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('basic', 'intermediate', 'advanced', 'native')),
  test_name TEXT,
  test_score TEXT,
  test_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_travel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_languages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_profiles
CREATE POLICY "Users can view their own client profile"
ON public.client_profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can insert their own client profile"
ON public.client_profiles FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own client profile"
ON public.client_profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Staff can view all client profiles"
ON public.client_profiles FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update all client profiles"
ON public.client_profiles FOR UPDATE
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for client_travel_history
CREATE POLICY "Users can view their own travel history"
ON public.client_travel_history FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own travel history"
ON public.client_travel_history FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own travel history"
ON public.client_travel_history FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own travel history"
ON public.client_travel_history FOR DELETE
USING (client_id = auth.uid());

CREATE POLICY "Staff can view all travel history"
ON public.client_travel_history FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage all travel history"
ON public.client_travel_history FOR ALL
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for client_education
CREATE POLICY "Users can view their own education"
ON public.client_education FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own education"
ON public.client_education FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own education"
ON public.client_education FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own education"
ON public.client_education FOR DELETE
USING (client_id = auth.uid());

CREATE POLICY "Staff can view all education"
ON public.client_education FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage all education"
ON public.client_education FOR ALL
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for client_employment
CREATE POLICY "Users can view their own employment"
ON public.client_employment FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own employment"
ON public.client_employment FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own employment"
ON public.client_employment FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own employment"
ON public.client_employment FOR DELETE
USING (client_id = auth.uid());

CREATE POLICY "Staff can view all employment"
ON public.client_employment FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage all employment"
ON public.client_employment FOR ALL
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for client_family_members
CREATE POLICY "Users can view their own family members"
ON public.client_family_members FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own family members"
ON public.client_family_members FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own family members"
ON public.client_family_members FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own family members"
ON public.client_family_members FOR DELETE
USING (client_id = auth.uid());

CREATE POLICY "Staff can view all family members"
ON public.client_family_members FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage all family members"
ON public.client_family_members FOR ALL
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for client_languages
CREATE POLICY "Users can view their own languages"
ON public.client_languages FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own languages"
ON public.client_languages FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own languages"
ON public.client_languages FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own languages"
ON public.client_languages FOR DELETE
USING (client_id = auth.uid());

CREATE POLICY "Staff can view all languages"
ON public.client_languages FOR SELECT
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage all languages"
ON public.client_languages FOR ALL
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on client_profiles
CREATE TRIGGER update_client_profiles_updated_at
BEFORE UPDATE ON public.client_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();