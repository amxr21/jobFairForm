import PropTypes from "prop-types";

const FocusedState = ({label}) => {
    switch(label){
        case "CGPA":
            return (
                <div className="absolute -bottom-6 md:-bottom-[1.25rem] start-1 w-11/12 h-5">
                    <p className="text-xs italic text-red-600">Include only if more than 3.0</p>
                </div>
            )
        case "Uni ID":
            return (
                <div className="absolute -bottom-6 md:-bottom-[30%] start-1 w-full h-5">
                    <p className="text-xs italic text-red-600">First two digits are your enrolment year</p>
                </div>
            )
    }
}


FocusedState.propTypes = {
    label: PropTypes.string,
};

export default FocusedState