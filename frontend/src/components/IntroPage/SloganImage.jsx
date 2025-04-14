import Slogan from "../../assets/images/slogan.png"

const SloganImage = () => {
    return (
        <div className="mini-footer absolute bottom-0 left-0 flex flex-col items-center justify-center p-2 border-t-2 w-[100%] h-14 bg-[#3DB083] z-50">
            <img src={Slogan} alt="" className="h-[85%]" />
        </div>
    )
}

export default SloganImage