import { useState, useRef, useEffect } from "react";
import { CountriesList, DegreePrograms } from "../../CountriesList";
import { FormHeader, Input, Languages, Experiences, SelectInput, RequiredAstrik } from "./index";
import useFormContext from "../../Hooks/useFormContext";

const ProfessionalInfo = () => {
    const [cv, setCV] = useState(null);
    const [majors, setMajors] = useState([]);
    const [colleges, setColleges] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('Select');
    const [selectedCollege, setSelectedCollege] = useState('Select');
    const [selectedMajor, setSelectedMajor] = useState('Select');

    const { formData, updateFormData } = useFormContext();

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
        // const value = e?.target?.value;
        setSelectedCollege(value);
        // updateFormData("College", value);
    };

    const handleMajorChange = (value) => {
        // const value = e?.target?.value;
        setSelectedMajor(value);
        // updateFormData("Major", value);
    };

    const uploadCV = (e) => {
        let file = e.target.files[0];

        if(file?.size <= 2 * 1024 *1024){
            setCV(file);
            updateFormData("CV", file);
            console.log("File uploaded successfully:", file);
        }
        else{
            alert("Can't exceed 2MB !")
            file = ''

        }
        
    };

    return (
        <>
            <div id="ProfessionalInfo" className="overflow-x-hidden overflow-y-auto md:grid mb-2 md:mb-0 md:grid-cols-12 gap-x-8 gap-y-8 h-full">
                <SelectInput
                    label={"Study Program"}
                    options={Object.keys(DegreePrograms)}
                    handleChange={setSelectedProgram}
                    fieldClasses="col-span-3"
                />

                {/* College Select */}
                <SelectInput
                    label={"College"}
                    options={colleges}
                    value={selectedCollege}
                    handleChange={handleCollegeChange}
                    fieldClasses="flex flex-col grow mb-4 md:my-0 col-span-3"
                    selectClasses=''
                />
                 
                {/* Major Select */}
                <SelectInput
                    label={"Major"}
                    options={majors}
                    value={selectedMajor}
                    handleChange={handleMajorChange}
                    fieldClasses="flex flex-col grow mb-4 md:my-0 col-span-4"
                    selectClasses=''
                />



                <Input fieldClasses="col-span-2" label="CGPA" />

                
                <Experiences label="Technical Skills" classes="col-span-6 h-fit md:h-56 grow" />

                <div className="col-span-6 md:h-56 overflow-hidden">
                    <div className="flex flex-col grow justify-between gap-y-1 mb-4 md:my-0">
                        {/* <Languages /> */}
                        {/* <Input label="Technical Skills" type="text" /> */}
                        <Input label="Experience" type="text" />
                        <Input label="Non-technical skills" type="text" />
                    </div>
                </div>
                <div className="relative flex flex-col md:flex-row md:h-16 items-center justify-between gap-x-4 col-span-8">
                    <h2 className="text-md md:text-lg mb-2">Attach your resume:</h2>
                    <div className="">
                        <input
                            id="CV"
                            onChange={uploadCV}
                            type="file"
                            name="cvfile"
                            className="text-sm w-full md:max-w-56 bg-transparent border border-gray-700 rounded-lg py-1.5 px-2"
                        />
                        <RequiredAstrik />

                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfessionalInfo;
