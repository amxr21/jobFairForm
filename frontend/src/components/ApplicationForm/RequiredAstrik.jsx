import PropTypes from "prop-types";

const RequiredMark = ({required}) => (
    required
    ? <span className="text-red-600 lg:-mb-0.5">*</span>
    : <span className="text-fg-faint italic text-xs ml-1">(Optional)</span>
)

RequiredMark.propTypes = {
    required: PropTypes.bool,
};

export default RequiredMark