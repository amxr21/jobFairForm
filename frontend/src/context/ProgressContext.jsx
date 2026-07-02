import { createContext, useContext, useState } from "react";

import PersonalIcon from '../assets/images/personal.svg'

export const ProgressContext = createContext()

export const useProgressContext = () => {
    const progressContext = useContext(ProgressContext)

    if(!progressContext){
        // if the context was not within the provider
        throw new Error('useContext must be used within ProgressProvider')
    }

    return progressContext;
}



export const ProgressProvider = ({ children }) => {
    const [ progress, setProgress ] = useState(0);

    const [ header, setHeader ] = useState('Personal information')
    const [ icon, setIcon ] = useState(PersonalIcon)

    const updateProgress = (percentage) => {
        setProgress(percentage)
        console.log(progress);
        
    }



    return (
        <ProgressContext.Provider value={{ progress, updateProgress, header, setHeader, icon, setIcon  }} >
            { children }
        </ProgressContext.Provider>
    )


}

