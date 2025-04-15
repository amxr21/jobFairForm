import QRCode from 'qrcode.react';
import ReturnHome from "../SuccessPage/ReturnHome";

import CelebrateEmoji from "../../assets/images/celebrateEmoji.png"
import SuitcaseEmoji from "../../assets/images/suitEmoji.png"

import ConfirmMessage from "../SuccessPage/ConfirmMessage";
import TicketText from "../SuccessPage/TicketText";


const ConfirmMessageDiv = ({confirmMessageRef, qrCodeSrc}) => {
    return (
        <div ref={confirmMessageRef} className="confirmMessageRef flex flex-col p-0 gap-y-5 rounded-3xl border overflow-hidden gap-x-20 h-0 opacity-0">
            <div className="bg-[#2959A6] flex md:flex-row flex-col px-6 md:px-12 py-8 md:py-10 gap-x-24 gap-y-4 rounded-3xl h-fit">
                <ConfirmMessage emoji={CelebrateEmoji} />

                <div className="qr-code flex md:flex-row flex-col items-center md:items-start p-8 rounded-3xl w-full md:w-7/12 bg-white md:gap-x-14 gap-y-5">
                    <div className="qr-code min-w-44 min-h-44 w-44 h-44 border flex flex-col items-center justify-center">
                        {qrCodeSrc && <QRCode style={{ height: '88%', width: '88%' }} value={`${qrCodeSrc}`} />}
                        {!qrCodeSrc && <h2>Loading the QR code...</h2>}
                    </div>

                    <TicketText QrCodeSrc={qrCodeSrc} />

                </div>

            </div>

            <div>
                <ReturnHome />
            </div>


        </div>
    )
}
export default ConfirmMessageDiv

//my idea breif
//each QR code will represent a uniqure id for each applicant file
//this id is the key for each file
//once the QR code is scanned this will log in the employer into a website with a simple log in 
//the website will display all the applicant that has been scanned by the employee him/her-self
//the scan process must be initiated from the website itself so the file scanned is getting saved to the relevant website