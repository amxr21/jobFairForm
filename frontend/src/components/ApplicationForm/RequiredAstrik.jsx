const RequiredMark = ({required}) => (
    required 
    ? <span className="text-red-600">*</span> 
    : <span className="text-gray-300 italic text-xs">Optional</span>
)


export default RequiredMark