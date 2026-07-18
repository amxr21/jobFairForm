const TicketText = () => {
    return (
        <div className="ticket-id flex flex-col font-bold gap-y-4">
            <div className="text-[1.3em] md:text-3xl font-bold">
                <p className="w-full text-justify">
                    Here is your QR Code ticket:
                </p>
            </div>
                <span className="font-light text-xs text-justify md:text-lg">Please screenshot this QR Code  for the entry and to share your profile with more than 70 companies!</span>
        </div>
    )
}

export default TicketText;