import App from "@/App";
import Dashboard from "@/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";
import { userSidebarItems } from "./userSidebarItems";
import { adminSidebarItems } from "./adminSidebarItems";
import  { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import Unauthorized from "@/pages/Unauthorized";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    path: "/register",
    Component: Register
  },
  {
    path: "/login",
    Component: Login
  },
  {
    path: "/verify",
    Component: Verify
  },
  {
    path: "/admin",
    Component: withAuth(Dashboard,role.admin as TRole, role.superAdmin as TRole),
    children:[...generateRoutes(adminSidebarItems)]
  },
  {
    path: "/user",
    Component: withAuth(Dashboard,role.user as TRole),
    children:[...generateRoutes(userSidebarItems)]
  },
 {
  path:"/unauthorized",
  Component:Unauthorized
 }
]);