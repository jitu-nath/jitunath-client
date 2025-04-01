/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/redux/api/baseApi";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMutation] = useChangePasswordMutation();
  const handleUpdatePassword = async () => {
    console.log({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    const res: any = await passwordChangeMutation({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    console.log(res);
    if (res?.data) {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.location.href = "/settings";
    }
    console.log(res.error);
    if (res?.error) {
      toast.error(res.error.data.message || "Failed to change password!");
    }
  };

  return (
    <MainLayout title="Change Password" showBackButton>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex  justify-end">
            <Button
              className="bg-black text-white"
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
