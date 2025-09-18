/// <reference types="vite/client" />
// Extend Vite's ImportMetaEnv to include our env variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
