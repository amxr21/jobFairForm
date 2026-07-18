const Progress = () => {
    return (
        <div className="progress h-fit md:h-full">
            <div className="h-2 w-full md:h-full md:w-2 rounded-full border border-white bg-[#0E7F41]">
                <div className={`progress-bar w-1/3 h-full md:h-1/3 md:w-full rounded-full bg-white`}></div>
            </div>
        </div>
    )
}

export default Progress