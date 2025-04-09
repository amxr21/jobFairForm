import { Form } from "./index";
import { useRef, useState } from "react";

import useFormContext from "../../Hooks/useFormContext";

const Input = ({label, type, name, fieldClasses, headerClasses, func}) => {
    const refLabel = useRef();

    const [ lang, setLang ] = useState('')

    const { formData, updateFormData, setFormData, setFieldMissing } = useFormContext();
   
    

    const getInput = () => {
      let value = refLabel?.current?.value?.trim();
      
      // General required field check
      if (!value) {
        setFieldMissing(label)
        return;
      }
    
      // Field-specific validations
      switch (label) {
        case 'Email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            setFieldMissing('email')
            return;
          }
          break;
    
        case 'Phone number':
          if (!/^\d{10}$/.test(value)) {
            setFieldMissing('Phone number')
            return;
          }
          break;
    
        case 'CGPA':
          const cgpa = parseFloat(value);
          if (isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
            setFieldMissing('CGPA')
            return;
          }
          break;
    
        case 'Date Of Birth':
          const dob = new Date(value);
          const today = new Date();
          const minAgeDate = new Date();
          minAgeDate.setFullYear(today.getFullYear() - 20);
          if (dob > minAgeDate) {
            return;
          }
          break;
    
        case 'Others, if any': {
          const otherInput = document.getElementsByClassName('otherlangs-field')[0].lastElementChild.value.trim();
          if (otherInput) {
            setFormData((prev) => ({
              ...prev,
              languages: Array.from(new Set([
                ...(prev.languages.slice(0, [...prev.languages].length - 1).filter((text) => text !== 'Other') || []),
                otherInput
              ]))
            }));
          }
          return;
        }
    
        case 'Arabic':
        case 'English':
        case 'Chinese': {
          if (value) {
            setFormData((prev) => ({
              ...prev,
              languages: Array.from(new Set([
                ...(prev.languages.slice(0, [...prev.languages].length - 1).filter((text) => text !== 'Other') || []),
                value
              ]))
            }));
          }
          return;
        }
    
        default:
          break;
      }
    
      // Fallback update for normal inputs
      updateFormData(label, value);
    };
    
      

    
    
    switch(label){
      case 'Full Name': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} type='text' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'University ID': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input inputMode="numeric" pattern="[0-9]+" ref={refLabel} onChange={getInput} type='number' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label+' without U'} min={18000000} max={25999999} />
            </div>
        )

      case 'Date Of Birth': 
        const get20YearsAgo = () => {
          const today = new Date();
          today.setFullYear(today.getFullYear() - 20);
          return today.toISOString().split('T')[0];
        };
      
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} type='date' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} max={get20YearsAgo()} />
            </div>
        )

      case 'Gender': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label}/>
            </div>
        )

      case 'Nationality': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )

      case 'Email': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} type='email' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'Phone number': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput}  pattern="[0-9]{10}" maxLength="10" type='tel' min={0} max={0} step={0.1} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'CGPA': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} type='number' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )

      default:
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
                <input ref={refLabel} onChange={getInput} type={type} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
        


    }



}


export default Input;