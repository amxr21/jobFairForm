// The deployment's mode, declared explicitly rather than inferred.
//
// Deriving this from NODE_ENV, or from whether DATABASE_URL contains
// "localhost", is a guess — and a deploy that guesses wrong points at the
// wrong data. So APP_MODE is its own variable, validated here, and an
// unknown value fails loudly at startup rather than defaulting to
// something plausible.
//
// `demo` is a first-class mode, not a flavour of prod: a demo deployment
// points at demo data and must stay distinguishable from the real form so
// demo submissions are never mistaken for real applicants.

const VALID_MODES = ["local", "demo", "prod"];

const raw = (process.env.APP_MODE || "").trim().toLowerCase();

if (!raw) {
    throw new Error(
        `APP_MODE is not set. It must be one of: ${VALID_MODES.join(", ")}. ` +
        `Copy .env.local.example (local) or .env.remote.example (deployed) to .env.`
    );
}

if (!VALID_MODES.includes(raw)) {
    throw new Error(
        `APP_MODE is "${raw}", which is not a valid mode. ` +
        `It must be one of: ${VALID_MODES.join(", ")}.`
    );
}

const APP_MODE = raw;

module.exports = {
    APP_MODE,
    VALID_MODES,
    isLocal: APP_MODE === "local",
    isDemo: APP_MODE === "demo",
    isProd: APP_MODE === "prod",
};
