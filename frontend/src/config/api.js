// Single source of truth for the backend base URL.
//
// This was previously duplicated as a literal in seven files, which is how the
// fallback silently rotted: the deployed host changed, .env pointed at a third
// host (Railway), and every component kept its own stale copy of a dead URL
// (jobfair-1.onrender.com, which returns `x-render-routing: no-server`).
//
// Set VITE_API_URL in the deployment's environment variables — Vite inlines it
// at BUILD time, so changing it requires a redeploy, not just a restart.
export const API_URL = import.meta.env.VITE_API_URL || "https://jobfairform-backend.onrender.com";

export default API_URL;
