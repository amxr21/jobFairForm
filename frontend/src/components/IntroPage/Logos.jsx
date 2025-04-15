import UniversityLogo from "../../assets/images/UniLogoSvg.svg";
import CastoLogo from "../../assets/images/OfficeLogoSvg.svg";
 



import UniLogoSVG from "./UniLogo";


const Logos = () => {
    return (
        <div className="logos flex gap-x-8 md:gap-x-16">
            <div className="university-logo flex gap-x-4 items-center h-[4.5rem] justify-center">
                <img src={UniversityLogo} alt="" className="h-full" />
            </div>
            <div className="casto-office-logo flex items-center h-[4.5rem] justify-center overflow-hidden">
                <img src={CastoLogo} alt="" className=" h-[90%] w-fit" />
            </div>
        </div>
    )
}

export default Logos;