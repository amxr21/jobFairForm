import "./style.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// import { Home } from "./pages/Home";
// import { Login } from "./pages/Login";
// import { Signup } from "./pages/Signup";
// import { NavBar } from "./components/ControlDashboard/index";

// import { useAuthContext } from "./Hooks/useAuthContext";

import { ApplicationForm } from "./components/ApplicationForm";

// import ApplicantPage from "./pages/ApplicantPage";

import Intro from "./pages/Intro"
import PrivacyPopup from "./components/IntroPage/PrivacyPolicy";

// const link = "https://jobfairform-backend.onrender.com"



function App() {
  // const { user } = useAuthContext();



  return (

    <div className="App relative">
      <PrivacyPopup />
      {/* <NavBar/> */}
      <Intro/>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<ApplicationForm />} />
          {/* <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} /> */}
          {/* <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} /> */}
          {/* <Route path="/applicant" element={<ApplicantPage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
