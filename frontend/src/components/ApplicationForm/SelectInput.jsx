import useFormContext from "../../Hooks/useFormContext"
import { RequiredAstrik } from "./index";
import { useRef, useContext } from "react";


const SelectInput = ({ label, value, options, fieldClasses, selectClasses, handleChange }) => {
    const refSelect = useRef();

    const {formData, updateFormData} = useFormContext();
    // const getOption = () => {
    //     updateFormData(label, refSelect.current.value);
    // }

    const func = (e) => {
        if(handleChange){handleChange(refSelect.current?.value)}
        updateFormData(label, refSelect.current?.value)
    }

    return (
        <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses}`}>
            <h2 className="text-xs md:text-base xl:text-lg mb-2">{label}: <RequiredAstrik required={true} /></h2>
            <select onChange={func} ref={refSelect} className={`bg-transparent border min-h-10 border-gray-700 rounded-lg py-1.5 px-2 ${selectClasses}`} name={label} value={value} id={label}>
            <option defaultChecked>Select a {label == "Study Program" ? "Program" : label}</option>
                {
                    options.map((option, i)=>{
                        return (
                            <option key={i} className="my-2" value={option}>{option}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

export default SelectInput;