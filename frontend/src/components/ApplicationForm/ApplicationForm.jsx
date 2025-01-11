import { ProgressProvider } from "../../Context/ProgressContext";
import { NavBar, MainBanner, Form } from "./index";
// import "./style.css"

const ApplicationForm = () => {
  let a = localStorage.getItem("user")

  return (
    <div className="relative bg-[rgb(252,252,252)] p-4 md:p-8 h-[90vh]">
      {/* <NavBar /> */}
      {/* {
      a
      ?
      JSON.parse(a)?.email &&
        <div className="text-center">You are now logged in as {"\t"}
          <span className="font-bold underline uppercase">
          {
            
            `${JSON.parse(a).email.split('@')[0]}`
          }
          </span>
        </div>
      :
      <>
        <div className="text-center">You are now logged in as {"\t"}
          <span className="font-bold underline uppercase">
          guest
          </span>
        </div>
      </>

      } */}

      {/* <MainBanner/> */}
      {/* <ProgressProvider> */}
        <Form/>
      {/* </ProgressProvider> */}
    </div>
  )
}

export default ApplicationForm
