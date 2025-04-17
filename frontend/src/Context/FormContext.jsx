import { useState, useRef, createContext } from "react";


export const FormContext = createContext();





export const FormProvider = ( {children} ) => {


    

    const [formData, setFormData] = useState(
        {
            College: "",
            Major: "",
            tempFirst: "",
            tempLast: "",
            "Full Name": "",
            "University ID": "",
            "Date of Birth": "",
            Gender: "",
            City: "",
            Nationality: "",
            "Email address": "",
            "Mobile number": "",
            "LinkedIn URL": "",
            languages: [],
            "Study Program": "",
            CGPA: "",
            "Expected to Graduate": "",
            "Technical Skills": "",
            Experience: "",
            "Non-technical skills": "",
            CV: {}
          }
          
    );

    

    const isEmptyValue = (value) => {
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "object" && value !== null) return Object.keys(value).length === 0;
        return value === "";
      };

      
      const [fieldMissing, setFieldMissing] = useState(
        Object.entries(formData)
          .filter(([key, value]) =>
            key != "Expected to Graduate" &&
            key != "CGPA" &&
            key != "LinkedIn URL" &&
            key != "CV" &&
            isEmptyValue(value)
          )
          .map(([key]) => key)
      );


    console.log(fieldMissing);
    

    const updateFormData = (inputName, value) => {
        const updatedData = { ...formData, [inputName]: value };
      
        setFormData(updatedData);
      
        const missingFields = Object.entries(updatedData)
          .filter(([key, value]) =>
            key != "Expected to Graduate" &&
            key != "CGPA" &&
            key != "LinkedIn URL" &&
            key != "CV" &&
            isEmptyValue(value)
          )
          .map(([key]) => key).join(', ');
      
        setFieldMissing(missingFields);
      };
      
    // const updateFormData = (inputName, value) => {
    //     console.log(fieldMissing);
    //     setFieldMissing(
    //         (Object.entries(formData).filter((e) => (e[0] != "Expected to Graduate" && e[0] != "LinkedIn URL"  && e[0] == "CGPA") && (e[1] == "" || e[1] == [] || e[1] == {}) )).map((e) => (e[0])).join(', ')
    //     )
    //     setFormData((prevData) => ( {...prevData, [inputName]: value} ) )
    // }

    


    return (
        <FormContext.Provider value={{formData, updateFormData, setFormData, fieldMissing, setFieldMissing}}>
            {children} 
        </FormContext.Provider>
    )
}