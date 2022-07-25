import React, { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "../constants/routes/auth.routes";
import RecoverPasswordPage from "../containers/RecoverPasswordPage";
import ResetPasswordPage from "../containers/ResetPasswordPage";
import { AuthPage } from "../pages/auth-page";

const useRoutes: FC<any> = () => {
  return (
    <Routes>
      <Route
        path={AuthRoutes.RECOVER_PASSWORD}
        element={<RecoverPasswordPage />}
      />

      <Route
        path={AuthRoutes.RESET_PASSWORD}
        element={<ResetPasswordPage />}
      />

      <Route path={AuthRoutes.AUTH_MAIN} element={<AuthPage />} />

      <Route
        path="/"
        element={<Navigate to={AuthRoutes.AUTH_MAIN} />}
      />
    </Routes>
  );
};

export default useRoutes;
