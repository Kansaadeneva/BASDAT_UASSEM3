"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { BottomGradient } from "../misc/bottom-gradient";
import { LabelInputContainer } from "../misc/label-input-container";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("/api/user", null, {
        params: {
          email: data.email,
          fullName: data.fullName,
          password: data.password,
          username: data.username,
        },
      });

      const responseSignin = await axios.post("/api/login", null, {
        params: {
          username: data.username,
          password: data.password,
        },
      });

      if (responseSignin) {
        router.push("/");
        router.refresh();
      }
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

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gradient-to-br from-blue-50 to-purple-100 dark:from-zinc-900 dark:to-zinc-800">
      <h2 className="font-bold text-xl text-blue-800 dark:text-purple-300">
        Signup ke <span className="font-black text-indigo-600">pelelang</span>
      </h2>

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
          <Label htmlFor="firstname">Full name</Label>
          <Input
            id="firstname"
            name="fullName"
            placeholder="Your full name"
            type="text"
            required
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="lastname">Username</Label>
          <Input
            id="lastname"
            name="username"
            placeholder="Your username"
            type="text"
            required
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="example@pelelang.com"
            type="email"
            required
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
        </LabelInputContainer>
        <button
          className={`bg-gradient-to-r from-purple-500 to-indigo-600 block w-full text-white rounded-md h-10 font-medium shadow-md transform transition duration-200 hover:scale-105 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
          <BottomGradient />
        </button>

        <p className="text-gray-700 text-sm max-w-sm mt-5 text-center dark:text-gray-400">
          Already have an account?{" "}
          <Link href={"/signin"} className="font-bold text-indigo-500 hover:underline">
            Sign In.
          </Link>
        </p>
        <div className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-8 h-[1px] w-full" />
        <div className="flex flex-col space-y-4">
          <button
            className="relative flex space-x-2 items-center justify-center px-4 w-full text-black bg-white dark:bg-gray-900 rounded-md h-10 font-medium shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            type="button"
            onClick={() => {
              console.log("Google sign in clicked");
            }}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Sign up with Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}