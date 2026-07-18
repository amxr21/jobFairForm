import PropTypes from "prop-types";

const FormHeader = ({header}) => {
    return (
        <h1 className="text-2xl md:text-3xl mb-4 md:mb-8 underline font-bold">{header}</h1>
    )
}

FormHeader.propTypes = {
    header: PropTypes.string,
};

export default FormHeader;