import { useEffect, useState } from "react"

const Progress = ( {secton} ) => {

    const inputFields = document.querySelectorAll('input, select')




    // console.log([...inputFields]);

    // const [progressPercentage, setProgressPercentage] = useState('0')

    // useEffect(() => {
    //     secton?.textContent.split(" ")[0] == "Personal" ? setProgressPercentage('1/2') : setProgressPercentage('full')

    //     console.log(secton?.textContent.split(" ")[0]);

    // }, [secton])

    // secton?.textContent.split(" ")[0] == "Personal" ? setProgressPercentage('1/2') : setProgressPercentage('full')


    return (
        <div className="progress h-fit md:h-full">
            <div className="h-2 w-full md:h-full md:w-2 rounded-full border border-white bg-primary">
                <div className={`progress-bar w-0 h-full md:h-0 md:w-full rounded-full bg-white`}></div>
            </div>
        </div>
    )
}

export default Progress