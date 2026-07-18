import PropTypes from "prop-types";
import useFormContext from "../../hooks/useFormContext";
import { useRef } from "react";
import { Input, RequiredAstrik } from "./index";


const Experiences = ({label, classes}) => {
    const message = useRef();

    const { updateFormData } = useFormContext();
    const getOption = () => {
        updateFormData(label, message.current.value);
    }


    return (
        <div className={`flex flex-col ${classes}`}>
            <Input type={'date'} fieldClasses="shrink-0" label="Expected to Graduate"/>
            <div id="TechnicalSkills" className="flex flex-col flex-1 min-h-0">
                <label className="text-sm md:text-base mb-0.5 md:mb-1.5 shrink-0" htmlFor="TechnicalSkills">{label}: <RequiredAstrik required={true} /></label>
                <textarea
                    placeholder="Include skills such as C++, Python - no need for explanations or ratings"
                    onChange={getOption}
                    ref={message}
                    name="TechnicalSkills"
                    id="TechnicalSkills"
                    className="flex-1 w-full bg-surface-field border border-line-strong rounded-lg py-1.5 px-2 resize-none overflow-auto min-h-0"
                ></textarea>
            </div>
        </div>
    )
}


Experiences.propTypes = {
    label: PropTypes.string,
    classes: PropTypes.string,
};

export default Experiences;
