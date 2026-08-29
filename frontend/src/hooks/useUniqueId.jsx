import { useRef } from "react";

// A stable per-instance id, for wiring aria-controls / aria-activedescendant /
// <label htmlFor> to elements that need to be addressable by id.
//
// React's own useId would be the right tool, but it landed in React 18 and
// this project is on 17.0.2 — calling it throws "useId is not a function" at
// render time. package.json's "^16.8.0 || ^17.0.0 || ^18.0.0" range means the
// installed version can be any of the three, so this stays version-agnostic
// rather than assuming 18.
//
// A ref-backed counter is sufficient here: these ids only need to be unique
// within the document, not stable across a server render and a client
// hydration (this is a client-rendered Vite SPA, so there is no hydration
// mismatch to worry about — which is the specific problem useId exists to
// solve).

let counter = 0;

export default function useUniqueId(prefix = "field") {
    const idRef = useRef(null);
    if (idRef.current === null) {
        counter += 1;
        idRef.current = `${prefix}-${counter}`;
    }
    return idRef.current;
}
