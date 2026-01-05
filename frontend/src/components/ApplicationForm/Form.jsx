import axios from "axios";

import { useRef, createContext, useState, useContext, useEffect } from "react";
import { PersonalInfo, ProfessionalInfo, Preferences, SubmitFormBtn, ConfirmMessageDiv } from "./index";

// const link = "https://jobfairform-backend.onrender.com"
// const link = "https://jobfairform-backend-production.up.railway.app"
const link = "http://localhost:2001"

import { useAuthContext } from "../../Hooks/useAuthContext"
import useFormContext from "../../Hooks/useFormContext";

import { FormContext } from "../../Context/FormContext";
import ProgressSection from "./ProgressSection";

import PersonalIcon from '../../assets/images/personal.svg'
import { useProgressContext } from "../../Context/ProgressContext";
import LoadingPage from "../../pages/LoadingPage";


const keyMap = {
    uniId: "University ID",
    fullName: "Full Name",
    birthdate: "Date of Birth",
    gender: "Gender",
    nationality: "Nationality",
    studyLevel: "Study Program",
    college: "College",
    major: "Major",
    email: "Email address",
    phoneNumber: "Mobile number",
    cgpa: "CGPA",
    city: "City",
    linkedIn: "LinkedIn URL",
    technicalSkills: "Technical Skills",
    nonTechnicalSkills: "Non-technical skills",
    experience: "Experience",
    cvfile: "CV",
    // portfolio: "Personal Website (if any)",
    languages: "languages",
    ExpectedToGraduate: "Expected to Graduate",
  };

const requiredKey = {
    uniId: "University ID",
    fullName: "Full Name",
    birthdate: "Date of Birth",
    gender: "Gender",
    nationality: "Nationality",
    studyLevel: "Study Program",
    college: "College",
    major: "Major",
    email: "Email address",
    phoneNumber: "Mobile number",
    city: "City",
    technicalSkills: "Technical Skills",
    nonTechnicalSkills: "Non-technical skills",
    experience: "Experience",
    cvfile: "CV",
    // portfolio: "Personal Website (if any)",
    languages: "languages",
  };






const Form = () => {

    const { formData, fieldMissing } = useFormContext()

    const { user } = useAuthContext();
    const confirmationMessageRef = useRef("");

    const [formDataReq, setFormDataReq] = useState({});
    const [qrCodeSrc, setQRCodeSrc] = useState(null);

    const [isLoading, setIsLoading] = useState(false)

    const form = useRef();
    const [full, setFull] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');

    const goToNextStep = (e) => {
        e.preventDefault();
        if (currentStep < 3 && !isTransitioning) {
            setSlideDirection('slide-left');
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                updateProgressBar(currentStep + 1);
                setSlideDirection('slide-in-right');
                setTimeout(() => {
                    setIsTransitioning(false);
                    setSlideDirection('');
                }, 300);
            }, 200);
        }
    };

    const goToPrevStep = (e) => {
        e.preventDefault();
        if (currentStep > 1 && !isTransitioning) {
            setSlideDirection('slide-right');
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                updateProgressBar(currentStep - 1);
                setSlideDirection('slide-in-left');
                setTimeout(() => {
                    setIsTransitioning(false);
                    setSlideDirection('');
                }, 300);
            }, 200);
        }
    };

    const updateProgressBar = (step) => {
        const progressBar = document.querySelector('.progress-bar');
        const sectionHeader = document.querySelector('.section-header');
        const sectionIcon = document.querySelector('.section-icon');

        // Remove all progress classes
        progressBar.classList.remove('md:h-1/3', 'md:h-2/3', 'md:h-full', 'w-1/3', 'w-2/3', 'w-full');

        if (step === 1) {
            progressBar.classList.add('md:h-1/3', 'w-1/3');
            sectionHeader.textContent = 'Personal Information';
        } else if (step === 2) {
            progressBar.classList.add('md:h-2/3', 'w-2/3');
            sectionHeader.textContent = 'Professional Information';
        } else if (step === 3) {
            progressBar.classList.add('md:h-full', 'w-full');
            sectionHeader.textContent = 'Preferences (Optional)';
        }
    };





    const handleSubmit = async (e) => {

        try {

            setIsLoading(true)

            e.preventDefault()
            const formDataToSend = new FormData();
            console.log(formData);

            for (const [apiKey, formKey] of Object.entries(keyMap)) {
                const value = formData[formKey];

                // Handle File objects (CV)
                if (value instanceof File) {
                    formDataToSend.append(apiKey, value);
                }
                // Handle arrays (languages, skills, etc.)
                else if (Array.isArray(value)) {
                    formDataToSend.append(apiKey, JSON.stringify(value));
                }
                // Handle null/undefined - skip or append empty string
                else if (value === null || value === undefined) {
                    formDataToSend.append(apiKey, '');
                }
                // Handle regular values
                else {
                    formDataToSend.append(apiKey, value);
                }
              }



              const isFieldFilled = (value) => {
                if (typeof value === "string") return value.trim() !== "";
                if (Array.isArray(value)) return value.length > 0;
                if (value instanceof File) return value.size > 0;
                if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
                return value !== null && value !== undefined;
              };

              const filledFields = Object.values(formData).filter(isFieldFilled);

              console.log('====================================');
              console.log(filledFields);
              console.log('====================================');



            // const requiredFieldsFilled = Object.values(requiredKey).every(key => requiredKey[key]?.trim() !== "");
            // const validEmail = formData["Email address"]?.trim() !== "";
            // const validUniversityId = formData["University ID"]?.trim().length === 8;

            // if (requiredFieldsFilled && validEmail && validUniversityId) {

            console.log('====================================');
            console.log(filledFields);
            console.log(formData["Email address"]);
            console.log(formData["University ID"].length);
            console.log('====================================');

            if (filledFields.length >= 16 && formData["University ID"] && formData["University ID"].length == 8 && formData["Nationality"] != '' && formData["Major"] != '' ) {
                    e.preventDefault();

                    document.querySelector('.progress-bar').classList.replace('h-1/2', 'h-full')

                    console.log("Application submitted successfully");

                    setFull(true);





                    let confirmationResponse;
                    if(!user?.token){
                        confirmationResponse = await axios.post(`${link}/applicants`, formDataToSend);

                    }
                    else{
                        confirmationResponse = await axios.post(`${link}/applicants`, formDataToSend,
                        {
                            headers: {
                                Authorization: `Bearer ${user?.token}`
                            }
                        }
                );}

                // console.log(confirmationResponse, "\n\n\n\n-------------------------------\n\n\n\n");
                console.log(confirmationResponse.data.applicantProfile._id);
                setQRCodeSrc(confirmationResponse.data.applicantProfile._id);
                if(!confirmationResponse){
                    console.log("QR code has not been generated");
                }
                }

            else{
                setFull(false)

                setTimeout(() =>{setFull(true)}, 3000)

                return;
            }


            confirmRegistration();



        } catch (error) {
            throw new Error(error)
        }
        finally{
            console.log('We are done');
            setIsLoading(false)
        }






        // } catch(error){
            // console.log({error: error.message});
        // }

    }

    const confirmRegistration = (e) => {
        // e.preventDefault();
        // form.current.style.opacity = "0";
        form.current.classList.replace("opacity-100", "opacity-0");
        form.current.classList.replace("h-[86vh]", "h-0");
        form.current.classList.replace("xl:h-[90vh]", "h-0");
        form.current.classList.replace("p-5", "p-0");
        form.current.classList.replace("md:p-6", "p-0");
        form.current.classList.replace("xl:p-8", "p-0");
        // form.current.classList.replace("h-[100%]", "h-0");
        form.current.classList.replace("border", "border-none");
        // form.current.style.height = "fit-content";
        // form.current.classList.replace("h-fit", "h-0");
        // form.current.classList.replace("h-fit", "h-0");

        // form.current.classList.replace("py-10", "py-2");

        setTimeout(()=>{form.current.style.maxHeight = "none";}, 500)
        // document.getElementById("Form").classList.replace("opacity-0", "opacity-100")
        // document.getElementById("Form").classList.replace("h-0", "h-fit");

        // document.querySelector(".confirmMessageRef").current.classList.replace("hidden", "block")
        document.querySelector(".confirmMessageRef").classList.replace("opacity-0", "opacity-100");
        document.querySelector(".confirmMessageRef").classList.replace("h-0", "h-[86vh]");
        document.querySelector(".confirmMessageRef").classList.add("md:h-fit");
        document.querySelector(".confirmMessageRef").classList.replace("md:p-0", "md:p-8");
        document.querySelector(".confirmMessageRef").classList.replace("p-0", "p-5");


        // const confirmationResponse = await axios.post("http://localhost:2000/applicants/qr", formDataReq);
        // setQRCodeSrc(confirmationResponse.data);
        // console.log(confirmationResponse);
        // if(!confirmationResponse){
        //     console.log("QR code has not been generated");
        // }

    }







    const actualHeight = (window.innerHeight)/(window.screen.height) * 100

    return (
        <>
            {isLoading && <LoadingPage />}
            <form id="Form" ref={form} className={`relative bg-white rounded-xl border h-[86vh] xl:h-[90vh] p-3 md:p-4 xl:p-6 opacity-100 overflow-hidden`}>

                <div className="flex md:flex-row flex-col w-full gap-y-3 md:gap-x-4 xl:gap-x-6 h-full">
                    <div className="md:w-3/12 md:min-w-[240px] shrink-0">
                        <ProgressSection status={full} missing={fieldMissing} currentStep={currentStep} />
                    </div>
                    <div className="information-part border h-fit md:h-full px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8 flex-1 rounded-xl md:rounded-l-3xl md:rounded-r-[4em] overflow-hidden">
                        {/* Phase content with smooth transition */}
                        <div className={`h-full flex flex-col justify-between transition-all duration-300 ease-in-out ${
                            slideDirection === 'slide-left' ? 'opacity-0 -translate-x-8' :
                            slideDirection === 'slide-right' ? 'opacity-0 translate-x-8' :
                            slideDirection === 'slide-in-left' ? 'opacity-100 translate-x-0' :
                            slideDirection === 'slide-in-right' ? 'opacity-100 translate-x-0' :
                            'opacity-100 translate-x-0'
                        }`}>
                            {/* Section 1: Personal Information */}
                            {currentStep === 1 && <PersonalInfo />}

                            {/* Section 2: Professional Information */}
                            {currentStep === 2 && <ProfessionalInfo />}

                            {/* Section 3: Preferences (Optional) */}
                            {currentStep === 3 && <Preferences />}

                            {/* Navigation buttons */}
                            <div className="w-full flex justify-between mt-3 shrink-0">
                                {currentStep > 1 ? (
                                    <button onClick={goToPrevStep} className="border rounded-lg w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                ) : <div></div>}

                                {currentStep < 3 ? (
                                    <button onClick={goToNextStep} className="border rounded-lg w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} id="submitForm" className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-sm md:text-base w-fit transition-colors">Submit</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </form>


            <ConfirmMessageDiv confirmMessageRef={confirmationMessageRef} qrCodeSrc={qrCodeSrc} />
        </>
    )
}

export default Form;



const sample = {
    "Full Name": "Hamda Mohammed Saeed Al-Khori",
    "University ID": "22100100",
    "Date Of Birth": "1999-08-21",
    "Gender": "Male",
    "Nationality": "Oman",
    "Email": "u22105176@sharjah.ac.ae",
    "Phone number": "0566558198",
    "CGPA": "2.98",
    "languages": [
        "Arabic",
        "English",
        "Urdu"
    ],
    "Study Program": "Bachelor",
    "College": "College of Sciences",
    "Major": "Physics",
    "LinkedIn URL": "ammarobad.info",
    "Personal Website (if any)": "ammarobad.info",
    "Experience": "ammarobad.info",
    "Skills": "ammarobad.info",
    "CV": {}
}
