const Emoji = ({ imageSrc, imageAlt, classes }) => {
    return (
        <span>
            <img src={imageSrc} alt={imageAlt} className={` ${classes}`} />
        </span>
    )
}

export default Emoji