import axios from "axios";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import { PersonalInfo, ProfessionalInfo, Preferences, ConfirmMessageDiv } from "./index";

import { API_URL as link } from "../../config/api";

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
// Grouped by the step that collects them so Continue can validate just that
// step. REQUIRED_FIELDS stays derived from these rather than being a second
// list that can drift out of sync with them.
const REQUIRED_BY_STEP = {
    1: [
        "Full Name",
        "University ID",
        "Date of Birth",
        "Gender",
        "City",
        "Nationality",
        "Email address",
        "Mobile number",
        "languages",
    ],
    2: [
        "College",
        "Major",
        "Study Program",
        "Technical Skills",
        "Non-technical skills",
        "Experience",
    ],
    3: [],
};

const REQUIRED_FIELDS = Object.values(REQUIRED_BY_STEP).flat();

const isFieldFilled = (value) => {
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof File) return value.size > 0;
    if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
    return value !== null && value !== undefined;
};

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

    const { formData, setFieldMissing } = useFormContext()
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

    // Validate the current step before advancing. Previously nothing was
    // checked until the final submit, so a user could fill three steps and
    // only then be told — via a toast listing at most three problems — that
    // something on step 1 was missing, with no per-field indication of what.
    const goToNextStep = (e) => {
        e.preventDefault();

        const missing = (REQUIRED_BY_STEP[currentStep] || [])
            .filter((key) => !isFieldFilled(formData[key]));

        if (missing.length > 0) {
            // "Full Name" is collected as two fields; name them as the user
            // sees them rather than by the formData key.
            const labels = missing.flatMap((key) =>
                key === "Full Name" ? ["First Name", "Last Name"]
                    : key === "languages" ? ["Languages"]
                    : [key]
            );
            const summary = labels.length > 3
                ? `${labels.slice(0, 3).join(", ")} and ${labels.length - 3} more`
                : labels.join(", ");
            toast(`Please complete: ${summary}`, { type: 'warning' });
            // Push into the same channel Input/SelectInput already read, so
            // each offending field shows its own inline error rather than the
            // user having to map a toast back onto the form.
            setFieldMissing(labels.map((l) => `${l} is required`).join(", "));

            // Inline field errors only render once a field is `touched`, which
            // by definition an untouched missing field is not — so scroll the
            // user to the first offender rather than leaving them to map the
            // toast back onto the form themselves.
            const firstLabel = labels[0];
            window.setTimeout(() => {
                const el = document.querySelector(
                    `[name="${CSS.escape(firstLabel)}"], #${CSS.escape(firstLabel)}`
                );
                const target = el?.closest("div") || el;
                target?.scrollIntoView({ block: "center", behavior: "smooth" });
                if (el && typeof el.focus === "function" && el.type !== "hidden") {
                    el.focus({ preventScroll: true });
                }
            }, 0);
            return;
        }

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
        // The form is h-full now (its wrapper owns the 100dvh), so collapsing
        // it means replacing that single class rather than the old
        // h-[86dvh] / xl:h-[90dvh] pair.
        form.current.classList.replace("h-full", "h-0");
        // These three targeted p-5 / md:p-6 / xl:p-8, which this element has
        // never carried — its padding is p-3 / md:p-4 / xl:p-6, so all three
        // calls were silent no-ops and the form kept its padding while
        // collapsing. Matching the real classes.
        form.current.classList.replace("p-3", "p-0");
        form.current.classList.replace("md:p-4", "md:p-0");
        form.current.classList.replace("xl:p-6", "xl:p-0");
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
        const confirmEl = document.querySelector(".confirmMessageRef");
        confirmEl.classList.replace("opacity-0", "opacity-100");
        // Matches the form's own full-height treatment now that the wrapper
        // owns the 100dvh.
        confirmEl.classList.replace("h-0", "h-full");
        confirmEl.classList.add("md:h-fit");
        // ConfirmMessage.jsx renders `p-0` but no `md:p-0`, so the md:
        // replace below never matched anything; add the class instead.
        confirmEl.classList.add("md:p-8");
        confirmEl.classList.replace("p-0", "p-5");


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
                className={`relative bg-surface-card border-line rounded-xl border h-full p-3 md:p-4 xl:p-6 opacity-100 overflow-hidden`}
            >

                {/* min-h-0 on both the column and its flex children: a flex
                    item's default min-height is auto, so it refuses to shrink
                    below its content and the nested scroll region never
                    engages. This is what lets the step's own overflow-y-auto
                    do the scrolling on mobile. */}
                <div className="flex md:flex-row flex-col w-full gap-y-3 md:gap-x-4 xl:gap-x-6 h-full min-h-0">
                    <div className="md:w-3/12 md:min-w-[240px] shrink-0">
                        <ProgressSection currentStep={currentStep} />
                    </div>
                    {/* min-h-0 + h-full (not h-fit) on mobile: the child
                        .step-pane is h-full, and h-full inside an h-fit parent
                        is circular — the pane grew to its content height,
                        overflowed the form’s height, and this element’s
                        overflow-hidden then clipped the Continue/Submit row
                        off the bottom of the screen. Bounding the height here
                        lets the scroll region inside the step absorb the
                        overflow instead, keeping the nav row visible. */}
                    <div className="information-part border-line border h-full min-h-0 px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8 flex-1 rounded-xl md:rounded-l-3xl md:rounded-r-[4em] overflow-hidden">
                        {/* Step swap: exit accelerates away (ease-in), enter
                            decelerates in (ease-out) — mirrored curves rather
                            than a flat ease-in-out. Only transform + opacity move,
                            so it stays on the compositor. */}
                        <div className={`step-pane h-full min-h-0 flex flex-col will-change-transform ${
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

                            {/* Navigation buttons. Pinned to the bottom of the
                                step pane on mobile with a safe-area inset, so
                                Continue/Submit stay reachable on notched
                                devices instead of trailing a long scroll. */}
                            <div
                                className="w-full flex items-center justify-between gap-3 mt-3 shrink-0 border-t border-line pt-3 md:border-0 md:pt-0 bg-surface-card"
                                style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
                            >
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={goToPrevStep}
                                        disabled={isSubmitting}
                                        className="group inline-flex items-center gap-1.5 border-line border rounded-lg h-11 md:h-10 px-4 md:px-4 text-sm md:text-base text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-0.5" />
                                        Back
                                    </button>
                                ) : <div />}

                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={goToNextStep}
                                        className="group inline-flex items-center gap-1.5 bg-[#0E7F41] hover:bg-[#0a5f31] text-white h-11 md:h-10 px-5 md:px-6 rounded-lg text-sm md:text-base font-medium shadow-sm hover:shadow transition-all"
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
                                        className="inline-flex items-center justify-center gap-2 bg-[#0E7F41] hover:bg-[#0a5f31] text-white h-11 md:h-10 px-6 md:px-7 rounded-lg text-sm md:text-base font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
