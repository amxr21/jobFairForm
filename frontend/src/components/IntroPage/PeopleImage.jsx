import People from "../../assets/images/ppl.png"


const PeopleImage = () => {
    return (
        <div className="people absolute -right-16 bottom-0 md:bottom-0 w-60 md:w-fit md:h-80 overflow-hidden">
            <img src={People} alt="" />
        </div>
    )
}


export default PeopleImage