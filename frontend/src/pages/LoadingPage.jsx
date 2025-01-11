import AnimatedGif from '../assets/images/message.gif'

const LoadingPage = () => {
    return (
        <div id="LoadingPage" className="absolute top-0 left-0 w-full h-full z-[99999999] p-6 md:p-10">
            <div className="flex md:flex-row flex-col gap-6 w-full h-full bg-white opacity-95 border rounded-xl p-16 items-center justify-center">
                <img src={AnimatedGif} alt="" className="loading w-24 h-24 p-3 border rounded-full shadow-lg" />
                <div className="text w-72 h-24 px-4">
                    <h2 className="text-3xl font-semibold mb-2">Loading...</h2>
                    <p className="text-lg font-light leading-5">Hold on while we are processing your application</p>
                </div>
            </div>

        </div>
    )
}

export default LoadingPage;