import ActionPart from "./ActionPart";
import HeroText from "./HeroText";
import UosGradient from "./UosGradient";

const LowerPart = () => {
    return (
        <div className="flex  md:flex-row flex-col grow justify-between h-full gap-x-8">
            <UosGradient />
            <HeroText />
        </div>
    )
}

export default LowerPart;