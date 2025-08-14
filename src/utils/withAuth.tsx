import { useUserInfoQuery } from "@/redux/features/auth/authApi";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType,...requiredRole:TRole[]) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);
    console.log(data?.role,requiredRole)

    if (!isLoading && !data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading && !requiredRole.includes(data?.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};