-- Migration to remove Builder.io related tables
-- These tables are no longer needed after removing Builder.io integration

-- Drop tables in order to respect foreign key constraints
-- Drop webhook logs first (may reference webhooks)
DROP TABLE IF EXISTS public.builder_webhook_logs CASCADE;

-- Drop webhooks table (has foreign key to cases)
DROP TABLE IF EXISTS public.builder_io_webhooks CASCADE;

-- Drop remaining Builder.io tables
DROP TABLE IF EXISTS public.builder_forms CASCADE;
DROP TABLE IF EXISTS public.builder_analytics CASCADE;
DROP TABLE IF EXISTS public.builder_content CASCADE;
