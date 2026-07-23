import axios from "axios";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
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


// The fields an application genuinely cannot be submitted without. Previously
// the submit gate just counted how many values in formData were non-empty
// (`filledFields.length >= 16`), which was wrong in both directions: filling
// enough *optional* fields let an incomplete application through, and a
// complete application could be rejected because the count happened to land
// under the threshold. Gate on these specific keys instead.
const REQUIRED_FIELDS = [
    "Full Name",
    "University ID",
    "Date of Birth",
    "Gender",
    "City",
    "Nationality",
    "Email address",
    "Mobile number",
    "College",
    "Major",
    "Study Program",
    "languages",
    "Technical Skills",
    "Non-technical skills",
    "Experience",
];

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

    const { formData } = useFormContext()
    const toast = useToast();

    const { user } = useAuthContext();
    const confirmationMessageRef = useRef("");

    const [qrCodeSrc, setQRCodeSrc] = useState(null);

    // Drives the AnimatedSuccess overlay: idle → loading → success → fade → done.
    const [submitPhase, setSubmitPhase] = useState("idle");

    // The submit button shows a spinner and locks navigation while a request
    // is in flight or the success sequence is playing.
    const isSubmitting = submitPhase !== "idle";

    const form = useRef();
    const [currentStep, setCurrentStep] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');

    // Animate out, swap step, animate in. Used by Back/Continue and by the
    // stepper in ProgressSection (jumping back to an earlier step).
    const goToStep = (step) => {
        if (step === currentStep || step < 1 || step > 3 || isTransitioning) return;
        const forward = step > currentStep;
        setSlideDirection(forward ? 'slide-left' : 'slide-right');
        setIsTransitioning(true);
        // Exit (180ms, ease-in) then swap content and play the enter
        // (260ms, ease-out) — durations mirror the .step-exit/.step-enter
        // easings in style.css.
        setTimeout(() => {
            setCurrentStep(step);
            setSlideDirection(forward ? 'slide-in-right' : 'slide-in-left');
            setTimeout(() => {
                setIsTransitioning(false);
                setSlideDirection('');
            }, 260);
        }, 180);
    };

    const goToNextStep = (e) => {
        e.preventDefault();
        goToStep(currentStep + 1);
    };

    const goToPrevStep = (e) => {
        e.preventDefault();
        goToStep(currentStep - 1);
    };





    const handleSubmit = async (e) => {
        e.preventDefault();

        // Guard against a double submit (double-click, or Enter landing on the
        // button while a request is already in flight) creating two applicants.
        if (submitPhase !== "idle") return;

        const isFieldFilled = (value) => {
            if (typeof value === "string") return value.trim() !== "";
            if (Array.isArray(value)) return value.length > 0;
            if (value instanceof File) return value.size > 0;
            if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
            return value !== null && value !== undefined;
        };

        // Validate before showing the overlay, so a failed check never flashes
        // a loading state.
        const uniId = String(formData["University ID"] ?? "").trim();
        const missingRequired = REQUIRED_FIELDS.filter((key) => !isFieldFilled(formData[key]));
        const isUniIdValid = /^\d{8}$/.test(uniId);

        if (missingRequired.length > 0 || !isUniIdValid) {
            const summary = [
                ...missingRequired,
                ...(!isUniIdValid && isFieldFilled(formData["University ID"])
                    ? ["University ID must be exactly 8 digits"]
                    : []),
            ];
            const summaryText = summary.length > 3
                ? `${summary.slice(0, 3).join(", ")} and ${summary.length - 3} more`
                : summary.join(", ");
            toast(summaryText ? `Please complete: ${summaryText}` : "Please complete the required fields", { type: 'warning' });
            return;
        }

        try {

            setSubmitPhase("loading")

            const formDataToSend = new FormData();

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



            const confirmationResponse = await axios.post(
                `${link}/applicants`,
                formDataToSend,
                {
                    // A cold-starting free-tier backend can take well over the
                    // default (no) timeout to answer; cap the wait so the user
                    // gets an actionable error instead of an overlay that
                    // spins forever.
                    timeout: 60000,
                    ...(user?.token
                        ? { headers: { Authorization: `Bearer ${user.token}` } }
                        : {}),
                }
            );

            // The ticket QR is keyed off the created applicant's id. If the
            // backend answered but not in the shape we expect, treat it as a
            // failure rather than silently rendering a ticket with no QR.
            const applicantId = confirmationResponse?.data?.applicantProfile?._id;
            if (!applicantId) {
                throw new Error("Submission succeeded but no ticket was returned.");
            }
            setQRCodeSrc(applicantId);

            // Play the success sequence: dots → graduation cap ("success"),
            // hold, then fade the overlay out as the ticket is revealed.
            setSubmitPhase("success");
            setTimeout(() => {
                confirmRegistration();      // reveal the ticket beneath the overlay
                setSubmitPhase("fade");     // fade the overlay away to show it
                setTimeout(() => setSubmitPhase("done"), 550);
            }, 1300);

        } catch (error) {
            setSubmitPhase("idle");

            // Distinguish the failure modes so the user knows whether to retry
            // now, fix their input, or come back later — "something went wrong"
            // for an unreachable backend just reads as the form being broken.
            let message = "Something went wrong submitting your application. Please try again.";
            if (error?.code === "ECONNABORTED") {
                message = "The server took too long to respond. Please try submitting again.";
            } else if (error?.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.error || error.response.data?.message;
                if (status === 413) {
                    message = "Your CV is too large. Please upload a file under 4MB.";
                } else if (status === 400) {
                    message = serverMessage || "Some of your details were rejected. Please review the form and try again.";
                } else if (status >= 500) {
                    message = "The server had a problem saving your application. Please try again in a moment.";
                } else if (serverMessage) {
                    message = serverMessage;
                }
            } else if (error?.request) {
                message = "Couldn't reach the server. Check your connection and try again.";
            }

            toast(message, { type: 'error' });
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
            <form
                id="Form"
                ref={form}
                onSubmit={(e) => {
                    // Enter anywhere in the form should advance the wizard, not
                    // trip the first button in the DOM. Only the last step submits.
                    e.preventDefault();
                    if (currentStep < 3) goToNextStep(e);
                    else handleSubmit(e);
                }}
                className={`relative bg-surface-card border-line rounded-xl border h-[86vh] xl:h-[90vh] p-3 md:p-4 xl:p-6 opacity-100 overflow-hidden`}
            >

                <div className="flex md:flex-row flex-col w-full gap-y-3 md:gap-x-4 xl:gap-x-6 h-full">
                    <div className="md:w-3/12 md:min-w-[240px] shrink-0">
                        <ProgressSection currentStep={currentStep} />
                    </div>
                    <div className="information-part border-line border h-fit md:h-full px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8 flex-1 rounded-xl md:rounded-l-3xl md:rounded-r-[4em] overflow-hidden">
                        {/* Step swap: exit accelerates away (ease-in), enter
                            decelerates in (ease-out) — mirrored curves rather
                            than a flat ease-in-out. Only transform + opacity move,
                            so it stays on the compositor. */}
                        <div className={`step-pane h-full flex flex-col justify-between will-change-transform ${
                            slideDirection === 'slide-left' ? 'step-exit opacity-0 -translate-x-6' :
                            slideDirection === 'slide-right' ? 'step-exit opacity-0 translate-x-6' :
                            slideDirection === 'slide-in-left' ? 'step-enter opacity-100 translate-x-0' :
                            slideDirection === 'slide-in-right' ? 'step-enter opacity-100 translate-x-0' :
                            'opacity-100 translate-x-0'
                        }`}>
                            {/* Section 1: Personal Information */}
                            {currentStep === 1 && <PersonalInfo />}

                            {/* Section 2: Professional Information */}
                            {currentStep === 2 && <ProfessionalInfo />}

                            {/* Section 3: Preferences (Optional) */}
                            {currentStep === 3 && <Preferences />}

                            {/* Navigation buttons */}
                            <div className="w-full flex items-center justify-between gap-3 mt-3 shrink-0">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={goToPrevStep}
                                        disabled={isSubmitting}
                                        className="group inline-flex items-center gap-1.5 border-line border rounded-lg h-9 md:h-10 px-3 md:px-4 text-sm md:text-base text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-0.5" />
                                        Back
                                    </button>
                                ) : <div />}

                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={goToNextStep}
                                        className="group inline-flex items-center gap-1.5 bg-[#0E7F41] hover:bg-[#0a5f31] text-white h-9 md:h-10 px-5 md:px-6 rounded-lg text-sm md:text-base font-medium shadow-sm hover:shadow transition-all"
                                    >
                                        Continue
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        id="submitForm"
                                        className="inline-flex items-center justify-center gap-2 bg-[#0E7F41] hover:bg-[#0a5f31] text-white h-9 md:h-10 px-6 md:px-7 rounded-lg text-sm md:text-base font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                Submit application
                                                <Check className="w-4 h-4 md:w-5 md:h-5" />
                                            </>
                                        )}
                                    </button>
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
