import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR"]
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/tour-types",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["TOUR"]
    }),
    removeTourType: builder.mutation({
      query: (tourTypeId) => ({
        url: `/tour/tour-types/${tourTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TOUR"]
    }),
    addTour: builder.mutation<IResponse<null>,FormData>({
      query: (tourInfo) => ({
        url: `/tour/create`,
        method: "POST",
        data:tourInfo
      }),
    }),
    

  }),
});

export const { useGetTourTypesQuery, useAddTourTypeMutation,useRemoveTourTypeMutation,useAddTourMutation} = tourApi;