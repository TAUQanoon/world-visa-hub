/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly PLASMIC_PROJECT_ID: string
  readonly PLASMIC_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
