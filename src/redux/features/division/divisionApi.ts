import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IDivision } from "@/types/division.type";

export const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        AddDivision: builder.mutation<IResponse<IDivision>,FormData>({
            query: (divisionInfo) => ({
                url: "/division/create",
                method: "POST",
                data: divisionInfo,
            }),
            invalidatesTags: ["DIVISION"]
        }),
        getDivision: builder.query({
            query: () => ({
                url: "/division",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["DIVISION"]
        }),
        removeDivision: builder.mutation({
            query: (divisionId) => ({
                url: `/division/${divisionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DIVISION"]
        }),

    }),
});

export const { useGetDivisionQuery,useAddDivisionMutation,useRemoveDivisionMutation } = divisionApi;