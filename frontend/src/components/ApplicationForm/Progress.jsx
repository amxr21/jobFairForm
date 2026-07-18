import PropTypes from "prop-types";

// Reactive progress bar — fill is derived from currentStep rather than poked
// imperatively via document.querySelector from Form.jsx. Horizontal on mobile,
// vertical on md+ to match the side-panel layout.
const Progress = ({ currentStep = 1, totalSteps = 3 }) => {
    const pct = `${(currentStep / totalSteps) * 100}%`;

    return (
        <div className="progress h-fit md:h-full" style={{ ["--fill"]: pct }}>
            <div className="relative h-2 w-full md:h-full md:w-2 rounded-full border border-white/70 bg-white/10 overflow-hidden">
                <div className="progress-fill absolute rounded-full bg-white" />
            </div>
        </div>
    )
}

Progress.propTypes = {
    currentStep: PropTypes.number,
    totalSteps: PropTypes.number,
};

export default Progress