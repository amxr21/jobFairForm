import { FocusedState, Form, RequiredAstrik } from "./index";
import { useEffect, useRef, useState } from "react";

import useFormContext from "../../Hooks/useFormContext";

const Input = ({label, type, name, fieldClasses, headerClasses}) => {


  
  
  const refLabel = useRef();
  
  const [ isFocused,setIsFocused] = useState(false)
  
  
  const { formData, updateFormData, setFormData, setFieldMissing } = useFormContext();
  
  console.log(formData);
    
    const capitalize = (str) => {
      if(!str) return ""
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }




    const getInput = () => {
      let value = refLabel?.current?.value?.trim();
      console.log(formData);
      
      // General required field check
      if (!value) {
        setFieldMissing(label)
        return;
      }
    
      // Field-specific validations
      switch (label) {
        case 'Email address':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            setFieldMissing('Email address')
            return;
          }
          break;
    
        case 'Mobile number':
          if (!/^\d{10}$/.test(value)) {
            setFieldMissing('Mobile number')
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
      if (label === "First Name" || label === "Last Name") {
        setFormData((prev) => {
          const first = label === "First Name" ? capitalize(value) : prev.tempFirst || "";
          const last = label === "Last Name" ? capitalize(value) : prev.tempLast || "";
          return {
            ...prev,
            tempFirst: label === "First Name" ? capitalize(value) : prev.tempFirst,
            tempLast: label === "Last Name" ? capitalize(value) : prev.tempLast,
            "Full Name": `${first} ${last}`.trim(),
          };
        });


      } else {
        updateFormData(label, value);
        //this is the key to solve the issue of unupdated asynchronus states 
        const { tempFirst, tempLast, ...finalData } = formData
        console.log(finalData);
        
      }
    };
    


    const focusedInput = () => {
      setIsFocused(p => !p)

      setTimeout(() => {setIsFocused(false)}, 2000)
      

    }


    
    
    switch(label){
      case 'First Name': case 'Last Name': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <input ref={refLabel} onChange={getInput} type='text' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'University ID': 
        return (
          <div className={`relative flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
              <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
              <input onFocus={focusedInput} inputMode="numeric" pattern="[0-9]+" ref={refLabel} onChange={getInput} type='number' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label+' without U'} min={18000000} max={25999999} /> 
              {
                  isFocused && <FocusedState label={'Uni ID'} />
              }
          </div>

        )

      case 'Date of Birth': 
        const get20YearsAgo = () => {
          const today = new Date();
          today.setFullYear(today.getFullYear() - 20);
          return today.toISOString().split('T')[0];
        };
      
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <input ref={refLabel} onChange={getInput} type='date' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} max={get20YearsAgo()} />
            </div>
        )

      // case 'Gender': 
      //   return (
      //       <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
      //           <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
      //           <input ref={refLabel} onChange={getInput} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label}/>
      //       </div>
      //   )

      // case 'Nationality': 
      //   return (
      //       <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
      //           <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:</h2>
      //           <input ref={refLabel} onChange={getInput} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
      //       </div>
      //   )

      case 'Email address': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <input ref={refLabel} onChange={getInput} type='email' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'Mobile number': 
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <input ref={refLabel} onChange={getInput}  pattern="[0-9]{10}" maxLength="10" type='tel' min={0} max={0} step={0.1} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
      case 'CGPA': 
        return (
            <div className={`relative flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={false} /></h2>
                <input onFocus={focusedInput} ref={refLabel} onChange={getInput} type='number' name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
                {
                  isFocused && <FocusedState label={'CGPA'} />
                }
            </div>
        )
      case 'Technical Skills': case 'Non-Technical Skills': 
        return (
            <div className={`flex flex-col grow  md:my-0 ${fieldClasses} max-w-full min-h-28`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <textarea ref={refLabel} onChange={getInput} type='number' name={name} className="min-h-5 mb-2 grow w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label == 'Technical Skills' ? "Include skills such as C++, Python, JaveScript, etc..." : "Include skills such as Attentive to Details, Adaptability, Time management, etc..."}></textarea>
            </div>
        )

      case 'Expected to Graduate':
        return (
            <div className={`relative flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}:<RequiredAstrik required={true} /></h2>
                <input disabled={!isFocused} ref={refLabel} onChange={getInput} type='date' name={name} 
                className={`bg-gray-200 min-h-8 w-full bg-transparent border ${!isFocused ? 'border-gray-200 text-gray-200' : 'border-gray-700 text-black'} rounded-lg py-1.5 px-2`}
                placeholder={label} />
                {/* {isFocused && <FocusedState label={'Expected to Graduate'} />} */}
                <div className="flex flex-row gap-x-2">
                  <input type='checkbox' onChange={(e) => {setIsFocused(e.target.checked)}} id="c" name={'c'} className="min-h-2 bg-transparent border border-gray-200 rounded-lg py-1.5 px-2" />
                  <label htmlFor="c" >Are you a current student?</label>
                </div>
            </div>

        )

      case 'Others, if any':
        return (
          <div className={`flex md:flex-row flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
              <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={false} /></h2>
              <input ref={refLabel} onChange={getInput} type={type} name={name} className="min-h-fit h-10 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
          </div>
      )
        


      default:
        return (
            <div className={`flex flex-col grow mb-4 md:my-0 ${fieldClasses} max-w-full`}>
                <h2 className={`text-md md:text-lg mb-2  ${headerClasses}`}>{label}: <RequiredAstrik required={true} /></h2>
                <input ref={refLabel} onChange={getInput} type={type} name={name} className="min-h-8 w-full bg-transparent border border-gray-700 rounded-lg py-1.5 px-2 " placeholder={label} />
            </div>
        )
        


    }



}


export default Input;