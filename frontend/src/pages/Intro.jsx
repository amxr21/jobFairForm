import LowerPart from "../components/IntroPage/LowerPart";
import UpperPart from "../components/IntroPage/UpperPart";


const Intro = () => {


    const actualHeight = (window.innerHeight)/(window.screen.height - (window.screen.height- window.innerHeight) ) * 100


    return (
        <div id="intro" className={`intro fixed p-4 md:p-10 w-[100vw] md:w-full h-[${actualHeight}%] md:h-[100vh] top-0 left-0 bg-white z-[999999] overflow-hidden`}>
            <div id="intro" className={`bg-[#0E7F41] flex flex-col px-8 py-6 md:px-16 md:py-14 h-full rounded-[2em] md:rounded-t-[4em] md:rounded-b-[2em] overflow-y-scroll`}>

                <UpperPart />
                
                <div className="line w-full border-b md:my-6 mb-3"></div>



                <LowerPart />


            </div>
        </div>
    )
}

export default Intro;