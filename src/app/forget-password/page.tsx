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
import { useResetPasswordOtpMutation, useResetPasswordSendOtpMutation } from "@/redux/api/baseApi";



export default function LoginPage() {
  const router = useRouter();

  const [sendEmailMutation] = useResetPasswordSendOtpMutation();
    const [verificationMutation] =useResetPasswordOtpMutation();
  const [toggleLoginCode, setToggleResetPasswordCode] = useState(false);
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
 
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email ) {
      setError("Please enter password");
      return;
    }
    const data = { email };
    const res = await sendEmailMutation(data);
    if (res.error) {
      setError("Invalid email ");
    }
  console.log("otp res",res);
    if (res.data?.success) {
      setUserEmail(email);
      setToggleResetPasswordCode(true);
      setError("");
    }
  };
  const handleVerificationCodeSubmit =async (e: any) => {
    e.preventDefault();
    console.log("Verification code submitted:", verificationCode.join(""));
    if (verificationCode.join("").length < 6) {
      console.log(verificationCode);
      setError("Please enter a valid 6-digit code");
      return;
    }
    const code = Number(verificationCode.join(""));
    console.log(isNaN(code));
    if (isNaN(code)) {
      setError("Please enter a valid 6-digit code. (Only numbers)");
      return;
    }
  const res =await verificationMutation({ email:userEmail,oneTimeCode:code }).unwrap();
  console.log(res.data.data);
 
  if(res?.data?.data){
    Cookies.set("resetToken", res?.data?.data, {
      expires: 7
    });
    router.push("/reset-password");
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
             reset password by email verifia
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

      

              <Button
                type="submit"
                className="w-full bg-slate-500 hover:bg-slate-600 text-white font-semibold text-lg "
              >
           Send Code to Email
              </Button>
            </form>
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

          <div className={`p-8 ${toggleLoginCode ? "" : "hidden"}`}>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Enter 6-digit verification code
            </h2>

            <form
              onSubmit={(e) => handleVerificationCodeSubmit(e)}
              className="space-y-4"
            >
              <div className="flex justify-between gap-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <Input
                    key={i}
                    className="w-12 h-12 text-center text-lg font-bold"
                    maxLength={1}
                    value={verificationCode[i]}
                    onChange={(e) => {
                      const newCode = [...verificationCode];
                      newCode[i] = e.target.value;
                      setVerificationCode(newCode);

                      // Auto-focus next input when digit is entered
                      if (
                        e.target.value &&
                        e.target.nextElementSibling instanceof HTMLInputElement
                      ) {
                        e.target.nextElementSibling.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (
                        e.key === "Backspace" &&
                        !e.currentTarget.value &&
                        e.currentTarget.previousElementSibling instanceof
                          HTMLInputElement
                      ) {
                        e.currentTarget.previousElementSibling.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-500 hover:bg-slate-600 text-white font-semibold text-lg"
              >
                Verify
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
