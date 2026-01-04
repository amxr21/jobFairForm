import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ApplicationForm } from "./components/ApplicationForm";
import Intro from "./pages/Intro"

function App() {
    return (
        <div className="App relative">
            <Intro />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ApplicationForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
