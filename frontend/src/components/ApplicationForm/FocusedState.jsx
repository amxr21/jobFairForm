const FocusedState = ({label}) => {
    switch(label){
        case "CGPA":
            return (
                <div className="absolute -bottom-6 left-1 w-full h-5">
                    <p className="text-xs italic text-red-600">Only if CGPA is higher than 3.0</p>
                </div>
            )
        case "Expected to Graduate":
            return (
                <div className="absolute -bottom-0 left-1 w-full h-5">
                    <p className="text-xs italic text-red-600">Only if you are a current student</p>
                </div>
            )
        case "Uni ID":
            return (
                <div className="absolute -bottom-0 left-1 w-full h-5">
                    <p className="text-xs italic text-red-600">Must be above U18 and not older than U25</p>
                </div>
            )
    }
}


export default FocusedState