import { FormContext, FormProvider } from "../../Context/FormContext";
import { ProgressProvider } from "../../Context/ProgressContext";
import { NavBar, MainBanner, Form } from "./index";
// import "./style.css"

const ApplicationForm = () => {
  let a = localStorage.getItem("user")

  return (
    <div className="relative xl:bg-[rgb(252,252,252)] p-4 md:p-6 xl:p-8 h-full xl:h-[90vh]">
      <FormProvider>
        <Form/>
      </FormProvider>
    </div>
  )
}

export default ApplicationForm
