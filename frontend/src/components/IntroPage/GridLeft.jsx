import GridLeftPng from "../../assets/images/grid.png"

const GridLeft = () => {
    return (
        <div className="absolute top-0 -left-20 md:left-0 h-full">
            <img src={GridLeftPng} alt=""  className="h-full"/>
        </div>
    )
}


export default GridLeft