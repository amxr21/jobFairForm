const RequiredMark = ({required}) => (
    required 
    ? <span className="text-red-600 lg:-mb-0.5">*</span> 
    : <span className="absolute -bottom-4 left-0 text-gray-300 italic text-xs lg:mb-5">Optional</span>
)


export default RequiredMark