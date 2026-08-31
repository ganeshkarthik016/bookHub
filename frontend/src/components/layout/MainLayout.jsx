import { Outlet } from "react-router-dom";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import RightSidebar from "./sidebar/RightSidebar.jsx";

export default function MainLayout() {
    return (
        <div className="flex h-dvh flex-col bg-gray-50 overflow-hidden">
            
            <Header />

            {/* 2. The Main Application Container */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* 3. Left Navigation Sidebar */}
                <Sidebar />

                <main className="flex-1 overflow-y-auto w-full relative scroll-smooth">
                    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 lg:py-8">
                        <Outlet />
                    </div>
                </main>

                {/* 5. Right Suggestion Sidebar (Only visible on xl screens) */}
                <RightSidebar />
                
            </div>
        </div>
    );
}