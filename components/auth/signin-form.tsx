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

export default function SigninForm() {
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
      const response = await axios.post("/api/login", null, {
        params: {
          username: data.username,
          password: data.password,
        },
      });
      if (response) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("Username not found");
        } else if (error.response?.status === 401) {
          setError("Incorrect password");
        } else {
          setError(error.response?.data?.error || "Login failed");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <h2 className="font-bold text-2xl text-white text-center">
        Welcome Back to <span className="font-black text-yellow-300">Pelelang</span>
      </h2>

      {error && (
        <div
          className="bg-red-500 text-white px-4 py-3 rounded-lg mt-4 shadow-md"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-6">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="Enter your username"
            type="text"
            required
            disabled={isLoading}
            className="border-2 border-yellow-300 focus:ring-yellow-500"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-6">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
            className="border-2 border-yellow-300 focus:ring-yellow-500"
          />
        </LabelInputContainer>
        <button
          className={`bg-gradient-to-r from-yellow-400 to-red-500 text-white font-semibold w-full py-2 rounded-lg shadow-md transform transition-transform ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-white text-sm mt-4 text-center">
          No account yet?{" "}
          <Link href={"/signup"} className="font-bold underline">
            Sign up.
          </Link>
        </p>
        <div className="bg-gradient-to-r from-transparent via-white to-transparent my-8 h-[1px] w-full" />
        <button
          className="relative flex items-center justify-center w-full py-2 text-black bg-white rounded-lg shadow-lg hover:bg-gray-100"
          type="button"
          onClick={() => console.log("Google sign in clicked")}
        >
          <IconBrandGoogle className="h-5 w-5 text-red-500 mr-2" />
          <span className="font-semibold">Sign in with Google</span>
        </button>
      </form>
    </div>
  );
}