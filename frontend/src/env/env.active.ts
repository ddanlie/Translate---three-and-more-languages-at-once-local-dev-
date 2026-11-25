// Empty base URL keeps requests same-origin so the Vite dev proxy (see vite.config.ts) forwards /api to Django.
// Direct backend URL: "http://127.0.0.1:8000/api"
export const AXIOS_BASE_API_URL = "";