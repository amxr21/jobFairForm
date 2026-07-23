import { useState, useRef, useContext, useEffect } from "react"
import PropTypes from "prop-types";

import { IdContext } from "../../context/IdContext"

import axios from "axios";

// Was hardcoded, so this component ignored VITE_API_URL and always hit the
// production backend even in local dev. Same fallback pattern as Form.jsx.
const link = import.meta.env.VITE_API_URL || "https://jobfair-1.onrender.com";

const CheckId = ({value}) => {
    const checkIdDiv = useRef();

    const { inputValue, setInputValue } = useContext(IdContext);
    
    const [ inputId, setInputId ] = useState("");
    const [ error, setError ] = useState(false);


    const getA = async () => {
        if(value){
            checkIdDiv.current.classList.replace("mt-0", "-mt-48")
        }
        try{
            const response = await axios.get(`${link}/applicants/${checkIdDiv.current.children[1].value}`)
            if(response && response.data.applicantDetails){
                setInputValue(true);
                inputValue
                ? checkIdDiv.current.classList.replace("mt-0", "-mt-48")
                : checkIdDiv.current.classList.replace("mt-0", "mt-0")
            }
        }
        catch{
            setInputValue(false);
            setError(true)
        }
    }

    useEffect(() => {
        if( inputId != "") getA()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue])



    return (
        <div ref={checkIdDiv} className="flex flex-col relative items-end my-7 py-4 mt-0">
            <label htmlFor="applicantId" className="mb-2 text-xl w-full">Applicant id:</label>
            <input onChange={() => {setInputId(checkIdDiv.current.children[1].value);}} type="text" name="applicantId" placeholder="e.g. fd8s941dsf44errf" id="applicantId" className="w-full py-2 px-2 border rounded-md"/>
            {!inputValue && inputId != "" && error &&
                <div className="error bg-red-200 border border-red-500 text-red-800 rounded-lg px-2 w-full py-2 my-2">No such an id</div>
            }
            <button type="submit" onClick={getA} className="z-50 w-fit rounded-md my-2 px-3 py-2 border bg-green-700 text-white">Search</button>
        </div>
    )
}

CheckId.propTypes = {
    value: PropTypes.bool,
};

export default CheckId;