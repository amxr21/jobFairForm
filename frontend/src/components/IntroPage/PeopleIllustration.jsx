import PeopleIllustrationSvg from "../../assets/images/people.svg"
import PeopleIllustrationSvgPhone from "../../assets/images/people-phone.svg"

const PeopleIllustration = () => {
    return (
        <>
            <div className="hidden md:block md:h-full h-42 w-full md:w-[38em] md:my-0 my-4">
                <img className="h-full md:h-full w-full" src={PeopleIllustrationSvg} alt="" />
            </div>
            <div className="block md:hidden md:h-full h-42 w-full md:w-[38em] md:my-0 my-4">
                <img className="h-full md:h-full w-full" src={PeopleIllustrationSvgPhone} alt="" />
            </div>
        </>
    )
}

export default PeopleIllustration