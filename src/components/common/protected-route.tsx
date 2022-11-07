import { Navigate, Outlet } from "react-router-dom";
import React from "react";

type Props = {
    isAllowed: boolean;
    redirectPath?: string;
    children: any;
};

function ProtectedRoute({ isAllowed, redirectPath = "/landing", children }: Props) {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }
    return children || <Outlet />;
}

export default ProtectedRoute;
