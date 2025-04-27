/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import {
  useUserLoginMutation,
  useVerifyLoginMutation,
} from "@/redux/api/baseApi";

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [loginMutation] = useUserLoginMutation();
  const [verificationMutation] = useVerifyLoginMutation();
  const [toggleLoginCode, setToggleLoginCode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    const data = { email, password };
    const res = await loginMutation(data);
    if (res.error) {
      setError("Invalid email or password");
    }
    console.log("login response");
    console.log(res.data);

    if (res?.data?.data?.accessToken) {
      Cookies.set("accessToken", res?.data?.data?.accessToken, {
        expires: 7,
      });
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white">
        <div className=" dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className={`p-8 ${toggleLoginCode ? "hidden" : ""}`}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold">Document Manager</h1>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-center">
              Log in to your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-500 hover:bg-slate-600 text-white font-semibold text-lg "
              >
                Log in
              </Button>
            </form>
            <div className="text-blue-500 underline  cursor-pointer flex justify-end">
              <Link href={"/forget-password"}>forget password</Link>{" "}
            </div>
          </div>

          <div
            className={`flex justify-center mb-6 ${
              toggleLoginCode ? "" : "hidden"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl py-5 font-bold">Verification</h1>
            </div>
          </div>
          <div>
            <p className="text-red-400 mx-auto text-lg px-4 font-medium">
              {error}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
