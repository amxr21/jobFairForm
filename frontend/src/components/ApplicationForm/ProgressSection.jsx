import PropTypes from "prop-types";
import GridLeft from "../IntroPage/GridLeft";
import Progress from "./Progress";
import { User, GraduationCap, Sparkles } from "lucide-react";

// Each wizard step gets its own icon + title in the side panel, so the panel
// reflects which stage the applicant is on rather than always showing the
// "Personal Information" identity.
const STEP_META = {
    1: { Icon: User, title: "Personal Information" },
    2: { Icon: GraduationCap, title: "Professional Information" },
    3: { Icon: Sparkles, title: "Preferences (Optional)" },
};

const ProgressSection = ({ currentStep }) => {

    const { Icon, title } = STEP_META[currentStep] || STEP_META[1];

    return (
        <div className="relative flex flex-col gap-4 md:gap-8 w-full border py-6 px-8 md:py-10 md:px-12 min-h-[10rem] md:min-h-[28rem] h-fit md:h-full bg-[#0E7F41] rounded-t-[2.75em] rounded-b-2xl md:rounded-l-[4em] md:rounded-r-3xl overflow-hidden">


            <GridLeft mark={false} otherClasses={'left-14 -top-20 left-[0%] md:left-0 md:top-14 h-full min-h-96 md:h-fit md:w-fit opacity-60 rotate-90 md:rotate-0'} />

            <div className="flex md:flex-col justify-between w-full ">
                <div className="text-white flex items-center justify-center icon min-w-14 md:min-w-16 md:w-16 min-h-14 md:min-h-16 md:h-16 border border-white rounded-2xl mb-4">
                    <Icon key={currentStep} className="section-icon w-7 h-7 md:w-8 md:h-8 animate-in fade-in zoom-in-75 duration-300" strokeWidth={1.5} />
                </div>
                <h1 className="section-header font-semibold text-white text-xl md:text-3xl w-40 md:w-fit">
                    {title}
                </h1>
            </div>

            {currentStep === 3 && (
                <p className="text-white/80 text-xs md:text-sm">
                    These fields are optional but help us match you with the right opportunities.
                </p>
            )}

            <Progress />

        </div>
    )
}

ProgressSection.propTypes = {
    currentStep: PropTypes.number,
};

export default ProgressSection;
