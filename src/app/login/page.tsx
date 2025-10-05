"use client";
import MasterLayout from "@/components/MasterLyout";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { useState } from "react";
import {
  SignInPayload,
  SignInResponseAPIData,
} from "@/interfaces/SignInInterface";
import CommonInput from "@/components/common/CommonInput";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestMutation } from "@/redux/commonApi";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [request] = useRequestMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response: SignInResponseAPIData = await request({
        url: "/signin",
        method: "POST",
        body: data,
      }).unwrap();

      if (response?.success) {
        router.push("/");
        localStorage.setItem("user", JSON.stringify(response?.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="font-Poppins relative w-full h-screen">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/media/login.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
        <div className="w-full max-w-md rounded-lg bg-black/30 backdrop-blur-md p-8 border border-white/20 text-white shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Sign In</h2>
          <p className="text-sm mb-6 text-white/80">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold hover:underline text-green-400"
            >
              Create a free account
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <CommonInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="Email"
              required
              {...register("email")}
              errorMessage={errors?.email?.message || ""}
            />
            <CommonInput
              id="password"
              label="Password"
              placeholder="Password"
              required
              {...register("password")}
              isForgate={true}
              errorMessage={errors?.password?.message || ""}
              isPassword={true}
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-green-600/90 hover:bg-green-500 transition-colors font-semibold text-white text-lg"
            >
              Sign In <GoArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
