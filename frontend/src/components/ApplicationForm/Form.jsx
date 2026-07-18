import axios from "axios";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PersonalInfo, ProfessionalInfo, Preferences, ConfirmMessageDiv } from "./index";

// Was hardcoded to "http://localhost:2001" — meant every deployed build
// (Vercel etc.) tried to submit applications to the developer's own
// machine over plain HTTP, which is both broken (unreachable) and a
// mixed-content/insecure-form-submission red flag on a live HTTPS site.
// Same fallback pattern (and same backend) as useLogin.jsx/useSignUp.jsx/
// TicketLookup.jsx — set VITE_API_URL in the deployment's environment
// variables to override.
const link = import.meta.env.VITE_API_URL || "https://jobfair-1.onrender.com"

import { useAuthContext } from "../../hooks/useAuthContext"
import useFormContext from "../../hooks/useFormContext";

import ProgressSection from "./ProgressSection";

import AnimatedSuccess from "./AnimatedSuccess";
import { useToast } from "../Toast";


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
    fieldInterest: "Field Interest",
    opportunityType: "Opportunity Type",
    preferredWorkCity: "Preferred Work City",
    careerGoals: "Career Goals",
    availability: "Availability",
  };




const Form = () => {

    const { formData, fieldMissing } = useFormContext()
    const toast = useToast();

    const { user } = useAuthContext();
    const confirmationMessageRef = useRef("");

    const [qrCodeSrc, setQRCodeSrc] = useState(null);

    // Drives the AnimatedSuccess overlay: idle → loading → success → fade → done.
    const [submitPhase, setSubmitPhase] = useState("idle");

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

    // The section title + icon are now driven reactively by currentStep in
    // ProgressSection.jsx; here we only drive the progress-bar height.
    const updateProgressBar = (step) => {
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;

        progressBar.classList.remove('md:h-1/3', 'md:h-2/3', 'md:h-full', 'w-1/3', 'w-2/3', 'w-full');

        if (step === 1) {
            progressBar.classList.add('md:h-1/3', 'w-1/3');
        } else if (step === 2) {
            progressBar.classList.add('md:h-2/3', 'w-2/3');
        } else if (step === 3) {
            progressBar.classList.add('md:h-full', 'w-full');
        }
    };





    const handleSubmit = async (e) => {

        try {

            setSubmitPhase("loading")

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
            console.log(formData["University ID"]?.length);
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
                setSubmitPhase("idle") // close the overlay; nothing was submitted

                const missingSummary = (Array.isArray(fieldMissing) ? fieldMissing : (fieldMissing || "").split(", ")).filter(Boolean);
                const summaryText = missingSummary.length > 3
                    ? `${missingSummary.slice(0, 3).join(", ")} and ${missingSummary.length - 3} more`
                    : missingSummary.join(", ");
                toast(summaryText ? `Please complete: ${summaryText}` : "Please complete the required fields", { type: 'warning' });

                setTimeout(() =>{setFull(true)}, 3000)

                return;
            }


            // Play the success sequence: dots → graduation cap ("success"),
            // hold, then fade the overlay out as the ticket is revealed.
            setSubmitPhase("success");
            setTimeout(() => {
                confirmRegistration();      // reveal the ticket beneath the overlay
                setSubmitPhase("fade");     // fade the overlay away to show it
                setTimeout(() => setSubmitPhase("done"), 550);
            }, 1300);



        } catch (error) {
            console.error(error);
            setSubmitPhase("idle");
            toast('Something went wrong submitting your application. Please try again.', { type: 'error' });
        }
        finally{
            console.log('We are done');
        }






        // } catch(error){
            // console.log({error: error.message});
        // }

    }

    const confirmRegistration = () => {
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







    return (
        <>
            <AnimatedSuccess phase={submitPhase} />
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
                                    <button onClick={goToPrevStep} className="border rounded-md w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                ) : <div></div>}

                                {currentStep < 3 ? (
                                    <button onClick={goToNextStep} className="border rounded-md w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} id="submitForm" className="bg-[#0E7F41] hover:bg-[#0a5f31] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-md text-sm md:text-base w-fit transition-colors">Submit</button>
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
