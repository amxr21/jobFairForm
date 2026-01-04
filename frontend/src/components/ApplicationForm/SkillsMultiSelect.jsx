import { useState, useContext, useRef, useEffect } from "react";
import { FormContext } from "../../Context/FormContext";
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
    const inputRef = useRef(null);

    const skills = skillsList || (fieldName === "Technical Skills" ? TECHNICAL_SKILLS : NON_TECHNICAL_SKILLS);
    const selectedSkills = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
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
                className={`relative w-full min-h-[36px] md:min-h-[40px] px-2 py-1 md:py-1.5 bg-transparent border border-gray-700 rounded-lg cursor-text flex flex-wrap gap-1 items-center pr-8 ${isOpen ? 'ring-2 ring-blue-400 border-transparent' : ''}`}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Selected Tags inside input */}
                {selectedSkills.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] md:text-xs rounded-md"
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
                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
                    <svg
                        className={`h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="relative">
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 md:max-h-48 overflow-y-auto">
                        {/* Quick add custom skill */}
                        {searchTerm && !skills.includes(searchTerm) && !selectedSkills.includes(searchTerm) && (
                            <button
                                type="button"
                                onClick={() => handleSelect(searchTerm)}
                                className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-blue-600 hover:bg-blue-50 border-b"
                            >
                                + Add "{searchTerm}"
                            </button>
                        )}

                        {filteredSkills.length > 0 ? (
                            filteredSkills.slice(0, 15).map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleSelect(skill)}
                                    className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm hover:bg-gray-100 transition-colors"
                                >
                                    {skill}
                                </button>
                            ))
                        ) : (
                            !searchTerm && (
                                <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-500">
                                    Type to search or add custom skills...
                                </div>
                            )
                        )}

                        {filteredSkills.length > 15 && (
                            <div className="px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-gray-400 border-t">
                                Type to filter more skills...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Selected count */}
            {selectedSkills.length > 0 && (
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                    {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                </p>
            )}
        </div>
    );
};

export { TECHNICAL_SKILLS, NON_TECHNICAL_SKILLS };
export default SkillsMultiSelect;
