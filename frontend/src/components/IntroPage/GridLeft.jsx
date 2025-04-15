import GridLeftPng from "../../assets/images/grid.png"

const GridLeft = ({mark, otherClasses}) => {
    return (
        <div className={`absolute top-0 h-full rotate-90 md:rotate-0 w-full md:w-fit ${mark ?" md:left-0 -left-20" : otherClasses}`}>
            <img src={GridLeftPng} alt="" className="h-full"/>
        </div>
    )
}


export default GridLeft