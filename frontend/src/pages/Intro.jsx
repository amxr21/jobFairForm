import LowerPart from "../components/IntroPage/LowerPart";
import UpperPart from "../components/IntroPage/UpperPart";

import GridLeft from "../components/IntroPage/GridLeft"
import SloganImage from "../components/IntroPage/SloganImage";
import PrivacyPopup from "../components/IntroPage/PrivacyPolicy";



const Intro = () => {


    const actualHeight = (window.innerHeight)/(window.screen.height - (window.screen.height- window.innerHeight) ) * 100


    return (
        <>
            {/* Full-bleed backing layer — the padded panel below doesn't
                reach the true screen edges (that's intentional, it's the
                margin around the rounded green card), so without this the
                page behind Intro shows through the gap. Same z-index minus
                one, no padding, so it's always a solid backdrop regardless
                of viewport/height-calc edge cases. */}
            <div className="fixed inset-0 w-screen h-screen bg-surface-page z-[999998]" />
            <div id="intro" className={`intro fixed p-4 md:p-6 w-[100vw] md:w-full h-[${actualHeight}%] md:h-[100vh] top-0 left-0 bg-surface-page z-[999999] overflow-hidden`}>
            <PrivacyPopup />
            
            <div id="intro" className={`relative bg-[#0E7F41] text-white flex flex-col gap-8 px-6 py-4 md:px-14 md:py-12 h-full rounded-[2em] md:rounded-t-[4em] md:rounded-b-[2em] overflow-y-auto overflow-x-hidden`}>
                <UpperPart />
                <LowerPart />

                <GridLeft mark={true} />
                <SloganImage />
            </div>
            </div>
        </>
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