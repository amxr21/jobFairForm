import PropTypes from "prop-types";

// The wrapper all three steps had copy-pasted. Beyond removing the
// duplication, having one definition is what makes the overflow behaviour
// reviewable in a single place:
//
//   - `min-h-0` is what actually lets the inner region scroll; without it the
//     flex child refuses to shrink below its content and the whole form grows.
//   - `p-1 -m-1` reserves a 4px bleed so focus rings and the `ring-2` on an
//     open dropdown trigger aren't shaved off at the container edge, then
//     pulls the layout back so nothing visually shifts.
//   - `overflow-x-clip` (not `hidden`) keeps horizontal clipping without
//     making this a scroll container on the x-axis. Using `overflow-y-auto`
//     alone would compute the x-axis to `auto` as well, so a slightly-wide
//     row would produce a stray horizontal scrollbar; `clip` avoids that
//     while still not clipping the reserved ring bleed the way the old
//     `overflow-hidden` on the outer element did.
//   - `-webkit-overflow-scrolling: touch` gives the region the momentum
//     scrolling every native list on a phone has.

// `flex-1 min-h-0`, NOT `h-full`: this sits in Form.jsx's .step-pane flex
// column alongside the Back/Continue row. h-full means 100% of the pane, so
// the step claimed the entire height on its own and pushed the nav row past
// the bottom edge, where the parent's overflow-hidden clipped it — the
// Continue button was simply not on screen on mobile. flex-1 makes it take
// the space that is *left over* after the nav row, and min-h-0 lets it
// shrink below its content so the scroll region below actually engages.
const StepContainer = ({ id, children }) => (
    <div id={id} className="flex-1 min-h-0 flex flex-col w-full">
        <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-clip p-1 -m-1"
            style={{ WebkitOverflowScrolling: "touch" }}
        >
            {children}
        </div>
    </div>
);

StepContainer.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default StepContainer;
