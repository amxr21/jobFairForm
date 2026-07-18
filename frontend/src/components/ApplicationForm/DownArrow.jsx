import { ChevronDownCircle } from "lucide-react";

const DownArrow = () => {
    return (
        <div className="bg-surface-card shadow-lg opacity-50 flex md:hidden items-center justify-center w-12 h-12 rounded-full">
            <ChevronDownCircle className="size-6" strokeWidth={1.5} />
        </div>
    )
}


export default DownArrow
