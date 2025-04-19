import { useEffect, useState } from 'react';

const PrivacyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('seenPrivacyPopup');
    if (!hasSeen) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('seenPrivacyPopup', 'true');
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-blue-600 text-white p-6 rounded-2xl max-w-xs md:max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Privacy Notice</h2>
        <p className="text-sm">
          This form collects your full name, email, phone number, and University ID solely for job fair participation purposes. 
          Your data will be securely stored and not shared with third parties.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-white text-blue-600 font-semibold py-1 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}



export default PrivacyPopup