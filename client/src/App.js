import React from 'react'
import Login from './pages/login/Login';
import './App.css';
import Register from './pages/register/Register';
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
} from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Leftbar from './components/leftBar/Leftbar';
import Rightbar from './components/rightBar/Rightbar';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import './style.scss';
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const App = () => {

    const { darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    const queryClient = new QueryClient();

    console.log(darkMode);

    const Layout = () => {
        return (
            <QueryClientProvider client={queryClient}>
            <div className={`theme-${darkMode ? "dark" : "light"}`}>
                <Navbar />
                <div style={{ display: "flex" }}>
                    <Leftbar />
                    <div style={{ flex: 6 }}>
                        <Outlet />
                    </div>

                    <Rightbar />
                </div>
            </div>
            </QueryClientProvider>
        );
    };


    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />
        }
        else {
            return children;
        }

    }

    const router = createBrowserRouter([

        {
            path: "/",
            element: (<ProtectedRoute><Layout /></ProtectedRoute>),
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/profile/:id",
                    element: <Profile />
                }
            ]

        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]);


    return (
        <div className='app'>
            <RouterProvider router={router} />
        </div>
    )
}

export default App;
