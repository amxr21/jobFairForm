import { FormProvider } from "../../context/FormContext";
import { Form } from "./index";
// import "./style.css"

// h-[100dvh] rather than h-full: dvh tracks the *dynamic* viewport, so it
// already excludes the mobile browser's toolbar and re-measures when that
// toolbar hides on scroll. h-full would only work if every ancestor also had a
// height, which is fragile. The form inside is h-full, so it fills this
// element minus its padding.
const ApplicationForm = () => {
  return (
    <div className="relative xl:bg-surface-page p-2 md:p-4 xl:p-6 h-[100dvh]">
      <FormProvider>
        <Form/>
      </FormProvider>
    </div>
  )
}

export default ApplicationForm
