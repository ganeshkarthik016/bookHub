import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import { getCurrentUser } from "./services/auth.service";
import {
    restoreUser,
    loginFailure,
} from "./store/slices/authSlice";

function App() {
    const dispatch = useDispatch();

    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await getCurrentUser();

                dispatch(
                    restoreUser(response.data.user)
                );
            } catch (error) {
                dispatch(loginFailure());
            }
        };

        restoreSession();
    }, [dispatch]);

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Wrap MainLayout with ProtectedRoute, and nest your pages inside */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    {/* Future routes like <Route path="notes" element={<Notes />} /> will go here */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;