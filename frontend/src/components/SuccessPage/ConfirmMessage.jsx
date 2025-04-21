const ConfirmMessage = ({ emoji }) => {
    return (
        <div className="confirmation-message w-full md:w-5/12 h-fit text-white">
            {/* <div className="text-7xl flex items-center justify-center font-bold w-10 md:w-20 h-10 md:h-20 mb-2 md:mb-6">
                <img src={emoji} alt="" />
            </div> */}
            <div className="text italic flex flex-col gap-2">
                <h2 className="text-3xl md:text-6xl font-bold">You are all set!</h2>
                <p>See you on 22nd April 2025, Tuesday at M11 from 10:00 AM till 02:00 PM.</p>
            </div>
        </div>
    )
}

export default ConfirmMessage;