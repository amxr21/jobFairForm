import ActionPart from "./ActionPart"
import PeopleImage from "./PeopleImage"

import FairText from "./FairText"

const LowerPart = () => {
    return (
        <div className="flex flex-col items-start grow relative w-full">
            
            
            <PeopleImage />


            <div className="flex flex-col md:items-end md:w-[60%]">
                <FairText />
                
                <ActionPart />

            </div>
            


        </div>
    )
    // return (
    //     <div className="flex  md:flex-row flex-col grow justify-between h-full gap-x-8">
    //         <UosGradient />
    //         <HeroText />
    //     </div>
    // )
}

export default LowerPart;