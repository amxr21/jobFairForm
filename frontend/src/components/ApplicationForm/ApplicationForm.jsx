import { FormProvider } from "../../context/FormContext";
import { Form } from "./index";
// import "./style.css"

const ApplicationForm = () => {
  return (
    <div className="relative xl:bg-[rgb(252,252,252)] p-2 md:p-4 xl:p-6 h-full xl:h-[90vh]">
      <FormProvider>
        <Form/>
      </FormProvider>
    </div>
  )
}

export default ApplicationForm
