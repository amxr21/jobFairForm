import "./inputs.css";
import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ApplicationForm } from "./components/ApplicationForm";
import Intro from "./pages/Intro"
import ThemeToggle from "./components/ThemeToggle";
import ThemeTourHint from "./components/ThemeTourHint";
import ModeBadge from "./components/ModeBadge";

function App() {
    return (
        <div className="App relative">
            <ModeBadge />
            <ThemeToggle />
            <ThemeTourHint />
            <BrowserRouter>
                <Intro />
                <Routes>
                    <Route path="/" element={<ApplicationForm />} />
                    <Route path="/my-qr-code" element={<ApplicationForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
