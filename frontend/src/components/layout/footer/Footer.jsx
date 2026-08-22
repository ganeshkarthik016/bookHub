export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} BookHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}