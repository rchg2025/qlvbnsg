// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../utils/decode';

const ProtectedRoute = () => {
    
    return isAdmin() ? <Outlet /> : <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;
