import useFormContext from "../../Hooks/useFormContext";
import { useRef, useContext } from "react";
import { Input } from "./index";

const Experiences = ({label, classes}) => {
    const message = useRef();

    const {formData, updateFormData} = useFormContext();
    const getOption = () => {
        updateFormData(label, message.current.value);
    }


    return (
        <div className={`flex flex-col ${classes}`}>
            <Input type={'date'} fieldClasses="col-span-2" label="Expected to Graduate"/>
            <div id="TechnicalSkills" className={`flex flex-col grow ga-y-2 justify-between mb-4 md:my-0`}>
                {/* <h2 className="text-lg mb-2">A message to the employer:-</h2> */}
                <label className="text-md md:text-lg mb-2" htmlFor="TechnicalSkills">{label}:</label>
                <textarea placeholder="Include skills such as C++, Python" onChange={getOption} ref={message} name="TechnicalSkills" id="TechnicalSkills" className="flex grow bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 h-36 md:h-fit" ></textarea>
            </div>
        </div>
    )
}


export default Experiences;