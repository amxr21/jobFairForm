const FocusedState = ({label}) => {
    switch(label){
        case "CGPA":
            return (
                <div className="absolute -bottom-6 md:-bottom-[30%] lg:-bottom-[18%] left-1 w-11/12 h-5">
                    <p className="text-xs italic text-red-600">Only if CGPA is higher than 3.0</p>
                </div>
            )
        case "Uni ID":
            return (
                <div className="absolute -bottom-6 md:-bottom-[30%] left-1 w-full h-5">
                    <p className="text-xs italic text-red-600">Must be above U18 and not older than U25</p>
                </div>
            )
    }
}


export default FocusedState