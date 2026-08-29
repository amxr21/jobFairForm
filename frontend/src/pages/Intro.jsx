import LowerPart from "../components/IntroPage/LowerPart";
import UpperPart from "../components/IntroPage/UpperPart";

import GridLeft from "../components/IntroPage/GridLeft"
import SloganImage from "../components/IntroPage/SloganImage";
import PrivacyPopup from "../components/IntroPage/DataNotice";
import useIntroTimeline from "../hooks/useIntroTimeline";



const Intro = () => {
    // Sequences the landing page's entrance. Elements opt in via
    // data-intro="..."; see useIntroTimeline for the order.
    const scope = useIntroTimeline();

    return (
        <div id="intro" className="intro fixed p-3 md:p-6 w-full h-[100dvh] top-0 left-0 bg-surface-page z-[999999] overflow-hidden">
            <PrivacyPopup />

            <div ref={scope} id="intro" className="relative bg-[#0E7F41] text-white flex flex-col gap-5 md:gap-8 px-5 py-5 md:px-14 md:py-12 h-full rounded-[2em] md:rounded-t-[4em] md:rounded-b-[2em] overflow-y-auto overflow-x-hidden overscroll-contain">
                <UpperPart />
                <LowerPart />

                <GridLeft mark={true} />
                <SloganImage />
            </div>





            
        </div>
    )
    // return (
    //     <div id="intro" className={`intro fixed p-4 md:p-8 w-[100vw] md:w-full h-[${actualHeight}%] md:h-[100vh] top-0 left-0 bg-white z-[999999] overflow-hidden`}>
    //         <div id="intro" className={`bg-[#0E7F41] flex flex-col px-8 py-6 md:px-14 md:py-12 h-full rounded-[2em] md:rounded-t-[4em] md:rounded-b-[2em] overflow-y-auto`}>

    //             <UpperPart />
                
    //             <div className="line w-full border-b md:my-6 mb-3"></div>



    //             <LowerPart />


    //         </div>
    //     </div>
    // )
}

export default Intro;