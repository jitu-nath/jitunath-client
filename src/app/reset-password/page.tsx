/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useResetPasswordTokenMutation } from "@/redux/api/baseApi";

import { useRouter } from "next/navigation";
const Page = () => {
  const token = Cookies.get("resetToken");
  if (!token) {
    //    window.location.href = "/login";
  }

  console.log(token, "token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordMutation] = useResetPasswordTokenMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setError("Passwords do not match!");
      return;
    }
    const data = {
      token,
      newPassword: password,
      confirmPassword: confirmPassword,
    };
    const res: any = await resetPasswordMutation(data);
    console.log(res, "res");
    if (res?.data?.success) {
      toast.success("Password reset successfully");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
      setSuccess(true);
    }
    if (res.error) {
      toast.error("Password reset failed");

      setError(res.error.data.message);
    }
    // Log the passwords to console as requested
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // In a real application, you would make an API call here to reset the password
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

        {success ? (
          <div className="text-center text-green-600 mb-4">
            Password reset successful!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Page;
