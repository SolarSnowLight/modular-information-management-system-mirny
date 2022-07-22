import React from "react";
import Typography from '@mui/material/Typography';
import './auth-page.css';
import { AuthForm } from "./auth-form";

export const AuthPage: React.FC = () => {
    return (
        <div className="auth-page">
            <AuthForm/>
        </div>
    )
}