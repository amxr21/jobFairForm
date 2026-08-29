import PropTypes from "prop-types";
import GridLeft from "../IntroPage/GridLeft";
import Progress from "./Progress";
import { User, GraduationCap, Sparkles } from "lucide-react";

// Each wizard step gets its own icon + title in the side panel, so the panel
// reflects which stage the applicant is on rather than always showing the
// "Personal Information" identity.
const STEPS = [
    { Icon: User, title: "Personal Information", short: "Personal" },
    { Icon: GraduationCap, title: "Professional Information", short: "Professional" },
    { Icon: Sparkles, title: "Preferences (Optional)", short: "Preferences" },
];

// On mobile the panel collapses to a compact ~56px bar. It previously ran
// min-h-[10rem] with py-6 px-8, eating over a third of the usable height on a
// small phone once the keyboard was up — for what is ultimately a progress
// indicator. Desktop keeps the full illustrated side panel.
const ProgressSection = ({ currentStep }) => {

    const { Icon, title } = STEPS[currentStep - 1] || STEPS[0];

    return (
        <div className="relative flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-8 w-full border py-2.5 px-4 md:py-10 md:px-12 min-h-0 md:min-h-[28rem] h-fit md:h-full bg-[#0E7F41] rounded-2xl md:rounded-s-[4em] md:rounded-e-3xl overflow-hidden">

            {/* Decorative only — it costs real layout space on a small screen,
                so it is dropped below md rather than scaled down. */}
            <div className="hidden md:block">
                <GridLeft mark={false} otherClasses={'start-14 -top-20 start-[0%] md:start-0 md:top-14 h-full min-h-96 md:h-fit md:w-fit opacity-60 rotate-90 md:rotate-0'} />
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-0 flex-1 min-w-0">
                <div className="text-white flex items-center justify-center icon w-9 h-9 min-w-9 md:min-w-16 md:w-16 md:h-16 border border-white rounded-xl md:rounded-2xl shrink-0 md:mb-4">
                    <Icon key={currentStep} className="section-icon w-5 h-5 md:w-8 md:h-8 animate-in fade-in zoom-in-75 duration-300" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-white/70 text-[10px] md:text-xs font-medium tracking-wide uppercase md:mb-1">
                        Step {currentStep} of {STEPS.length}
                    </span>
                    <h1 className="section-header font-semibold text-white text-sm md:text-3xl truncate md:whitespace-normal md:w-fit">
                        {title}
                    </h1>
                </div>
            </div>

            {currentStep === 3 && (
                <p className="hidden md:block text-white/80 text-xs md:text-sm">
                    These fields are optional but help us match you with the right opportunities.
                </p>
            )}

            <div className="w-16 md:w-auto shrink-0 md:flex-1 md:min-h-0">
                <Progress currentStep={currentStep} totalSteps={STEPS.length} />
            </div>

        </div>
    )
}

ProgressSection.propTypes = {
    currentStep: PropTypes.number,
};

export default ProgressSection;
