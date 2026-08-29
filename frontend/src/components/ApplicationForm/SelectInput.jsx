import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Search } from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useFieldState from "../../hooks/useFieldState";
import useLocaleContext from "../../hooks/useLocaleContext";
import { labelFor } from "../../i18n/options";
import { fieldLabelMap } from "../../i18n/messages";
import FieldShell from "./FieldShell";
import {
    FIELD_MIN_HEIGHT,
    FIELD_SURFACE,
    FIELD_TEXT,
    PANEL_CLASSES,
    OPTION_CLASSES,
} from "./fieldStyles";

// Rebuilt on Radix Select.
//
// The previous implementation was a <div role="button"> that claimed
// `aria-haspopup="listbox"` and then portaled a plain <div> of <button>s —
// there was no listbox, no role="option", no aria-selected, and no
// aria-activedescendant. A screen reader announced "button", opened it, and
// found an unlabelled pile of buttons with no indication of how many options
// existed or which was current. Arrow keys only *opened* the panel; they never
// moved between options. That is what this rewrite fixes, and it is a device-
// independent fix — the same break affected NVDA on Windows, VoiceOver on
// macOS and iOS, and anyone navigating by keyboard alone.
//
// Radix gives us, correctly and for free: real combobox/listbox/option
// semantics, roving focus with type-ahead, Home/End, Escape-to-close, focus
// return to the trigger on close, scroll locking that behaves on iOS, and
// `aria-activedescendant` wiring. The visual design is unchanged — Radix ships
// unstyled, so every Tailwind class here is the project's own.
//
// Type-to-filter is kept for long lists, but as a search box *inside* the
// panel rather than replacing the trigger's text. The old approach swapped the
// trigger into an <input> on open, which meant the field's visible label text
// vanished the moment it was opened.

// Lists shorter than this are faster to eyeball than to search, and the search
// box would just cost a row of panel height.
const SEARCH_THRESHOLD = 8;

const SelectInput = ({
    label,
    value,
    options,
    fieldClasses,
    selectClasses,
    handleChange,
    required = true,
    placeholder,
    // Optional { "English value": "Arabic label" } map from i18n/options.js.
    // When absent (or a key is missing/empty), the English string itself is
    // shown — see labelFor(). formData/handleChange always receive the
    // English `option` value; this only changes what is rendered.
    labelMap,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { formData, updateFormData } = useFormContext();
    const { locale } = useLocaleContext();
    // What the user actually SEES for a given English option value — the
    // Arabic label when one exists, else the English value itself.
    const displayLabel = (option) => (locale === "ar" ? labelFor(labelMap, option) : option);
    // The FIELD's own name (e.g. "Nationality"), for the placeholder/search
    // text — distinct from displayLabel above, which translates the OPTIONS
    // inside the field. FieldShell already translates the visible <label>
    // itself; this covers this component's own two extra mentions of the
    // field name (the closed-state placeholder and the search box).
    const displayFieldName = locale === "ar" ? labelFor(fieldLabelMap, label) : label;

    const currentValue = value !== undefined ? value : (formData[label] || "");

    const { markTouched, errorMessage, showError, borderClass, errorId } = useFieldState({
        label,
        required,
        hasValue: currentValue,
    });

    const fallbackPlaceholder =
        placeholder ||
        (locale === "ar"
            ? displayFieldName
            : `Select ${label === "Study Program" ? "Program" : label}`);

    const showSearch = options.length > SEARCH_THRESHOLD;

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const term = searchTerm.toLowerCase();
        // Match against whatever text is actually on screen (the Arabic
        // label when one is shown), not just the English value — typing "ال"
        // to find "السعودية" must work, not only typing "Saudi".
        return options.filter((opt) => displayLabel(opt).toLowerCase().includes(term));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, searchTerm, locale]);

    const handleValueChange = (option) => {
        handleChange?.(option);
        updateFormData(label, option);
        markTouched();
    };

    // Radix treats "" as "no value", and rejects an empty-string <Item value>.
    // The placeholder covers the empty case, so only pass a real selection.
    const selectValue = currentValue || undefined;

    const triggerId = `${label}-trigger`;

    return (
        <FieldShell
            label={label}
            htmlFor={triggerId}
            required={required}
            error={showError ? errorMessage : undefined}
            errorId={errorId}
            className={fieldClasses}
        >
            <Select.Root
                value={selectValue}
                onValueChange={handleValueChange}
                onOpenChange={(open) => {
                    if (!open) {
                        setSearchTerm("");
                        markTouched();
                    }
                }}
            >
                <Select.Trigger
                    id={triggerId}
                    aria-invalid={showError || undefined}
                    aria-describedby={errorId}
                    className={`relative flex items-center justify-between gap-2 ${FIELD_MIN_HEIGHT} ${FIELD_SURFACE} px-2 py-1 ${FIELD_TEXT} text-start cursor-pointer
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                        data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent
                        active:bg-surface-hover
                        ${borderClass} ${selectClasses || ""}`}
                >
                    {/* Radix renders the selected item's text here, or the
                        placeholder when there is no value. */}
                    <Select.Value
                        placeholder={
                            <span className="text-fg-faint">{fallbackPlaceholder}</span>
                        }
                    />
                    <Select.Icon asChild>
                        <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted shrink-0 transition-transform duration-200" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    {/* position="popper" anchors to the trigger and flips when
                        there isn't room below — including against the *visual*
                        viewport, so an open on-screen keyboard pushes the panel
                        above the field instead of behind the keyboard. That
                        replaces the hand-rolled useDropdownPosition hook (now
                        deleted), which measured visualViewport manually to do
                        the same job for three separate call sites. */}
                    <Select.Content
                        position="popper"
                        sideOffset={4}
                        collisionPadding={8}
                        className={`overlay-pop z-[1000] ${PANEL_CLASSES}`}
                        style={{
                            width: "var(--radix-select-trigger-width)",
                            maxHeight: "var(--radix-select-content-available-height)",
                            WebkitOverflowScrolling: "touch",
                        }}
                        // Keep the trigger's own press from re-opening a panel
                        // that this close is dismissing.
                        onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                        {showSearch && (
                            <div className="sticky top-0 z-10 bg-white dark:bg-[#131b2c] border-b border-line p-1.5">
                                <div className="flex items-center gap-1.5 px-1.5">
                                    <Search className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        // Radix's type-ahead would otherwise
                                        // swallow these keys to jump between
                                        // options while the user is typing a
                                        // filter.
                                        onKeyDown={(e) => e.stopPropagation()}
                                        placeholder={locale === "ar" ? displayFieldName : `Search ${label}...`}
                                        aria-label={locale === "ar" ? displayFieldName : `Search ${label}`}
                                        className={`flex-1 min-w-0 h-8 bg-transparent outline-none ${FIELD_TEXT}`}
                                    />
                                </div>
                            </div>
                        )}

                        <Select.ScrollUpButton className="flex items-center justify-center h-6 text-fg-muted">
                            <ChevronUp className="h-4 w-4" />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <Select.Item
                                        key={option}
                                        value={option}
                                        className={`${OPTION_CLASSES} rounded-md flex items-center justify-between gap-2 outline-none cursor-pointer
                                            data-[highlighted]:bg-surface-hover data-[highlighted]:text-fg
                                            data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-medium`}
                                    >
                                        {/* Radix's closed-state <Select.Value>
                                            mirrors whatever text the matching
                                            ItemText rendered — there is no
                                            separate place to localize the
                                            trigger's display, fixing this one
                                            spot covers both. */}
                                        <Select.ItemText>{displayLabel(option)}</Select.ItemText>
                                        <Select.ItemIndicator asChild>
                                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))
                            ) : (
                                <div className={`px-2 md:px-3 py-2 ${FIELD_TEXT} text-fg-muted`}>
                                    No matching options found
                                </div>
                            )}
                        </Select.Viewport>

                        <Select.ScrollDownButton className="flex items-center justify-center h-6 text-fg-muted">
                            <ChevronDown className="h-4 w-4" />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </FieldShell>
    );
};

SelectInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    fieldClasses: PropTypes.string,
    selectClasses: PropTypes.string,
    handleChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    labelMap: PropTypes.objectOf(PropTypes.string),
};

export default SelectInput;
