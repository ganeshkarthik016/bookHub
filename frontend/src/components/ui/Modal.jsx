import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = "max-w-2xl" 
}) {
    // Prevent scrolling on the background when the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Content Box */}
            <div 
                className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}