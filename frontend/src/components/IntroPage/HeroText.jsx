import ActionPart from "./ActionPart"
import HeaderSub from "./HeaderSub"

const HeroText = () => {
    return (
        <div className="w-full md:w-[70%] -mt-60 grow md:mt-0 text-white flex flex-col justify-between">
            <div className="flex flex-col gap-y-2 md:gap-y-6 ">
                <HeaderSub />
                <p className="font-extralight text-xs md:text-xl text-justify">
                Connect with leading companies, showcase your skills, and find your dream job in one place.
                </p>
            </div>
            <ActionPart />
        </div>
    )
}

export default HeroText