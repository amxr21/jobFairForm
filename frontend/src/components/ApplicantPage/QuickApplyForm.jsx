import axios from "axios";
import { useState, useEffect, useContext } from "react";


import { CheckId, QrScanner, IdContext } from "./index"

const linkUrl = import.meta.env.VITE_API_URL || "https://jobfair-1.onrender.com"

const QuickApplyForm = () => {
    const [applicant, setApplicant] = useState({id: "", name: "Ammar"});
    const [checked] = useState(false);

    const { inputValue } = useContext(IdContext);

    useEffect(() => {
        axios.get(`${linkUrl}/applicants/${document.getElementById("applicantId").value}`)
        .then((response) => {
            setApplicant(response.data);
        })
        // Without this the lookup rejects unhandled whenever the id doesn't
        // exist (or the backend is unreachable); CheckId already surfaces the
        // "No such an id" message to the user.
        .catch(() => {})
    }, [inputValue])


    return (
        <div className="w-1/2 bg-surface-card h-64 rounded-lg px-8 py-6 shadow-2xl opacity-90 overflow-hidden">
            <CheckId value= {checked}/>
            {inputValue &&
            <div className="welcome-div">
                <h2 className="text-2xl font-bold">Welcome back {applicant?.applicantDetails?.fullName.split(" ")[0]}</h2>
                <div>
                    <h2>Apply using QR code !</h2>
                    <div className="flex gap-x-8 my-4">
                            <QrScanner />
                    </div>
                </div>

            </div>}
        </div>
    )
}

export default QuickApplyForm;