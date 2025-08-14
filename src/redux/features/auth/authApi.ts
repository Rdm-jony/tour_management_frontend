import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/user/register",
                data: userInfo,
                method: "POST"
            })
        }),
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                data: userInfo,
                method: "POST"
            })
        }),
        sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
            query: (userInfo) => ({
                url: "/otp/send",
                data: userInfo,
                method: "POST"
            })
        }),
        verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
            query: (userInfo) => ({
                url: "/otp/verify",
                data: userInfo,
                method: "POST"
            })
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
            transformResponse:(response)=>response.data
        }),
        logout: builder.mutation<IResponse<null>, null>({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),
    })
})

export const { useRegisterMutation, useLoginMutation, useSendOtpMutation, useVerifyOtpMutation, useUserInfoQuery ,useLogoutMutation} = authApi;