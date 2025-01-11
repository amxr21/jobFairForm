import Logos from "../IntroPage/Logos";
import Feb from "../../assets/images/FEB.svg";
import PeopleIllustration from "../IntroPage/PeopleIllustration";


const UpperPart = () => {
    return (
        <div className="upper-part flex flex-col md:flex-row justify-between md:items-end w-full md:h-[16em]">
            <div className="flex flex-col justify-between gap-4 md:w-[30em] h-full">
                <Logos/>
                <img src={Feb} alt="" className="hidden md:flex w-full" />
            </div>
            <PeopleIllustration />
        </div>
    )
}

export default UpperPart;