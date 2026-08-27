import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

// Redux Actions & Services
import { loginSuccess, logout } from "./store/slices/authSlice"; 
import { getCurrentUser } from "./services/auth.service";

// Layouts & Global Components
import { MainLayout, AuthLayout } from "./components/index.js"; 
import GlobalModals from "./components/GlobalModals";

// Pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import NoteDetails from "./pages/NoteDetails";
import PlaylistDetails from "./pages/PlaylistDetails";
import MyNotes from "./pages/MyNotes";
import MyPlaylists from "./pages/MyPlaylists";
import MyWrittenNotes from "./pages/MyWrittenNotes";
import WrittenNoteDetails from "./pages/WrittenNoteDetails";
import NotFound from "./pages/NotFound";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    dispatch(loginSuccess(user));
                } else {
                    dispatch(logout()); // CHANGED
                }
            } catch (error) {
                dispatch(logout()); // CHANGED
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            {/* Renders any modal triggered by Redux */}
            <GlobalModals /> 
            
            {/* THE MISSING ROUTES TAG IS BACK! */}
            <Routes>
                
                {/* --- PUBLIC ROUTES (Auth) --- */}
                <Route element={<AuthLayout authentication={false} />}>
                    <Route 
                        path="/login" 
                        element={<Login />} 
                    />
                    <Route 
                        path="/signup" 
                        element={<Signup />} 
                    />
                </Route>

                {/* --- PROTECTED ROUTES (Main App) --- */}
                <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    <Route index element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/notes" element={<MyNotes />} />
                    <Route path="/playlists" element={<MyPlaylists />} />
                    <Route path="/written-notes" element={<MyWrittenNotes />} />
                    <Route path="/written-notes/:blogId" element={<WrittenNoteDetails />} />
                    
                    {/* Dynamic Routes */}
                    <Route path="/profile/:userName" element={<Profile />} />
                    <Route path="/notes/:noteId" element={<NoteDetails />} />
                    <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
                </Route>

                {/* --- 404 CATCH-ALL --- */}
                <Route path="*" element={<NotFound />} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
