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
            CGPA: 0,
            "Expected to Graduate": "",
            "Technical Skills": [],
            Experience: "",
            "Non-technical skills": [],
            CV: null,
            // Optional preference fields
            "Field Interest": [],
            "Opportunity Type": [],
            "Preferred Work City": ""
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
            key != "Field Interest" &&
            key != "Opportunity Type" &&
            key != "Preferred Work City" &&
            isEmptyValue(value)
          )
          .map(([key]) => key)
      );


    console.log(fieldMissing);
    

    const updateFormData = (inputName, value) => {
        const updatedData = { ...formData, [inputName]: value };
      
        setFormData(updatedData);
      
        const missingFields = Object.entries(updatedData)
        .filter(([key, value]) => {
          if (key === "University ID") {
            const idStr = String(value).trim();
            if (!value || idStr.length !== 8) return true;
            const firstTwo = parseInt(idStr.substring(0, 2));
            return firstTwo < 14 || firstTwo > 26;
          }

          if (key === "Mobile number") {
            const phone = String(value).trim();
            const isLocalValid = /^0\d{9}$/.test(phone);
            const isIntlValid = /^\+\d{10,14}$/.test(phone);
            return !value || (!isLocalValid && !isIntlValid);
          }

          if (key === "Email address") {
            return !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
          }

          return (
            key !== "Expected to Graduate" &&
            key !== "CGPA" &&
            key !== "LinkedIn URL" &&
            key !== "CV" &&
            key !== "Field Interest" &&
            key !== "Opportunity Type" &&
            key !== "Preferred Work City" &&
            isEmptyValue(value)
          );
        })
        .map(([key, value]) => {
          if (key === "University ID") {
            const idStr = String(value).trim();
            if (!value || idStr.length !== 8) {
              return `${key} must be exactly 8 digits`;
            }
            const firstTwo = parseInt(idStr.substring(0, 2));
            if (firstTwo < 14 || firstTwo > 26) {
              return `${key} - First 2 digits must be between 14-26`;
            }
          }

          if (key === "Mobile number") {
            const phone = String(value).trim();
            const isLocalValid = /^0\d{9}$/.test(phone);
            const isIntlValid = /^\+\d{10,14}$/.test(phone);
            if (!value || (!isLocalValid && !isIntlValid)) {
              return `${key} - Must be 10 digits (05XXXXXXXX) or country code format (+971XXXXXXXXX)`;
            }
          }

          if (key === "Email address") {
            if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
              return `${key} is not a valid email`;
            }
          }

          return `${key} is required`;
        })
        .join(", ");

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