const ConfirmMessage = ({ emoji }) => {
    return (
        <div className="confirmation-message w-full md:w-5/12 h-fit text-white">
            <div className="text-7xl flex items-center justify-center font-bold w-10 md:w-20 h-10 md:h-20 mb-2 md:mb-6">
                <img src={emoji} alt="" />
            </div>
            <h2 className="text-3xl md:text-6xl italic font-bold">You are all Done !</h2>
        </div>
    )
}

export default ConfirmMessage;