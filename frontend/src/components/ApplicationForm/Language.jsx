import useFormContext from "../../Hooks/useFormContext";
import { useRef, useContext } from "react";


const Language = ({lang}) => {
    const refLabel = useRef();

    const { formData, updateFormData } = useFormContext();
    const getLang = () => {
        // console.log([...document.getElementById("Languages").childNodes]);
        updateFormData("languages", [...document.getElementById("Languages").childNodes].filter((checkbx)=> checkbx.firstChild.checked).map((html) => html.textContent
    ));

    }



    return (
        <div className="checkbox h-5 flex items-center md:mr-14">
            <input  ref={refLabel} onChange={getLang} type="checkbox" name={lang} id={lang} className="md:min-w-2 lg:min-w-3 xl:min-w-4  xl:min-h-4 mr-2 z-50 accent-primary"/>
            <label htmlFor={lang} className="text-xs md:text-base xl:text-lg">{lang}</label>
        </div>
    )
}

export default Language;