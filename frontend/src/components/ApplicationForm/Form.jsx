import axios from "axios";

import { useRef, createContext, useState, useContext } from "react";
import { PersonalInfo, ProfessionalInfo, SubmitFormBtn, ConfirmMessageDiv } from "./index";

// const link = "https://jobfairform-backend.onrender.com"
const link = "https://jobfairform-backend-production.up.railway.app"
// const link = "http://localhost:2001"

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

    const scrollToPrevSection = (e) => {
        e.preventDefault();
        e.target.parentElement.parentElement.parentElement.scrollBy({top: -window.innerHeight});
        
        // console.log(e.target.parentElement.parentElement.parentElement);

        document.querySelector('.section-header').textContent = 'Personal Information'
        document.querySelector('.section-icon').src = PersonalIcon

        // updateProgress(0)
        document.querySelector('.progress-bar').classList.replace('md:h-full', 'md:h-1/2')
        document.querySelector('.progress-bar').classList.replace('w-full', 'w-1/2')

    }





    const handleSubmit = async (e) => {

        try {

            setIsLoading(true)

            e.preventDefault()
            const formDataToSend = new FormData();
            console.log(formData);

            for (const [apiKey, formKey] of Object.entries(keyMap)) {
                formDataToSend.append(apiKey, formData[formKey]);
              }
            
              

              const isFieldFilled = (value) => {
                if (typeof value === "string") return value.trim() !== "";
                if (Array.isArray(value)) return value.length > 0;
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

            if (filledFields.length >= 15 ) {
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
            <form id="Form" ref={form} className={`relative bg-white rounded-xl border h-[86vh] xl:h-[90vh] p-5 md:p-6 xl:p-8 opacity-100 overflow-hidden`}>

                <div className="flex md:flex-row flex-col md:w-fit w-full gap-y-4 md:gap-x-6 xl:gap-x-8 h-full">
                    <ProgressSection status={full} missing={fieldMissing} />
                    <div className="information-part border h-fit md:h-full px-6 py-6 md:px-9 md:py-9 xl:px-12 xl:py-10 md:w-9/12 rounded-xl md:rounded-l-3xl md:rounded-r-[4em] overflow-hidden lg:overflow-y-hidden">
                        <PersonalInfo />
                        <div className="h-full flex flex-col justify-between z-[999]">
                            <ProfessionalInfo />
                            <div className="w-full flex justify-between">
                                <button onClick={scrollToPrevSection} className="border rounded-xl min-w-12 min-h-12">{'<'}</button>
                                <button onClick={handleSubmit} id="submitForm" className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-xl w-fit">Submit</button>
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