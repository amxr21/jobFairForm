import { useRef } from "react"


const SubmitFormBtn = () => {
    const submitForm = useRef();

    return (
        <button ref={submitForm} onSubmit={handleSubmit} id="submitForm" className="bg-[#0E7F41] hover:bg-[#0a5f31] text-white w-full px-2 py-3 rounded-xl ">Apply and get a chance to start your career !!</button>
    )
}

export default SubmitFormBtn;