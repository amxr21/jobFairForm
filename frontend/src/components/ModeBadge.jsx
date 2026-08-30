import { APP_MODE, isProd } from "../config/appMode";

// A visible marker on any non-production build.
//
// A demo deployment that looks identical to production is how demo
// submissions end up being treated as real applicants — and how someone
// tests against prod believing they are on local. The badge makes the
// current target impossible to mistake at a glance.
//
// Renders nothing in prod, so the real form is never decorated.

const LABELS = {
    local: { text: "LOCAL", classes: "bg-sky-600" },
    demo: { text: "DEMO", classes: "bg-amber-500" },
};

const ModeBadge = () => {
    if (isProd) return null;

    const label = LABELS[APP_MODE];
    if (!label) return null;

    return (
        <div
            // aria-hidden: this is a developer/staging affordance, not part of
            // the applicant's task. Screen reader users filling the form do not
            // need it announced ahead of the actual content.
            aria-hidden="true"
            className={`fixed bottom-2 start-2 z-[2000] pointer-events-none select-none
                rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide
                text-white shadow-md opacity-80 ${label.classes}`}
        >
            {label.text}
        </div>
    );
};

export default ModeBadge;
