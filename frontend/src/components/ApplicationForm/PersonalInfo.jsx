import { Input, FormHeader, SelectInput, Languages } from "./index";
import { CountriesList } from "../../CountriesList";
import { useEffect, useRef, useState, useContext } from "react";

import useFormContext from "../../Hooks/useFormContext";

import SuitIcon from '../../assets/images/suitcase.svg'
import { useProgressContext } from "../../Context/ProgressContext";


const PersonalInfo = () => {
    // const { setHeader, setIcon ,updateProgress } = useProgressContext()
    
    // const {formData, updateFormData} = useFormContext();

    // const major = useRef();
    // const getCollegeOption = () => {
    //     updateFormData("College", college.current.value);
    // }

    // const getMajorOption = () => {
    //     updateFormData("Major", major.current.value);
    // }


    const scrollToNextSection = (e) => {
        e.preventDefault();
        e.target.parentElement.parentElement.scrollBy({top: window.innerHeight});
        // console.log(e.target.parentElement.parentElement.parentElement);
        
        document.querySelector('.section-header').textContent = 'Professional Information'
        document.querySelector('.section-icon').src = SuitIcon

        document.querySelector('.progress-bar').classList.replace('md:h-0', 'md:h-1/2')
        document.querySelector('.progress-bar').classList.replace('w-0', 'w-1/2')

    }



    // const colleges = Object.keys(Colleges);
    // const collegesObject = Colleges;



    // const college = useRef()

    // const specifyColleges = () => {
    //     setA([]);
    //     setA(collegesObject[college.current.value]);
    // }


    // let i = 0;
    return (
        <>
            {/* <FormHeader header={"1. Personal Information"} /> */}
            <div id="PersonalInfo" className="md:mb-12 flex flex-col w-full items-end">
                <div className="md:grid md:grid-cols-12 w-full gap-x-8 overflow-x-hidden">
                    {/* <Input fieldClasses="col-span-12 md:col-span-8" label={"Full Name"} /> */}
                    <Input fieldClasses="col-span-12 md:col-span-4" label={"First Name"} />
                    <Input fieldClasses="col-span-12 md:col-span-4" label={"Last Name"} />
                    <Input fieldClasses="col-span-12 md:col-span-4" label={"University ID"} />
                </div>
                <div className="w-full md:grid md:grid-cols-12 gap-x-8 gap-y-8 my-6">
                    <Input fieldClasses="col-span-3" label={"Date of Birth"} />
                    <SelectInput fieldClasses="col-span-3" label={"Gender"} options={["Male", "Female"]} />
                    <SelectInput fieldClasses="col-span-3" label={"City"} options={["Ajman", "Sharjah", "Dubai", "Abu Dhabi", "Fujairah", "Ras Al-Khaima", "Um Al-Quwain"]} />
                    <SelectInput fieldClasses="col-span-3" label={"Nationality"} options={CountriesList} />

                    {/* <SelectInput label={"College"} options={colleges} /> */}
                    {/* <SelectInput label={"Major"} options={a} /> */}



                    <Input fieldClasses="col-span-4" label={"Email address"} />
                    <Input fieldClasses="col-span-4" label={'Mobile number'} />
                    {/* <Input fieldClasses="col-span-4" label={"CGPA"} /> */}
                    <Input label={"LinkedIn URL"} type={"text"} fieldClasses="col-span-4" />


                    <Languages classes="col-span-12"/>

                </div>


                <button onClick={scrollToNextSection} className="w-12 h-12 border rounded-xl right-0 md:mt-2">{'>'}</button>
            </div>
        </>
    )
}



export default PersonalInfo;