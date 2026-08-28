// Single source of truth for the backend base URL.
//
// This was previously duplicated as a literal in seven files, which is how the
// fallback silently rotted: the deployed host changed, .env pointed at a third
// host (Railway), and every component kept its own stale copy of a dead URL
// (jobfair-1.onrender.com, which returns `x-render-routing: no-server`).
//
// Set VITE_API_URL in the deployment's environment variables — Vite inlines it
// at BUILD time, so changing it requires a redeploy, not just a restart.
//
// There is deliberately NO production fallback host. Defaulting to one meant a
// production build with a missing VITE_API_URL came out looking healthy while
// silently talking to a decommissioned server. A misconfigured deploy must
// fail loudly instead.
const CUSTOM_URL = import.meta.env.VITE_API_URL;

function resolveApiUrl() {
    if (CUSTOM_URL) return CUSTOM_URL;

    if (import.meta.env.PROD) {
        throw new Error(
            'VITE_API_URL is not set. Production builds must define it at build time — ' +
            'there is no default backend host.'
        );
    }

    return 'http://localhost:2001';
}

export const API_URL = resolveApiUrl();

export default API_URL;
