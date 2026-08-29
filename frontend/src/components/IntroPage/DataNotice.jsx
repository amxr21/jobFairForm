import { useEffect, useState } from 'react';

// NOTE ON THE FILENAME — do not rename this back to PrivacyPolicy.jsx.
//
// Content blockers (Brave Shields, uBlock Origin, AdBlock) match on URL
// substrings, and "PrivacyPolicy" / "consent" / "cookie" are all on the
// standard filter lists because they are the usual names for tracking-consent
// widgets. A blocked request fails as ERR_BLOCKED_BY_CLIENT, which the browser
// reports as a network error rather than anything a build or a test would
// catch — so the module simply never loads.
//
// In dev that reads as a mystifying import failure. In production it breaks
// the page for every visitor running a blocker, which is a large share of
// them. "DataNotice" carries none of those trigger words.
//
// The component keeps the name PrivacyPopup: only the URL is ever matched, and
// the identifier is what the rest of the code reads.

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
      <div className="bg-[#0E7F41] text-white p-6 rounded-2xl max-w-xs md:max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Privacy Notice</h2>
        <p className="text-sm">
          This form collects your full name, email, phone number, and University ID solely for job fair participation purposes. 
          Your data will be securely stored and not shared with third parties.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-white text-[#0E7F41] font-semibold py-1 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}



export default PrivacyPopup