import { useState, useRef, createContext } from "react";


export const FormContext = createContext();


export const FormProvider = ( {children} ) => {

    const [formData, setFormData] = useState({});

    const [ fieldMissing, setFieldMissing ] = useState('ba')

    const updateFormData = (inputName, value) => {
        setFormData((prevData) => ( {...prevData, [inputName]: value} ) )
    }

    


    return (
        <FormContext.Provider value={{formData, updateFormData, setFormData, fieldMissing, setFieldMissing}}>
            {children} 
        </FormContext.Provider>
    )
}