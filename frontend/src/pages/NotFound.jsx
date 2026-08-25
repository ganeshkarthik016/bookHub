import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                <FileQuestion className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
            <p className="mt-3 max-w-md text-gray-500">
                Oops! The page you are looking for doesn't exist, has been moved, or is currently unavailable.
            </p>
            <Link 
                to="/"
                className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
            >
                Back to Home Feed
            </Link>
        </div>
    );
}