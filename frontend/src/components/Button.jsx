import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            className={`rounded-lg px-4 py-2 font-semibold transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}