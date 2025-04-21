import SuitcaseEmoji from "../../assets/images/suitEmoji.png"
import doneEmoji from "../../assets/images/doneEmoji.png"
import Emoji from "../SuccessPage/Emoji";


const TicketText = ({QrCodeSrc}) => {
    return (
        <div className="ticket-id flex flex-col font-bold gap-y-4">
            <div className="text-[1.3em] md:text-3xl font-bold">
                <p className="w-full text-justify">
                    Here is your QR Code ticket:
                </p>
                {/* <div className="flex">
                    <Emoji imageSrc={doneEmoji} imageAlt={'doneEmoji'} classes="w-6 md:w-8 mr-1" />
                    <Emoji imageSrc={SuitcaseEmoji} imageAlt={'SuitcaseEmoji'} classes="w-6 md:w-8 mr-1" />
                </div> */}
            </div>
                <span className="font-light text-xs text-justify md:text-lg">Please screenshot this QR Code  for the entry and to share your profile with more than 70 companies!</span>
            {/* <span className="text-sm font-light">{QrCodeSrc}</span> */}
        </div>
    )
}

export default TicketText;