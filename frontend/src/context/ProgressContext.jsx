import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

import PersonalIcon from '../assets/images/personal.svg'

// eslint-disable-next-line react-refresh/only-export-components -- context is tightly coupled to ProgressProvider, kept in one file
export const ProgressContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to ProgressProvider, kept in one file
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
    }



    return (
        <ProgressContext.Provider value={{ progress, updateProgress, header, setHeader, icon, setIcon  }} >
            { children }
        </ProgressContext.Provider>
    )


}

ProgressProvider.propTypes = {
    children: PropTypes.node,
};

