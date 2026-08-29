import PropTypes from "prop-types";
import { RequiredAstrik } from "./index";
import FieldHint from "./FieldHint";
import useShake from "../../hooks/useShake";
import { LABEL_CLASSES, WRAPPER_CLASSES } from "./fieldStyles";

// Label + control + error, wired together properly.
//
// Every field in this form previously rendered its label as `<h2>Gender:</h2>`
// — a heading with no association to the control beneath it. A screen reader
// user tabbing into the control heard only whatever `aria-label` happened to
// say, and the headings polluted the document outline (a form is not nine
// nested sections). Worse, SelectInput's aria-label interpolated the *current
// value*, so the control's accessible name changed every time the user picked
// something; a name is meant to be stable.
//
// Here the label is a real <label htmlFor>, so:
//   - clicking the label focuses the control (free, and expected)
//   - the accessible name comes from the label and stays stable
//   - the error is referenced by aria-describedby and announced on focus
//   - aria-invalid tells assistive tech the field is in an error state
//
// `as="span"` is available for the cases where the control isn't a single
// focusable element with an id (the skills multi-select renders a composite),
// so the shell can still lay out label + error without emitting a <label>
// that points at nothing.

const FieldShell = ({
    label,
    htmlFor,
    required = false,
    hint,
    error,
    errorId,
    className = "",
    labelAs = "label",
    children,
}) => {
    const LabelTag = labelAs;
    const labelProps = labelAs === "label" ? { htmlFor } : {};

    // Shakes once on the transition into an error state — the moment a field
    // is rejected. Every field routes its error through this component, so
    // wiring it here covers inputs, selects, multi-selects and the date
    // picker without each of them repeating it.
    const shakeRef = useShake(Boolean(error));

    return (
        // data-reveal opts this field into StepContainer's staggered entrance.
        // The stagger is capped as a total, so adding fields to a step slows
        // nothing down.
        <div data-reveal ref={shakeRef} className={`${WRAPPER_CLASSES} ${className}`}>
            <LabelTag
                {...labelProps}
                id={`${label}-label`}
                className={`${LABEL_CLASSES} ${labelAs === "label" ? "cursor-pointer" : ""}`}
            >
                {label}:{required && <RequiredAstrik required={true} />}
                {hint && <FieldHint text={hint} />}
            </LabelTag>

            {children}

            {/* role="alert" so a validation failure is announced when it
                appears, rather than only being discovered by a user who
                happens to navigate back over the field. */}
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-xs text-red-500 mt-0.5 ml-1"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

FieldShell.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string,
    required: PropTypes.bool,
    hint: PropTypes.string,
    error: PropTypes.string,
    errorId: PropTypes.string,
    className: PropTypes.string,
    labelAs: PropTypes.oneOf(["label", "span"]),
    children: PropTypes.node,
};

export default FieldShell;
