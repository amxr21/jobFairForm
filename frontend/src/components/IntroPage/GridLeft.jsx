import PropTypes from "prop-types";
import GridLeftPng from "../../assets/images/grid.png"

const GridLeft = ({mark, otherClasses}) => {
    return (
        <div aria-hidden="true" className={`absolute md:w-fit ${mark ? "hidden md:block h-full top-0 w-full md:rotate-0 md:start-0 -start-36" : otherClasses}`}>
            <img src={GridLeftPng} alt="" className="h-full"/>
        </div>
    )
}


GridLeft.propTypes = {
    mark: PropTypes.bool,
    otherClasses: PropTypes.string,
};

export default GridLeft