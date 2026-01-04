import useFormContext from "../../Hooks/useFormContext"
import { RequiredAstrik } from "./index";
import { useRef, useContext } from "react";


const SelectInput = ({ label, value, options, fieldClasses, selectClasses, handleChange, required = true, placeholder }) => {
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
        <div className={`flex flex-col ${fieldClasses}`}>
            <h2 className="text-xs md:text-sm mb-1">{label}: {required && <RequiredAstrik required={true} />}</h2>
            <select onChange={func} ref={refSelect} className={`h-8 md:h-9 w-full bg-transparent border border-gray-700 rounded-lg py-1 px-2 text-xs md:text-sm ${selectClasses}`} name={label} value={value} id={label}>
            <option defaultChecked value="">{placeholder || `Select ${label === "Study Program" ? "Program" : label}`}</option>
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