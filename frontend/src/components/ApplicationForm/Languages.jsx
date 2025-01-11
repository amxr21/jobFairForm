import { Input, Language } from "./index";
import { useRef, useContext } from "react";
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.

import { FormContext } from "../../Context/FormContext";

const Languages = ({ classes }) => {
    const { formData } = useContext(FormContext)


    return (
        <div className={`flex flex-col grow min-h-28 mb-4 md:my-0 ${classes}`}>
            <h2 className="text-md md:text-lg mb-2">Languages:-</h2>
            <div className="flex flex-col md:flex-row md:h-16">
                <div id="Languages" className="checkboxes grid grid-cols-2 grid-rows-2 gap-2 md:gap-0  justify-between mb-2 w-full h-fit">
                    <Language lang={"Arabic"} />
                    <Language lang={"English"} />
                    <Language lang={"Chinese"} />
                    <Language lang={"Other"} />
                </div>
                {
                    formData['languages']?.includes('Other') && <Input headerClasses="mb-0" fieldClasses="col-span-7 gap-0 min-w-64" label={"Others, if any"} />
                }

            </div>
            
        </div>
    )
}


export default Languages;