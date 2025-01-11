import UosGradientPng from "../../assets/images/UoS-gradient.png"
import UosGradientSvgPhone from "../../assets/images/UoS-gradient-phone.svg"

const UosGradient = () => {
    return (
        <>
            <div className="hidden md:block w-full md:w-fit md:opacity-100 opacity-55">
                <img src={UosGradientPng} alt="" className="w-full md:w-fit" />
            </div>
            <div className="block md:hidden w-full md:w-fit md:opacity-100 opacity-55">
                <img src={UosGradientSvgPhone} alt="" className="w-full md:w-fit" />
            </div>
        </>
    )
}

export default UosGradient;