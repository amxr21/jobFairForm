import { FormContext, FormProvider } from "../../Context/FormContext";
import { ProgressProvider } from "../../Context/ProgressContext";
import { NavBar, MainBanner, Form } from "./index";
// import "./style.css"

const ApplicationForm = () => {
  let a = localStorage.getItem("user")

  return (
    <div className="relative bg-[rgb(252,252,252)] p-4 md:p-8 h-[90vh]">
      <FormProvider>
        <Form/>
      </FormProvider>
    </div>
  )
}

export default ApplicationForm
