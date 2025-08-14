import App from "@/App";
import Dashboard from "@/layout/DashboardLayout";
import { generateRoutes } from "@/lib/generateRoutes";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Bookings from "@/pages/User/Bookings";
import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./AdminSidebarItems";

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
    Component: Dashboard,
    children:[...generateRoutes(adminSidebarItems)]
  },
  {
    path: "/user",
    Component: Dashboard,
    children:[
      {
        path:"/user/bookings",
        Component:Bookings
      }
    ]
  }
]);