import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar />

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
