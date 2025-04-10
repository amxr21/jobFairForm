import { Input, Language, RequiredAstrik } from "./index";
import { useRef, useContext } from "react";
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.
//REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST. REVIEW IT LATER TO CHECK IT INCLUDES LANGUAGES LIST.

import { FormContext } from "../../Context/FormContext";

const Languages = ({ classes }) => {
    const { formData } = useContext(FormContext)


    return (
        <div className={`flex flex-col grow min-h-28 mb-4 md:my-0 ${classes}`}>
            <h2 className="text-md md:text-lg mb-2">Languages:- <RequiredAstrik required={true} /></h2>
            <div className="flex flex-col md:flex-row md:h-16">
                <div id="Languages" className="checkboxes grid grid-cols-2 grid-rows-2 gap-2 md:gap-2  justify-between mb-2 w-full md:w-1/2 h-fit">
                    <Language lang={"Arabic"} />
                    <Language lang={"English"} />
                    <Language lang={"Chinese"} />
                    <Language lang={"Other"} />
                </div>
                {
                    document.getElementById("Other")?.checked &&
                    <Input headerClasses="mb-0" fieldClasses="otherlangs-field col-span-8 gap-0 w-full md:min-w-72" label={"Others, if any"} />
                }
                {/* {
                    formData['languages']?.includes('Other') && <Input headerClasses="mb-0" fieldClasses="col-span-7 gap-0 min-w-64" label={"Others, if any"} />
                } */}

            </div>
            
        </div>
    )
}


export default Languages;