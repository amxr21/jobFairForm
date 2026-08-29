# Motion

How animation works in this app, and the rules that keep it consistent.

## What's here

| File | Purpose |
|---|---|
| `src/lib/gsap.js` | Central GSAP registration + reduced-motion wiring. **Import gsap from here, never from the package.** |
| `src/lib/motionTokens.js` | Durations, easings, distances, staggers as named constants |
| `src/hooks/useReveal.jsx` | Staggered entrance for a group of elements |
| `src/hooks/useShake.jsx` | One-shot shake for a rejected field |

## Where it's applied

| Surface | Motion | Where |
|---|---|---|
| Step arrival | Fields fade + rise, staggered | `StepContainer` via `useReveal` |
| Field rejected | Short damped shake | `FieldShell` via `useShake` |
| Step change | Slide out / in, mirrored easings | `Form.jsx` + `.step-exit`/`.step-enter` in `style.css` |
| Button press | `active:scale-[0.97]` | Back / Continue / Submit |
| Dropdowns, calendar | `overlay-pop` | `fieldStyles.js` → `PANEL_CLASSES` |
| Toast | Slide + fade, enter and exit | `Toast.jsx` |
| Progress bar | Width/height transition | `.progress-fill` in `style.css` |
| Submit success | Dots → cap → fade | `AnimatedSuccess.jsx` |

## Rules

**Tokens, not magic numbers.** Durations and easings come from `motionTokens.js`. No inline `duration: 0.37`. The tokens mirror the `--ease-in`/`--ease-out` CSS variables so a GSAP tween and a CSS transition on the same element agree.

**`gsap.from`, not `gsap.to`, for reveals.** With `from`, the resting DOM state is the *final* state — if GSAP fails to load or the effect never runs, content is simply visible. A `to` starting at `opacity: 0` leaves that failure permanently blank. **Fail visible, never fail blank.**

**`useGSAP()`, never raw `gsap.to()` in `useEffect`.** The hook handles cleanup and scoping. Raw GSAP in React leaks and fights the virtual DOM.

**Only `transform` and `opacity`.** Animating `width`, `height`, `top` or `margin` triggers layout reflow and janks. If a layout dimension must change, use Flip.

**Cap stagger as a total.** `stagger: { amount: 0.3 }`, not `stagger: 0.05`. Per-item stagger means a 20-field step takes a second before the last field appears; `amount` makes short and long steps finish together.

**Reduced motion means less movement, not no transition.** Keep a short opacity fade (~150ms); a zero-duration pop is harder to follow. `useShake` is the exception — it does nothing at all, because repeated shaking is exactly the vestibular trigger the setting exists for, and the red border plus inline error already carry the message.

## The reduced-motion trap

`gsap.globalTimeline.timeScale(0)` looks like an off switch and is an accessibility **bug**. It freezes tweens where they are, so an element animating from `opacity: 0` freezes *at* 0 — invisible, permanently. The users who most need reduced motion get a page with missing content.

`src/lib/gsap.js` uses a very high timeScale (200) instead: tweens complete within a frame and land on their final values, so everything is present and simply doesn't move.

**Never change that to 0.**

## Adding a reveal to a new step or section

```jsx
import useReveal from "../../hooks/useReveal";

const MySection = () => {
  const scope = useReveal("[data-reveal]", [someKey]);
  return (
    <div ref={scope}>
      <div data-reveal>…</div>
      <div data-reveal>…</div>
    </div>
  );
};
```

Fields rendered through `FieldShell` already carry `data-reveal`, so anything built from `Input`, `SelectInput`, `SkillsMultiSelect` or `DatePicker` participates automatically.

## Testing

jsdom has no `window.matchMedia`, and GSAP reads it at **import** time — so any test importing `src/lib/gsap.js` (directly or through a component) crashes with `_win.matchMedia is not a function` before a per-test `beforeEach` mock could run. Stub it in the test setup file, not in individual tests.
