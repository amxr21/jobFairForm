import { useState, useRef } from "react";

import { CountriesList, Colleges } from "./CountriesList";


import { FormHeader, Input, Languages, Skills } from "./index";
import useFormContext from "../../Hooks/useFormContext";

import { SelectInput } from "./index";

const ProfessionalInfo = () => {
    const [cv, setCV] = useState(null);

    const { formData, updateFormData } = useFormContext();

    const major = useRef();
        const getCollegeOption = () => {
            updateFormData("College", college.current.value);
        }

    const getMajorOption = () => {
        updateFormData("Major", major.current.value);
    }

    const colleges = Object.keys(Colleges);
    const collegesObject = Colleges;

    const college = useRef()

    const specifyColleges = () => {
        setA([]);
        setA(collegesObject[college.current.value]);
    }


    const uploadCV = (e) => {
        setCV(e.target.files[0]);
        updateFormData("CV", e.target.files[0]);
        console.log("File uploaded successfully ");
        console.log(e.target.files[0]);
    }
    const [a, setA] = useState([])


    let i = 0;

    return(
        <>
            {/* <FormHeader header={"2. Professional Information"} /> */}
            <div id="ProfessionalInfo" className=" md:mb-20 md:grid md:grid-cols-12 gap-x-8 gap-y-8 my-6 h-full md:h-[24em]">
                    <SelectInput label={"Study Program"} options={["Diploma", "Bachelor", "Master", "PhD"]} fieldClasses="col-span-4" />
                    <div onChange={specifyColleges} className="flex flex-col grow mb-4 md:my-0 col-span-4">
                        <h2 className="text-md md:text-lg mb-2">{"College"}:</h2>
                        <select onChange={getCollegeOption} ref={college} className="bg-transparent border border-gray-700 rounded-lg py-1.5 px-2" name={"College"} id={"College"}>
                            <option className=""  defaultChecked> -- select a/an {"College"} -- </option>
                            {
                                colleges.map((option)=>{
                                    i++;
                                    return (
                                        <option key={i} className="text-md md:text-lg mb-2 md:my-2" value={option}>{option}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="flex flex-col grow mb-4 md:my-0 col-span-4">
                        <h2 className="text-md md:text-lg mb-2">{"Major"}:</h2>
                        <select onChange={getMajorOption} ref={major} className="bg-transparent border border-gray-700 rounded-lg py-1.5 px-2" name={"Major"} id={"Major"}>
                            <option defaultChecked> -- select a/an {"Major"} -- </option>
                            {
                                a?.map((major)=>{
                                    i++;
                                    return (
                                        <option key={i} className="text-md md:text-lg mb-2 md:my-2" value={major}>{major}</option>
                                    )
                                })
                            }
                        </select>
                    </div>




                    <Input label={"LinkedIn URL"} type={"text"} fieldClasses="col-span-5" />
                    <Input label={"Personal Website (if any)"} type={"text"} fieldClasses="col-span-7" />




                    <Skills label={"Experience"} classes="col-span-6 h-24 md:h-48" />


                    <div className="col-span-6">
                        <div className="flex flex-col grow gap-8 mb-4 md:my-0">
                            {/* <Languages /> */}
                            <Input label={"Skills"} type={"text"} />
                            <div className="flex flex-col md:flex-row h-16 items-center justify-between gap-x-4">
                                <h2 className="text-md md:text-lg mb-2">CV:</h2>
                                <input id="CV" onChange={uploadCV} type="file" name="cvfile" className="text-sm w-64 bg-transparent border border-gray-700 rounded-lg py-1.5 px-2" />

                            </div>
                        </div>
                        {/* <Input name={"Portfolio"} label={"Portfolio"} type={"text"} /> */}

                    </div>


            </div> 
        </>
    )
}


export default ProfessionalInfo;