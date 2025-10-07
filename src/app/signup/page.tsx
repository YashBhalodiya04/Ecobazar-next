"use client";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { useRequestMutation } from "@/redux/commonApi";
import { signupSchema, SignUpSchemaType } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";

const SignupPage = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      const response: CommonApiInterface = await request({
        url: "/signup",
        method: "POST",
        body: data,
      }).unwrap();

      if (response?.success) {
        router.push("/login");
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <CommonLoader loading={isLoading} />
      <div className="w-full font-Poppins">
        <div
          className="w-full grid place-items-center relative place-content-center h-screen bg-auto bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/media/signupimage.jpg')",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 opacity-45"></div>

          <div className="w-[500px] sm:w-full sm:py-5 md:w-[400px] md:px-11 md:py-4 flex items-center justify-center sm:px-6 rounded-lg lg:px-14 lg:py-5 text-white/75 backdrop-blur-sm z-30 border">
            <div className="w-full">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Sign Up
              </h2>

              <p className="mt-2 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold hover:underline text-green-400"
                >
                  Sign In
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="space-y-5">
                  <CommonInput
                    id="name"
                    label="Full Name"
                    type="text"
                    placeholder="Enter your name"
                    {...register("name")}
                    errorMessage={errors.name?.message}
                  />

                  <CommonInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    errorMessage={errors.email?.message}
                  />

                  <CommonInput
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    {...register("phone")}
                    errorMessage={errors.phone?.message}
                    maxLength={10}
                  />

                  <CommonInput
                    id="password"
                    label="Password"
                    placeholder="Enter password"
                    {...register("password")}
                    errorMessage={errors.password?.message}
                    isPassword={true}
                  />

                  <CommonInput
                    id="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    errorMessage={errors.confirmPassword?.message}
                    isPassword={true}
                  />

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600/80 px-3.5 py-2.5 font-semibold leading-7 text-white"
                  >
                    Create Account <GoArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
