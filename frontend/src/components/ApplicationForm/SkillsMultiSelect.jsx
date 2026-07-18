import PropTypes from "prop-types";
import { useState, useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import { FormContext } from "../../context/FormContext";
import useDropdownPosition from "../../hooks/useDropdownPosition";
import { RequiredAstrik } from "./index";

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

const SkillsMultiSelect = ({ label, fieldName, skillsList, fieldClasses = "" }) => {
    const { formData, setFormData } = useContext(FormContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const inputRef = useRef(null);
    const triggerRect = useDropdownPosition(triggerRef, isOpen);

    const skills = skillsList || (fieldName === "Technical Skills" ? TECHNICAL_SKILLS : NON_TECHNICAL_SKILLS);
    const selectedSkills = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];

    // Handle click outside to close dropdown — the panel is portaled to
    // document.body, so it's checked separately from dropdownRef.
    useEffect(() => {
        const handleClickOutside = (e) => {
            const insideTrigger = dropdownRef.current && dropdownRef.current.contains(e.target);
            const insidePanel = panelRef.current && panelRef.current.contains(e.target);
            if (!insideTrigger && !insidePanel) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredSkills = skills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSkills.includes(skill)
    );

    const handleSelect = (skill) => {
        setFormData((prev) => {
            const currentSkills = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
            return { ...prev, [fieldName]: [...currentSkills, skill] };
        });
        setSearchTerm("");
        inputRef.current?.focus();
    };

    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName].filter(s => s !== skill)
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && searchTerm === "" && selectedSkills.length > 0) {
            handleRemoveSkill(selectedSkills[selectedSkills.length - 1]);
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (searchTerm && !skills.includes(searchTerm) && !selectedSkills.includes(searchTerm)) {
                // Add custom skill
                handleSelect(searchTerm);
            } else if (filteredSkills.length > 0) {
                handleSelect(filteredSkills[0]);
            }
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div className={`flex flex-col ${fieldClasses}`} ref={dropdownRef}>
            <h2 className="text-xs md:text-sm mb-1">
                {label}: <RequiredAstrik required={true} />
            </h2>

            {/* Input Container with tags inside */}
            <div
                ref={triggerRef}
                className={`relative w-full min-h-[32px] md:min-h-[36px] px-2 py-1 bg-transparent border border-line-strong rounded-md cursor-text flex flex-wrap gap-1 items-center pr-8 ${isOpen ? 'ring-2 ring-primary border-transparent' : ''}`}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Selected Tags inside input */}
                {selectedSkills.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#0E7F41]/10 text-[#0E7F41] text-[10px] md:text-xs rounded-md"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSkill(skill);
                            }}
                            className="hover:text-red-500 transition-colors ml-0.5"
                        >
                            <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </button>
                    </span>
                ))}

                {/* Search Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedSkills.length === 0 ? `Search ${label.toLowerCase()}...` : ""}
                    className="flex-1 min-w-[80px] outline-none text-xs md:text-sm py-0.5 bg-transparent"
                />

                {/* Dropdown Arrow */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown — portaled to document.body so it isn't clipped by
                the step containers' overflow-hidden. */}
            {isOpen && triggerRect && createPortal(
                <div
                    ref={panelRef}
                    className="fixed z-[1000] bg-surface-card border-line border rounded-md shadow-lg max-h-40 md:max-h-48 overflow-y-auto"
                    style={{ top: triggerRect.bottom + 4, left: triggerRect.left, width: triggerRect.width }}
                >
                    {/* Quick add custom skill */}
                    {searchTerm && !skills.includes(searchTerm) && !selectedSkills.includes(searchTerm) && (
                        <button
                            type="button"
                            onClick={() => handleSelect(searchTerm)}
                            className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-[#0E7F41] hover:bg-[#0E7F41]/10 border-b"
                        >
                            + Add &quot;{searchTerm}&quot;
                        </button>
                    )}

                    {filteredSkills.length > 0 ? (
                        filteredSkills.slice(0, 15).map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => handleSelect(skill)}
                                className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-fg hover:bg-surface-hover transition-colors"
                            >
                                {skill}
                            </button>
                        ))
                    ) : (
                        !searchTerm && (
                            <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-fg-muted">
                                Type to search or add custom skills...
                            </div>
                        )
                    )}

                    {filteredSkills.length > 15 && (
                        <div className="px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-fg-faint border-line border-t">
                            Type to filter more skills...
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Selected count */}
            {selectedSkills.length > 0 && (
                <p className="text-[10px] md:text-xs text-fg-muted mt-0.5">
                    {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                </p>
            )}
        </div>
    );
};

SkillsMultiSelect.propTypes = {
    label: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    skillsList: PropTypes.arrayOf(PropTypes.string),
    fieldClasses: PropTypes.string,
};

export default SkillsMultiSelect;
