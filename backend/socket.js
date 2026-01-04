let ioInstance;


const setIO = (io) => {
    if(!ioInstance){
        ioInstance = io
    }

}


const getIO = () => {
    return ioInstance
}

module.exports ={
    setIO,
    getIO,
    ioInstance
}