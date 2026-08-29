import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { DegreePrograms } from "../../CountriesList";
import { Input, SelectInput, RequiredAstrik, SkillsMultiSelect } from "./index";
import StepContainer from "./StepContainer";
import useFormContext from "../../hooks/useFormContext";
import { useToast } from "../Toast";
import useScrollIntoViewOnFocus from "../../hooks/useScrollIntoViewOnFocus";
import { LABEL_CLASSES, TEXTAREA_CLASSES, FIELD_TEXT } from "./fieldStyles";

const ProfessionalInfo = () => {
    const toast = useToast();
    const handleFocus = useScrollIntoViewOnFocus();

    const [majors, setMajors] = useState([]);
    const [colleges, setColleges] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('Select');
    const [selectedCollege, setSelectedCollege] = useState('Select');
    const [selectedMajor, setSelectedMajor] = useState('Select');
    const [noExperience, setNoExperience] = useState(false);

    const { updateFormData, formData } = useFormContext();

    const handleNoExperienceChange = (e) => {
        const checked = e.target.checked;
        setNoExperience(checked);
        if (checked) {
            updateFormData("Experience", "No prior work experience");
        } else {
            updateFormData("Experience", "");
        }
    };

    // When program changes, update college list
    useEffect(() => {
        if (DegreePrograms[selectedProgram]) {
            setColleges(Object.keys(DegreePrograms[selectedProgram]));
        } else {
            setColleges([]);
        }

        // Reset downstream values
        setSelectedCollege('Select');
        setSelectedMajor('Select');
        setMajors([]);
        updateFormData("College", "");
        updateFormData("Major", "");
        // updateFormData isn't memoized in FormContext, so including it here
        // would re-run this effect (and reset College/Major) on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProgram]);

    // When college changes, update majors list
    useEffect(() => {
        if (DegreePrograms[selectedProgram] && DegreePrograms[selectedProgram][selectedCollege]){
            setMajors(DegreePrograms[selectedProgram][selectedCollege]);
        }
        else {
            setMajors([]);
        }

        // Reset major
        setSelectedMajor('Select');
        updateFormData("Major", "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCollege, selectedProgram]);

    const handleCollegeChange = (value) => {
        setSelectedCollege(value);
    };

    const handleMajorChange = (value) => {
        setSelectedMajor(value);
    };

    // Must match multer's `limits.fileSize` in backend/config/cloudinary.js —
    // the frontend previously capped at 2MB while the backend allowed 4MB.
    const MAX_CV_BYTES = 4 * 1024 * 1024;

    // Mirrors formData.CV so the styled control can show the chosen filename
    // and size — a hidden native input can't display them itself.
    const cvFile = formData.CV instanceof File ? formData.CV : null;

    const clearCV = () => {
        updateFormData("CV", null);
        const input = document.getElementById("CV");
        // Reset the input's value too, otherwise re-picking the same file
        // fires no change event and the field silently stays empty.
        if (input) input.value = "";
    };

    const uploadCV = (e) => {
        const file = e.target.files[0];

        // Cancelling the file picker fires change with no file. The old
        // `file?.size <= MAX` was false in that case and wrongly showed the
        // "too large" error, so bail out first.
        if (!file) return;

        if (file.size > MAX_CV_BYTES) {
            toast("Your CV must be under 4MB.", { type: 'warning' });
            e.target.value = '';
            return;
        }

        updateFormData("CV", file);
    };

    return (
        <StepContainer id="ProfessionalInfo">
            <div className="flex flex-col gap-y-3 md:gap-y-4">
                    {/* Row 1: Study Program, College, Major */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3">
                        <SelectInput
                            label={"Study Program"}
                            options={Object.keys(DegreePrograms)}
                            handleChange={setSelectedProgram}
                            fieldClasses="col-span-12 md:col-span-3"
                        />
                        <SelectInput
                            label={"College"}
                            options={colleges}
                            value={selectedCollege}
                            handleChange={handleCollegeChange}
                            fieldClasses="col-span-12 md:col-span-4"
                        />
                        <SelectInput
                            label={"Major"}
                            options={majors}
                            value={selectedMajor}
                            handleChange={handleMajorChange}
                            fieldClasses="col-span-12 md:col-span-5"
                        />
                    </div>

                    {/* Row 2: Skills Section */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3">
                        <SkillsMultiSelect
                            label="Technical Skills"
                            fieldName="Technical Skills"
                            fieldClasses="col-span-12 md:col-span-6"
                        />
                        <SkillsMultiSelect
                            label="Non-technical Skills"
                            fieldName="Non-technical skills"
                            fieldClasses="col-span-12 md:col-span-6"
                        />
                    </div>

                    {/* Row 3: CGPA, Expected to Graduate, Experience */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3 items-start">
                        <Input fieldClasses="col-span-5 md:col-span-2" label="CGPA" />
                        <Input fieldClasses="col-span-7 md:col-span-3" label="Expected to Graduate" />
                        {/* Experience keeps its own markup rather than using
                            <Input label="Experience" />: it is a controlled
                            field driven by the "No prior experience" checkbox,
                            while Input is uncontrolled (ref-based) and would
                            fight that. It does share the styling constants and
                            now carries a real <label htmlFor>, which the bare
                            <h2> never gave it. */}
                        <div className="col-span-12 md:col-span-7">
                            <div className="flex flex-col h-full">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                                    <label htmlFor="Experience" className={`${LABEL_CLASSES} mb-0 cursor-pointer`}>
                                        Experience: <RequiredAstrik required={true} />
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            id="noExperience"
                                            checked={noExperience}
                                            onChange={handleNoExperienceChange}
                                            className="w-5 h-5 md:w-4 md:h-4 accent-[#0E7F41]"
                                        />
                                        <label htmlFor="noExperience" className={`${FIELD_TEXT} text-fg-muted cursor-pointer`}>
                                            No prior experience
                                        </label>
                                    </div>
                                </div>
                                <textarea
                                    id="Experience"
                                    name="Experience"
                                    disabled={noExperience}
                                    value={noExperience ? "No prior work experience" : (formData.Experience === "No prior work experience" ? "" : formData.Experience)}
                                    onChange={(e) => updateFormData("Experience", e.target.value)}
                                    onFocus={handleFocus}
                                    placeholder="E.g., Internship at ABC Company, Part-time job, Volunteer work, University projects..."
                                    className={`flex-1 ${TEXTAREA_CLASSES} min-h-16 md:min-h-20 ${noExperience ? 'bg-surface-hover text-fg-faint border-line' : 'border-line-strong'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 4: CV Upload */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3">
                        <div className="col-span-12 md:col-span-6 flex flex-col justify-start">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-x-3">
                                <label htmlFor="CV" className={`${LABEL_CLASSES} mb-0 cursor-pointer`}>
                                    Attach your resume: <RequiredAstrik required={true} />
                                </label>
                                {/* The native file input renders an unstyleable
                                    OS button and overflows with a long filename,
                                    so it is hidden and driven by a label styled
                                    as a proper 44px control. */}
                                <div className="flex items-center gap-2 w-full md:w-auto min-w-0">
                                    <input
                                        id="CV"
                                        onChange={uploadCV}
                                        type="file"
                                        name="cvfile"
                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="CV"
                                        className="inline-flex items-center gap-1.5 h-11 md:h-9 px-3 shrink-0 bg-white dark:bg-[#1a2438] border border-line-strong rounded-lg text-xs md:text-sm cursor-pointer hover:bg-surface-hover transition-colors"
                                    >
                                        <Upload className="w-4 h-4 text-fg-muted" />
                                        {cvFile ? "Change file" : "Choose file"}
                                    </label>
                                    {cvFile ? (
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-xs md:text-sm text-fg truncate" title={cvFile.name}>
                                                {cvFile.name}
                                            </span>
                                            <span className="text-[11px] text-fg-muted shrink-0">
                                                {(cvFile.size / 1024 / 1024).toFixed(1)}MB
                                            </span>
                                            <button
                                                type="button"
                                                onClick={clearCV}
                                                aria-label="Remove attached resume"
                                                className="shrink-0 w-8 h-8 md:w-6 md:h-6 inline-flex items-center justify-center rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-fg-muted truncate">PDF or Word, under 4MB</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </StepContainer>
    );
};

export default ProfessionalInfo;
