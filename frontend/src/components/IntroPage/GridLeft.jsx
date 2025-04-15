import GridLeftPng from "../../assets/images/grid.png"

const GridLeft = ({mark, otherClasses}) => {
    return (
        <div className={`absolute md:w-fit ${mark ?" h-full top-0 w-full md:rotate-0 md:left-0 -left-36" : otherClasses}`}>
            <img src={GridLeftPng} alt="" className="h-full"/>
        </div>
    )
}


export default GridLeft