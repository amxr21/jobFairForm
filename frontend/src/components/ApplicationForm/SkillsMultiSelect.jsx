import PropTypes from "prop-types";
import { useState, useRef, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import useUniqueId from "../../hooks/useUniqueId";
import { X, ChevronDown } from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useLocaleContext from "../../hooks/useLocaleContext";
import useTranslation from "../../hooks/useTranslation";
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

// Rebuilt on Radix Popover.
//
// Radix Select is single-value, so a multi-select can't use it — but the
// accessibility contract is the same and was equally broken here before: the
// old version had no ARIA at all. It was a bare <div> with an <input> inside,
// portaling a list of <button>s. Assistive tech had no way to know this was a
// multi-select, how many skills were chosen, what the options were, or that
// the chips were removable.
//
// This is the WAI-ARIA editable-combobox-with-listbox pattern, built on Radix
// Popover for the overlay mechanics (dismiss, focus management, collision
// flipping against the visual viewport, iOS scroll locking) with the combobox
// wiring done explicitly on top:
//
//   - the text input is role="combobox" with aria-expanded / aria-controls
//   - the panel is role="listbox" with aria-multiselectable
//   - rows are role="option" with aria-selected
//   - aria-activedescendant tracks the highlighted row, so arrow keys move a
//     virtual cursor while real focus stays in the input (the pattern that
//     lets you keep typing while navigating)
//   - a live region announces additions and removals, since a chip appearing
//     is otherwise a silent DOM change
//   - each chip's remove button has its own accessible name

const TECHNICAL_SKILLS = [
    "JavaScript", "Python", "Java", "C++", "C#", "TypeScript", "PHP", "Ruby", "Swift", "Kotlin",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Express.js",
    "HTML/CSS", "SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase", "AWS", "Azure", "Google Cloud", "Docker",
    "Kubernetes", "Git", "Linux", "REST APIs", "GraphQL", "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch", "Pandas",
    "Excel Advanced", "Power BI", "Tableau", "MATLAB", "R Programming", "AutoCAD", "Figma", "Adobe Photoshop", "UI/UX Design", "Cybersecurity"
];

const NON_TECHNICAL_SKILLS = [
    "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management", "Adaptability", "Creativity", "Emotional Intelligence", "Decision Making",
    "Conflict Resolution", "Negotiation", "Public Speaking", "Presentation Skills", "Active Listening", "Written Communication", "Interpersonal Skills", "Collaboration", "Flexibility", "Work Ethic",
    "Attention to Detail", "Organization", "Planning", "Multitasking", "Self-Motivation", "Initiative", "Accountability", "Stress Management", "Patience", "Empathy",
    "Cultural Awareness", "Networking", "Customer Service", "Sales", "Marketing", "Research", "Analytical Thinking", "Strategic Thinking", "Project Management", "Mentoring",
    "Coaching", "Innovation", "Risk Management", "Quality Assurance", "Process Improvement", "Change Management", "Resource Management", "Stakeholder Management", "Budgeting", "Reporting"
];

const MAX_VISIBLE = 15;

const SkillsMultiSelect = ({
    label,
    fieldName,
    skillsList,
    fieldClasses = "",
    required = true,
    placeholder,
    allowCustom = true,
    // Wording for the count line and the empty-panel hint. Defaults suit
    // skills; Preferences passes "field" for its industry list.
    noun = "skill",
    // Optional { "English value": "Arabic label" } map (skills.js /
    // industries.js). formData always stores the English value; this only
    // changes what is rendered for chips and option rows.
    labelMap,
    // Lucide icon component, forwarded to FieldShell.
    icon,
}) => {
    const { formData, setFormData } = useFormContext();
    const { locale } = useLocaleContext();
    const t = useTranslation();
    const displayLabel = (val) => (locale === "ar" ? labelFor(labelMap, val) : val);
    // noun is always "skill" or "field" (see the callers in
    // ProfessionalInfo.jsx / Preferences.jsx) — messages.js keys its
    // multiSelect copy the same way, as two full noun-specific phrase sets
    // rather than one template, since "مهارة" (skill) and "مجال" (field) take
    // different grammatical agreement in Arabic and a single template can't
    // correctly serve both.
    const nounKey = noun === "field" ? "field" : "skill";
    const tn = (key, vars) => t(`multiSelect.${nounKey}.${key}`, vars);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [announcement, setAnnouncement] = useState("");
    const inputRef = useRef(null);
    // The whole field wrapper (chips + input), used to tell Radix that a
    // click or focus landing back on our own combobox is not "outside".
    const fieldRef = useRef(null);

    const reactId = useUniqueId("multiselect");
    const listboxId = `${reactId}-listbox`;
    const inputId = `${reactId}-input`;
    const optionId = (i) => `${reactId}-option-${i}`;

    const skills = skillsList || (fieldName === "Technical Skills" ? TECHNICAL_SKILLS : NON_TECHNICAL_SKILLS);

    // Memoised so the `: []` fallback isn't a fresh array identity on every
    // render — that would invalidate the filteredSkills memo below each time
    // and make it pointless.
    const selectedSkills = useMemo(
        () => (Array.isArray(formData[fieldName]) ? formData[fieldName] : []),
        [formData, fieldName]
    );

    const filteredSkills = useMemo(() => {
        const term = searchTerm.toLowerCase();
        // Match against the displayed text (Arabic label when one is shown),
        // not only the English value — otherwise typing Arabic to search
        // finds nothing even though every row is showing Arabic.
        return skills.filter(
            (skill) => displayLabel(skill).toLowerCase().includes(term) && !selectedSkills.includes(skill)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skills, searchTerm, selectedSkills, locale]);

    const visibleSkills = filteredSkills.slice(0, MAX_VISIBLE);

    // The "+ Add <custom>" row, when the typed term isn't a known or already
    // selected skill. It occupies index 0 of the navigable rows when present.
    const canAddCustom =
        allowCustom &&
        searchTerm.trim() &&
        !skills.includes(searchTerm.trim()) &&
        !selectedSkills.includes(searchTerm.trim());

    const rows = canAddCustom
        ? [{ type: "custom", value: searchTerm.trim() }, ...visibleSkills.map((s) => ({ type: "skill", value: s }))]
        : visibleSkills.map((s) => ({ type: "skill", value: s }));

    const addSkill = (skill) => {
        setFormData((prev) => {
            const current = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
            if (current.includes(skill)) return prev;
            return { ...prev, [fieldName]: [...current, skill] };
        });
        setAnnouncement(`${skill} added`);
        setSearchTerm("");
        setActiveIndex(0);
        inputRef.current?.focus();
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: (Array.isArray(prev[fieldName]) ? prev[fieldName] : []).filter((s) => s !== skill),
        }));
        setAnnouncement(`${skill} removed`);
    };

    const commitRow = (row) => {
        if (!row) return;
        addSkill(row.value);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!isOpen) { setIsOpen(true); return; }
                setActiveIndex((i) => (rows.length ? (i + 1) % rows.length : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!isOpen) { setIsOpen(true); return; }
                setActiveIndex((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0));
                break;
            case "Home":
                if (isOpen) { e.preventDefault(); setActiveIndex(0); }
                break;
            case "End":
                if (isOpen) { e.preventDefault(); setActiveIndex(Math.max(0, rows.length - 1)); }
                break;
            case "Enter":
                e.preventDefault();
                commitRow(rows[activeIndex]);
                break;
            case "Escape":
                if (isOpen) { e.preventDefault(); setIsOpen(false); }
                break;
            case "Backspace":
                // Only when the field is empty, so backspacing through typed
                // text doesn't eat chips.
                if (searchTerm === "" && selectedSkills.length > 0) {
                    removeSkill(selectedSkills[selectedSkills.length - 1]);
                }
                break;
            default:
                break;
        }
    };

    return (
        <FieldShell
            label={label}
            htmlFor={inputId}
            required={required}
            className={fieldClasses}
            icon={icon}
        >
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Anchor asChild>
                    <div
                        ref={fieldRef}
                        className={`relative ${FIELD_MIN_HEIGHT} ${FIELD_SURFACE} px-2 py-1 pe-8 cursor-text flex flex-wrap gap-1 items-center border-line-strong
                            focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent`}
                        onClick={() => {
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }}
                    >
                        {selectedSkills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-0.5 ps-1.5 pe-0.5 py-0.5 bg-primary/10 text-primary text-[10px] md:text-xs rounded-md"
                            >
                                {displayLabel(skill)}
                                <button
                                    type="button"
                                    // Without this the button is announced as
                                    // just "button" — one of many identical
                                    // ones — with no way to tell which chip it
                                    // belongs to.
                                    aria-label={t("multiSelect.remove", { value: displayLabel(skill) })}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSkill(skill);
                                    }}
                                    className="inline-flex items-center justify-center w-6 h-6 md:w-5 md:h-5 rounded hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                                >
                                    <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                </button>
                            </span>
                        ))}

                        <input
                            ref={inputRef}
                            id={inputId}
                            type="text"
                            role="combobox"
                            aria-expanded={isOpen}
                            aria-controls={isOpen ? listboxId : undefined}
                            aria-autocomplete="list"
                            aria-activedescendant={
                                isOpen && rows.length ? optionId(activeIndex) : undefined
                            }
                            aria-describedby={`${reactId}-count`}
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setActiveIndex(0);
                                setIsOpen(true);
                            }}
                            onFocus={() => setIsOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                selectedSkills.length === 0
                                    ? (placeholder || tn("searchPlaceholder"))
                                    : ""
                            }
                            className={`flex-1 min-w-[80px] outline-none ${FIELD_TEXT} py-0.5 bg-transparent`}
                        />

                        <div className="absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown
                                className={`h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </Popover.Anchor>

                <Popover.Portal>
                    <Popover.Content
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        collisionPadding={8}
                        className={`overlay-pop z-[1000] ${PANEL_CLASSES}`}
                        style={{
                            width: "var(--radix-popover-trigger-width)",
                            maxHeight: "var(--radix-popover-content-available-height)",
                            WebkitOverflowScrolling: "touch",
                        }}
                        // Focus must stay in the text input so the user can keep
                        // typing; the listbox is driven by aria-activedescendant
                        // rather than real focus.
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        // Picking an option must NOT close the panel — being
                        // able to choose several things without reopening is
                        // the entire point of a multi-select.
                        //
                        // The panel was closing on every pick because the
                        // combobox input lives in the Popover *anchor*, not in
                        // the portaled content: addSkill() refocuses it, Radix
                        // sees focus leave the panel, and dismisses. Same for
                        // the pointer event on a chip's remove button.
                        //
                        // So: treat interactions inside this field's own
                        // wrapper as inside. A click genuinely elsewhere on the
                        // page still dismisses normally.
                        onInteractOutside={(e) => {
                            if (fieldRef.current?.contains(e.target)) {
                                e.preventDefault();
                            }
                        }}
                        onFocusOutside={(e) => {
                            if (fieldRef.current?.contains(e.target)) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <ul
                            id={listboxId}
                            role="listbox"
                            aria-multiselectable="true"
                            aria-label={tn("optionsSuffix", { label: locale === "ar" ? labelFor(fieldLabelMap, label) : label })}
                            className="p-1 m-0 list-none"
                        >
                            {rows.length > 0 ? (
                                rows.map((row, i) => (
                                    <li
                                        key={`${row.type}-${row.value}`}
                                        id={optionId(i)}
                                        role="option"
                                        aria-selected={i === activeIndex}
                                        onClick={() => commitRow(row)}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        className={`${OPTION_CLASSES} rounded-md cursor-pointer ${
                                            i === activeIndex ? "bg-surface-hover" : ""
                                        } ${row.type === "custom" ? "text-primary" : "text-fg"}`}
                                    >
                                        {/* A "custom" row is exactly what the
                                            user typed — free text, not one of
                                            our known options — so it is never
                                            run through displayLabel. Only a
                                            recognized "skill" row has an
                                            Arabic translation to show. */}
                                        {row.type === "custom" ? tn("addCustom", { value: row.value }) : displayLabel(row.value)}
                                    </li>
                                ))
                            ) : (
                                <li className={`px-2 md:px-3 py-2 ${FIELD_TEXT} text-fg-muted`}>
                                    {searchTerm
                                        ? tn("noMatching")
                                        : allowCustom
                                            ? tn("typeToSearch")
                                            : tn("allSelected")}
                                </li>
                            )}
                        </ul>

                        {filteredSkills.length > MAX_VISIBLE && (
                            <div className="px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-fg-faint border-line border-t">
                                {filteredSkills.length - MAX_VISIBLE} more — type to filter
                            </div>
                        )}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {/* Announces chip add/remove, which are otherwise silent DOM
                changes to a screen reader. */}
            <span aria-live="polite" className="sr-only">
                {announcement}
            </span>

            <p id={`${reactId}-count`} className="text-[10px] md:text-xs text-fg-muted mt-0.5">
                {selectedSkills.length > 0
                    ? (selectedSkills.length === 1 ? tn("countSelectedOne") : tn("countSelected", { count: selectedSkills.length }))
                    : tn("noneSelectedYet")}
            </p>
        </FieldShell>
    );
};

SkillsMultiSelect.propTypes = {
    label: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    skillsList: PropTypes.arrayOf(PropTypes.string),
    fieldClasses: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    allowCustom: PropTypes.bool,
    noun: PropTypes.string,
    labelMap: PropTypes.objectOf(PropTypes.string),
    icon: PropTypes.elementType,
};

export default SkillsMultiSelect;
