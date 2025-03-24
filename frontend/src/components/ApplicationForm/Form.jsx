import axios from "axios";

import { useRef, createContext, useState, useContext } from "react";
import { PersonalInfo, ProfessionalInfo, SubmitFormBtn, ConfirmMessageDiv } from "./index";

const link = "https://jobfair-1.onrender.com"

import { useAuthContext } from "../../Hooks/useAuthContext"
import useFormContext from "../../Hooks/useFormContext";

import { FormContext } from "../../Context/FormContext";
import ProgressSection from "./ProgressSection";

import PersonalIcon from '../../assets/images/personal.svg'
import { useProgressContext } from "../../Context/ProgressContext";
import LoadingPage from "../../pages/LoadingPage";



const Form = () => {
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
        document.querySelector('.progress-bar').classList.replace('md:h-1/2', 'md:h-0')
        document.querySelector('.progress-bar').classList.replace('w-1/2', 'w-0')

    }


    const FormProvider = ( {children} ) => {

        const { user } = useAuthContext()

        const [formData, setFormData] = useState({});
        const updateFormData = (inputName, value) => {
            setFormData((prevData) => ( {...prevData, [inputName]: value} ) )
        }

        const handleSubmit = async (e) => {

            try {

                setIsLoading(true)

                e.preventDefault()
                const formDataToSend = new FormData();
                console.log(formData);


                formDataToSend.append("uniId", formData["University ID"]);
                formDataToSend.append("fullName", formData["Full Name"]);
                formDataToSend.append("birthdate", formData["Date Of Birth"]);
                formDataToSend.append("gender", formData["Gender"]);
                formDataToSend.append("nationality", formData["Nationality"]);
                formDataToSend.append("studyLevel", formData["Study Program"]);
                formDataToSend.append("college", formData["College"]);
                formDataToSend.append("major", formData["Major"]);
                formDataToSend.append("email", formData["Email"]);
                formDataToSend.append("phoneNumber", formData["Phone number"]);
                formDataToSend.append("cgpa", formData["CGPA"]);
                formDataToSend.append("linkedIn", formData["LinkedIn URL"]);
                formDataToSend.append("skills", formData["Skills"]);
                formDataToSend.append("experience", formData["Experience"]);
                formDataToSend.append("cvfile", formData["CV"]);
                formDataToSend.append("portfolio", formData["Portfolio"]);
                //REVIEW IT LATER TO INLCUDE LANGUAGES LIST. REVIEW IT LATER TO INLCUDE LANGUAGES LIST.
                formDataToSend.append("languages", formData["languages"]);
                //REVIEW IT LATER TO INLCUDE LANGUAGES LIST. REVIEW IT LATER TO INLCUDE LANGUAGES LIST.


                // document.querySelectorAll("input").forEach((element) => {element.value =""})
                // try{
                if(Object.values(formData).length >= 15){
                        // setFormDataReq(formDataToSend);
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
            form.current.classList.replace("md:p-10", "p-0");
            form.current.classList.replace("p-6", "p-0");
            form.current.classList.replace("md:h-[90vh]", "md:h-0");
            form.current.classList.replace("h-[100%]", "h-0");
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
            document.querySelector(".confirmMessageRef").classList.replace("h-0", "h-[90vh]");
            document.querySelector(".confirmMessageRef").classList.add("md:h-fit");
            document.querySelector(".confirmMessageRef").classList.replace("md:p-0", "md:p-10");
            document.querySelector(".confirmMessageRef").classList.replace("p-0", "md:p-5");


            // const confirmationResponse = await axios.post("http://localhost:2000/applicants/qr", formDataReq);
            // setQRCodeSrc(confirmationResponse.data);
            // console.log(confirmationResponse);
            // if(!confirmationResponse){
            //     console.log("QR code has not been generated");
            // }
    
        }


        return (
            <FormContext.Provider value={{formData, updateFormData}}>

                    <div className="flex flex-col w-full h-fit">
                        {children}
                        {
                            <div className="w-full flex justify-between">
                                <button onClick={scrollToPrevSection} className="border rounded-xl w-12 h-12">{'<'}</button>
                                <button onClick={handleSubmit} id="submitForm" className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-xl w-fit">Submit</button>
                            </div>
                        }

                    </div>


            </FormContext.Provider>
        )
    }

    const actualHeight = (window.innerHeight)/(window.screen.height) * 100

    return (
        <>
            <form id="Form" ref={form} className={`relative bg-white rounded-xl border h-[100%] md:h-[90vh] p-6 md:p-10 opacity-100 overflow-hidden`}>

            {
                isLoading && <LoadingPage />
            }
                <div className="flex md:flex-row flex-col md:w-fit w-full gap-y-6 md:gap-x-12 h-full">
                    <ProgressSection status={full} />
                    <div className="information-part border h-fit md:h-full px-6 py-8 md:px-12 md:py-10 md:w-9/12 rounded-xl md:rounded-l-3xl md:rounded-r-[4em] overflow-y-scroll">
                        <FormProvider>
                            <PersonalInfo />
                            <ProfessionalInfo />
                        </FormProvider>
                    </div>

                </div>


              
            </form>


            <ConfirmMessageDiv confirmMessageRef={confirmationMessageRef} qrCodeSrc={qrCodeSrc} />
        </>
    )
}

export default Form;


let a = {
    "University ID": "u20946548",
    "Full Name": "Ali Hasbuallah Hasan",
    "Date Of Birth": "1985-08-21",
    "Gender": "Male",
    "Nationality": "Afghanistan",
    "Email": "ali@email.com",
    "Phone number": "0510588494",
    "CGPA": "3.89",
    "languages": [
        "Arabic",
        "English",
        "Other"
    ],
    "Others, if any": "Urdu",
    "Study Program": "Master",
    "College": "College of Health Sciences",
    "Major": "Public Health",
    "LinkedIn URL": "https://linkedin/in/ali",
    "Personal Website (if any)": "www.ali.info",
    "Experience": "smiling studying & laughing. smiling studying & laughing. smiling studying & laughing. ",
    "Skills": "smiling studying & laughing. ",
    "CV": {}
}