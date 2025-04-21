import react from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

export const VerifyUser = ()=>{
    const {authUser} = useAuth();
    return authUser ? <Outlet /> : <Navigate to='/login' />
}