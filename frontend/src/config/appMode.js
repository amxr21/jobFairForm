// The build's mode, declared explicitly rather than inferred.
//
// Deriving this from import.meta.env.PROD, or from whether VITE_API_URL
// contains "localhost", is a guess — and a build that guesses wrong shows
// the wrong thing to real applicants. So VITE_APP_MODE is its own
// variable, validated here.
//
// Vite inlines VITE_* at BUILD time, so changing this on the host requires
// a redeploy, not a restart.
//
// Unlike the backend this does not throw: a thrown module-level error in
// the browser is a blank page, which is a worse failure than a form that
// works. An invalid value logs loudly and falls back to the safest
// assumption — treat it as non-prod, so the badge shows rather than
// silently passing a demo build off as the real one.

const VALID_MODES = ["local", "demo", "prod"];

const raw = (import.meta.env.VITE_APP_MODE || "").trim().toLowerCase();

if (!raw) {
    console.error(
        `VITE_APP_MODE is not set. It must be one of: ${VALID_MODES.join(", ")}. ` +
        `Copy .env.local.example (local) or .env.remote.example (deployed) to .env.`
    );
} else if (!VALID_MODES.includes(raw)) {
    console.error(
        `VITE_APP_MODE is "${raw}", which is not a valid mode. ` +
        `It must be one of: ${VALID_MODES.join(", ")}.`
    );
}

export const APP_MODE = VALID_MODES.includes(raw) ? raw : "local";

export const isLocal = APP_MODE === "local";
export const isDemo = APP_MODE === "demo";
export const isProd = APP_MODE === "prod";

export default APP_MODE;
