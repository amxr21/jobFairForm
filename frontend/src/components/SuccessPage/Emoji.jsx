import PropTypes from "prop-types";

const Emoji = ({ imageSrc, imageAlt, classes }) => {
    return (
        <span>
            <img src={imageSrc} alt={imageAlt} className={` ${classes}`} />
        </span>
    )
}

Emoji.propTypes = {
    imageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    classes: PropTypes.string,
};

export default Emoji