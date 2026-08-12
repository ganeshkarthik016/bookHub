import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar />

                <main className="flex-1 px-8 py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;