import { Input, FormHeader, SelectInput, Languages } from "./index";
import { CountriesList } from "../../CountriesList";
import { useEffect, useRef, useState, useContext } from "react";

import useFormContext from "../../Hooks/useFormContext";

import SuitIcon from '../../assets/images/suitcase.svg'
import { useProgressContext } from "../../Context/ProgressContext";


const PersonalInfo = () => {

    const scrollToNextSection = (e) => {
        e.preventDefault();

        if(window.innerWidth < 1000){
            e.target.parentElement.parentElement.scrollBy({top: window.innerHeight*0.65});
        }
        else{
            e.target.parentElement.parentElement.scrollBy({top: window.innerHeight});

        }

        // console.log(e.target.parentElement.parentElement.parentElement);
        
        document.querySelector('.section-header').textContent = 'Professional Information'
        document.querySelector('.section-icon').src = SuitIcon

        document.querySelector('.progress-bar').classList.replace('md:h-0', 'md:h-1/2')
        document.querySelector('.progress-bar').classList.replace('w-0', 'w-1/2')

    }

    return (
        <>
            {/* <FormHeader header={"1. Personal Information"} /> */}
            <div id="PersonalInfo" className="md:h-full flex flex-col gap-y-2 justify-between w-full items-end mb-12">
                <div className="flex flex-col gap-y-8 w-full h-[45vh] overflow-y-auto md:overflow-hidden">
                    <div className="md:grid md:grid-cols-12 w-full gap-x-8 h-fit">
                        {/* <Input fieldClasses="col-span-12 md:col-span-8" label={"Full Name"} /> */}
                        <Input fieldClasses="col-span-12 md:col-span-4" label={"First Name"} />
                        <Input fieldClasses="col-span-12 md:col-span-4" label={"Last Name"} />
                        <Input fieldClasses="col-span-12 md:col-span-4" label={"University ID"} />
                    </div>
                    <div className="w-full md:grid md:grid-cols-12 gap-x-8 gap-y-8">
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

                </div>


                <button onClick={scrollToNextSection} className="min-w-12 min-h-12 border rounded-xl right-0">{'>'}</button>
            </div>
        </>
    )
}



export default PersonalInfo;