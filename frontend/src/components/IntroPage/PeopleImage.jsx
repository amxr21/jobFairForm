import People from "../../assets/images/ppl.png"


const PeopleImage = () => {
    return (
        <div className="people absolute -right-16 bottom-0 h-80 overflow-hidden">
            <img src={People} alt="" />
        </div>
    )
}


export default PeopleImage