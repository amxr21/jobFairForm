import Slogan from "../../assets/images/slogan.png"

const SloganImage = () => {
    return (
        <div className="mini-footer sticky bottom-0 start-0 mt-auto -mx-5 md:-mx-14 -mb-5 md:-mb-12 flex flex-col items-center justify-center p-2 border-t-2 w-auto h-11 md:h-14 bg-[#3DB083] z-50 shrink-0">
            <img src={Slogan} alt="" className="h-[85%]" />
        </div>
    )
}

export default SloganImage