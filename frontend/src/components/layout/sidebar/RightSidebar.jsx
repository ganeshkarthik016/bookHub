import { Link } from "react-router-dom";
import Button from "../Button.jsx"; // Assuming we made this earlier!

export default function RightSidebar() {
    // We will fetch real suggestions from Redux/API later. 
    // This is placeholder data so you can see the UI layout.
    const mockSuggestions = [
        { id: 1, userName: "alice_dev", name: "Alice", mutual: 3 },
        { id: 2, userName: "bob_coder", name: "Bob", mutual: 1 },
    ];

    return (
        <aside className="hidden w-80 flex-shrink-0 border-l border-gray-200 bg-white p-6 xl:block">
            <div className="sticky top-20">
                <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Suggested for you
                </h3>
                
                <div className="flex flex-col gap-4">
                    {mockSuggestions.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src="https://via.placeholder.com/40" 
                                    alt="Avatar" 
                                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex flex-col">
                                    <Link 
                                        to={`/profile/${user.userName}`}
                                        className="text-sm font-bold text-gray-900 hover:underline"
                                    >
                                        {user.userName}
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                        {user.mutual} mutual friends
                                    </span>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} BookHub</p>
                </div>
            </div>
        </aside>
    );
}