import UniversityLogo from "../../assets/images/uniLogo-white.svg";
import CastoLogo from "../../assets/images/castoLogo-white.svg";
 



import UniLogoSVG from "./UniLogo";


const Logos = () => {
    return (
        <div className="logos flex gap-x-4 w-full md:w-fit">
            <div className="university-logo flex gap-x-4 w-4/12">
                <img src={UniversityLogo} alt="" className="" />
            </div>
            <div className="casto-office-logo w-11/12 md:w-fit  overflow-hidden">
                <img src={CastoLogo} alt="" className=" " />
            </div>
        </div>
    )
}

export default Logos;