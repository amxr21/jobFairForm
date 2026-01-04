import { useState, useEffect } from "react";
import { DegreePrograms } from "../../CountriesList";
import { Input, SelectInput, RequiredAstrik, SkillsMultiSelect } from "./index";
import useFormContext from "../../Hooks/useFormContext";

const ProfessionalInfo = () => {
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
    }, [selectedCollege, selectedProgram]);

    const handleCollegeChange = (value) => {
        setSelectedCollege(value);
    };

    const handleMajorChange = (value) => {
        setSelectedMajor(value);
    };

    const uploadCV = (e) => {
        let file = e.target.files[0];

        if(file?.size <= 2 * 1024 *1024){
            updateFormData("CV", file);
            console.log("File uploaded successfully:", file);
        }
        else{
            alert("Can't exceed 2MB !")
            e.target.value = '';
        }
    };

    return (
        <div id="ProfessionalInfo" className="h-full flex flex-col w-full overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-y-3 md:gap-y-4">
                    {/* Row 1: Study Program, College, Major */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3">
                        <SelectInput
                            label={"Study Program"}
                            options={Object.keys(DegreePrograms)}
                            handleChange={setSelectedProgram}
                            fieldClasses="col-span-6 md:col-span-3"
                        />
                        <SelectInput
                            label={"College"}
                            options={colleges}
                            value={selectedCollege}
                            handleChange={handleCollegeChange}
                            fieldClasses="col-span-6 md:col-span-4"
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
                        <Input fieldClasses="col-span-4 md:col-span-2" label="CGPA" />
                        <Input fieldClasses="col-span-8 md:col-span-3" label="Expected to Graduate" />
                        <div className="col-span-12 md:col-span-7">
                            <div className="flex flex-col h-full">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                                    <h2 className="text-xs md:text-sm">
                                        Experience: <RequiredAstrik required={true} />
                                    </h2>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            id="noExperience"
                                            checked={noExperience}
                                            onChange={handleNoExperienceChange}
                                            className="w-3.5 h-3.5 md:w-4 md:h-4 accent-blue-800"
                                        />
                                        <label htmlFor="noExperience" className="text-xs md:text-sm text-gray-600">
                                            No prior experience
                                        </label>
                                    </div>
                                </div>
                                <textarea
                                    disabled={noExperience}
                                    value={noExperience ? "No prior work experience" : (formData.Experience === "No prior work experience" ? "" : formData.Experience)}
                                    onChange={(e) => updateFormData("Experience", e.target.value)}
                                    placeholder="E.g., Internship at ABC Company, Part-time job, Volunteer work, University projects..."
                                    className={`flex-1 w-full bg-transparent border border-gray-700 rounded-lg py-1 px-2 text-xs md:text-sm resize-none min-h-16 md:min-h-20 ${noExperience ? 'bg-gray-100 text-gray-400 border-gray-300' : ''}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 4: CV Upload */}
                    <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3">
                        <div className="col-span-12 md:col-span-6 flex flex-col justify-start">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-x-3">
                                <h2 className="text-xs md:text-sm shrink-0">Attach your resume:</h2>
                                <div className="flex items-center gap-1">
                                    <input
                                        id="CV"
                                        onChange={uploadCV}
                                        type="file"
                                        name="cvfile"
                                        className="text-xs md:text-sm w-full md:max-w-56 bg-transparent border border-gray-700 rounded-lg py-1 px-2 h-8 md:h-9"
                                    />
                                    <RequiredAstrik />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalInfo;
