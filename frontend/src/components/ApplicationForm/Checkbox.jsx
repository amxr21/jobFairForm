import PropTypes from "prop-types";
import { Check } from "lucide-react";
import { FIELD_TEXT } from "./fieldStyles";

// The form's one checkbox.
//
// Every checkbox here used to be a bare <input type="checkbox"> styled with
// `accent-[#0E7F41]`. accent-color is the only hook a native checkbox gives
// you, and it only tints the fill — the box's size, corner radius, border,
// checkmark shape and focus ring stay whatever the OS draws, so the control
// looked materially different across Windows / macOS / Android and matched
// nothing else in the form. It was also the last native interactive widget
// left in here, which the project's UI rules rule out for exactly this
// reason.
//
// The real <input> is kept — not replaced with a div + onClick — so the
// browser keeps handling the label association, space-to-toggle, tab order,
// form participation and screen-reader announcement. It is only hidden
// VISUALLY (`sr-only`, not `hidden`/`display:none`, which would drop it from
// the accessibility tree and make it unfocusable). The visible box is a
// sibling <span> driven entirely by `peer-*` variants off the input's real
// state, so what is painted can never disagree with what the input actually
// is.
const Checkbox = ({
    id,
    checked,
    onChange,
    label,
    // Languages renders ~7 of these in a wrap row and needs a 44px touch
    // target per WCAG 2.5.5; the two standalone booleans sit inline next to
    // a field label where that much padding would push the row out of
    // alignment. Defaults to the comfortable target.
    touchTarget = true,
    labelClassName = "",
    className = "",
    ...inputProps
}) => (
    <div className={`flex items-center ${touchTarget ? "min-h-[44px] md:min-h-0" : ""} ${className}`}>
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...inputProps}
        />
        {/* The box is a direct SIBLING of the input so the peer-* variants
            below actually resolve — Tailwind's peer selector compiles to
            `.peer:checked ~ &`, which only reaches siblings. Putting it
            inside the <label> (the obvious layout) would silently break
            every one of these states. */}
        <span
            // aria-hidden: purely the visual stand-in. The hidden input is
            // what actually gets announced, so exposing this too would read
            // the control out twice.
            aria-hidden="true"
            // 20px on mobile / 18px from md up, matching the w-5 md:w-4 the
            // native inputs used — a bigger visual target under a thumb,
            // tighter alongside desktop's smaller field text.
            className="relative flex items-center justify-center w-5 h-5 md:w-[18px] md:h-[18px] shrink-0 rounded-md md:rounded-[5px]
                border border-line-strong bg-white dark:bg-[#1a2438]
                transition-colors duration-150 pointer-events-none
                peer-checked:bg-primary peer-checked:border-primary
                peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1
                peer-focus-visible:ring-offset-surface-page
                peer-disabled:opacity-50"
        >
            {/* Revealed by opacity rather than mounted conditionally, so the
                tick transitions instead of popping in. Driven by React's own
                `checked` prop because this icon is nested one level deeper
                than a peer variant can reach. */}
            <Check
                className={`w-3.5 h-3.5 md:w-3 md:h-3 text-white transition-opacity duration-150 ${
                    checked ? "opacity-100" : "opacity-0"
                }`}
                strokeWidth={3.5}
            />
        </span>
        <label
            htmlFor={id}
            // ms-2 rather than a gap on the flex parent: the label must own
            // the spacing so the whole strip between box and text is still
            // part of the click target.
            className={`ms-2 cursor-pointer peer-disabled:opacity-50 peer-disabled:cursor-not-allowed ${labelClassName || FIELD_TEXT}`}
        >
            {label}
        </label>
    </div>
);

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.node,
    touchTarget: PropTypes.bool,
    labelClassName: PropTypes.string,
    className: PropTypes.string,
};

export default Checkbox;
