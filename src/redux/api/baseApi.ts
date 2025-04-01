// Need to use the React-specific entry point to import createApi
import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["document"],

  endpoints: (builder) => ({
    createDocument: builder.mutation({
      query: (data) => ({
        url: `document`,
        method: "POST",
        body: data,
        invalidatesTags: ["document"],
      }),
    }),
    getDocuments: builder.query({
      query: () => `document`,
      providesTags: ["document"],
    }),
    updateDocument: builder.mutation({
      query: ({ id, ...data }) => {
      
        return {
          url: `document/${id}`,
          method: "PATCH",
          body: data,
          invalidatesTags: ["document"],
        };
      },
    }),
    getSingleDocument: builder.query({
      query: (id) => `document/${id}`,
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `document/${id}`,
        method: "DELETE",
        invalidatesTags: ["document"],
      }),
    }),
    userLogin: builder.mutation({
      query: (data) => ({
        url: `user/login`,
        method: "POST",
        body: data,
      }),
    }),
    verifyLogin: builder.mutation({
      query: (data) => ({
        url: `user/verify-login`,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `user/change-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordOtp: builder.mutation({
      query: (data) => ({
        url: `user/verify-email`,
        method: "POST",
        body: data,
      }),
    }),

    resetPasswordToken: builder.mutation({
      query:(data)=>{
        return {
          url: `user/reset-password`,
          method: "POST",
          body: data,
        };
      }
    }),

    resetPasswordSendOtp: builder.mutation({
      query: (data) => ({
        url: `user/reset-password-otp`,
        method: "POST",
        body: data,
      })
    }),


  })
  
});

export const {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetSingleDocumentQuery,
  useUserLoginMutation,
  useVerifyLoginMutation,
  useChangePasswordMutation,
  useResetPasswordOtpMutation,
  useResetPasswordTokenMutation,
  useResetPasswordSendOtpMutation,
} = baseApi;
