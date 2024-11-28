"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { BottomGradient } from "../misc/bottom-gradient";
import { LabelInputContainer } from "../misc/label-input-container";
import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  };
}
export default function ProfileForm({ userData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.put("/api/user", null, {
        params: {
          email: data.email,
          fullName: data.fullName,
          password: data.password,
          username: data.username,
        },
      });

      await axios.post("/api/login", null, {
        params: {
          username: data.username,
          password: data.password,
        },
      });

      router.refresh();
      console.log("Registration successful:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to register");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete("/api/user", {
        params: {
          username: userData.username,
        },
      });

      const responseLogout = await axios.post("/api/logout", null, {});
      console.log(responseLogout);

      console.log("Account deleted successfully:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to delete account");
      } else {
        setError("An unexpected error occurred while deleting the account");
      }
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  const handleSignout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const responseLogout = await axios.post("/api/logout", null, {});
      console.log(responseLogout);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to delete account");
      } else {
        setError("An unexpected error occurred while deleting the account");
      }
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      router.push("/signin");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gradient-to-r from-blue-500 to-purple-600">
      <h2 className="font-bold text-xl text-white">Profile Anda</h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="firstname" className="text-white">
            Full name
          </Label>
          <Input
            id="firstname"
            name="fullName"
            placeholder="Mohammad Rizaldy"
            type="text"
            required
            defaultValue={userData.fullName}
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="lastname" className="text-white">
            Username
          </Label>
          <Input
            id="lastname"
            name="username"
            placeholder="mozaldy"
            type="text"
            required
            value={userData.username}
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="moxaldy@pelelang.com"
            type="email"
            required
            defaultValue={userData.email}
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            required
            defaultValue={userData.password}
            disabled={isLoading}
          />
        </LabelInputContainer>
        <button
          className={`bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white block w-full rounded-md h-10 font-medium transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="border border-red-500 bg-gradient-to-r from-red-500 to-pink-500 text-white"
            onClick={handleSignout}
          >
            Sign Out
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-black">
                  Are you sure you want to delete your account?
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
