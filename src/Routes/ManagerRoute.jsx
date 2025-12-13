import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../Context/useAuth';

const ManagerRoute = ({ children }) => {
    const { user, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }


    if (user && role === 'club_manager') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default ManagerRoute;
