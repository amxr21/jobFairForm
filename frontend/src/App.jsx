import "./inputs.css";
import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ApplicationForm } from "./components/ApplicationForm";
import Intro from "./pages/Intro"
import ThemeTourHint from "./components/ThemeTourHint";
import ModeBadge from "./components/ModeBadge";
import ControlRail from "./components/ControlRail";
import LocaleTransitionOverlay from "./components/LocaleTransitionOverlay";
import { LocaleProvider } from "./context/LocaleContext";

function App() {
    return (
        <LocaleProvider>
        <div className="App relative">
            <ModeBadge />
            <ControlRail />
            <LocaleTransitionOverlay />
            <ThemeTourHint />
            <BrowserRouter>
                <Intro />
                <Routes>
                    <Route path="/" element={<ApplicationForm />} />
                    <Route path="/my-qr-code" element={<ApplicationForm />} />
                </Routes>
            </BrowserRouter>
        </div>
        </LocaleProvider>
    )
}

export default App;
