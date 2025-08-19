import AddDivision from "@/pages/Admin/AddDivision";
import { AddTour } from "@/pages/Admin/AddTour";
import AddTourType from "@/pages/Admin/AddTourType";
import Analytic from "@/pages/Admin/Analytic";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Analytics",
                url: "/admin/analytics",
                component: Analytic
            }
        ]
    },
    {
        title: "Tour Management",
        items: [
            {
                title: "Add Tour Type",
                url: "/admin/add-tour-type",
                component: AddTourType,
            },
            {
                title: "Add Division",
                url: "/admin/add-division",
                component: AddDivision
            },
            {
                title: "Add Tour",
                url: "/admin/add-tour",
                component: AddTour,
            },

        ],
    }
]
