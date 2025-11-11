"use client";
import React, { useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, message } from "antd";
import {
  MdEmail,
  MdLock,
  MdVerifiedUser,
  MdArrowForward,
  MdArrowBack,
} from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";
import CommonButton from "@/components/common/CommonButton";
import { useRouter } from "next/navigation";
import { useRequestMutation } from "@/redux/commonApi";
import { SendOtpAPiResponse } from "@/interfaces/SIgnUp";
import { apis } from "@/redux/apiUrls";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import {
  emailSchema,
  EmailSchemaType,
  otpSchema,
  OtpSchemaType,
  resetSchema,
  ResetSchemaType,
} from "@/schemas/authSchemas";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [request] = useRequestMutation();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const otpInputRefs = useRef([]);

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", id: "" },
  });

  const resetForm = useForm({ resolver: zodResolver(resetSchema) });

  const otpValue = otpForm.watch("otp") || "";

  const sendOtpHandler = async (values: EmailSchemaType) => {
    setLoading(true);
    try {
      const payload = {
        email: values?.email,
      };
      const response: SendOtpAPiResponse = await request({
        url: apis.WITHOUTTOKEN.sendOtp,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        setStep("otp");
        otpForm.setValue("id", response?.data?.id);
        emailForm.setValue("email", response?.data?.email);
        setEmail(response?.data?.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (values: OtpSchemaType) => {
    setLoading(true);
    try {
      const payload = {
        email: emailForm.getValues("email"),
        otp: values?.otp,
        id: values?.id,
        isresetpassword: true,
      };
      const response: CommonApiInterface = await request({
        url: apis.WITHOUTTOKEN.verifyOtp,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        setStep("reset");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordHandler = async (values: ResetSchemaType) => {
    setLoading(true);
    try {
      const payload = {
        email: emailForm.getValues("email"),
        id: otpForm.getValues("id"),
        password: values?.password,
        confirmPassword: values?.confirmPassword,
      };
      const response: CommonApiInterface = await request({
        url: apis.WITHOUTTOKEN.resetPassword,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = otpValue.split("");
    newOtp[index] = value.slice(-1);
    const updatedOtp = newOtp.join("").slice(0, 6);

    otpForm.setValue("otp", updatedOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = otpValue.split("");
      if (!newOtp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        otpForm.setValue("otp", newOtp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      otpForm.setValue("otp", pastedData.padEnd(6, "").slice(0, 6));
      const focusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResendOTP = () => {
    message.info("New OTP sent to your email");
    otpForm.setValue("otp", "");
    otpInputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500  to-green-900 flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/10 -top-[200px] -right-[200px] blur-[60px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -bottom-[150px] -left-[150px] blur-[60px]" />

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-[480px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-900 rounded-[20px] mb-5 shadow-lg shadow-indigo-500/30">
            <RiShieldKeyholeLine className="text-[40px] text-white" />
          </div>
          <h1 className="text-[32px] font-bold text-gray-800 mb-2">
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Verify OTP"}
            {step === "reset" && "Reset Password"}
          </h1>
          <p className="text-gray-600 text-[15px]">
            {step === "email" &&
              "No worries, we'll send you reset instructions"}
            {step === "otp" && "Enter the 6-digit code sent to your email"}
            {step === "reset" && "Create a strong and secure password"}
          </p>
        </div>
        <div className="mb-10">
          <div className="flex justify-between items-center relative mb-3">
            {[1, 2, 3].map((num) => {
              const isActive =
                (step === "email" && num === 1) ||
                (step === "otp" && num === 2) ||
                (step === "reset" && num === 3);
              const isCompleted =
                (step === "otp" && num === 1) || (step === "reset" && num <= 2);

              return (
                <div
                  key={num}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base z-[2] transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-green-500 to-green-900 shadow-lg shadow-indigo-500/40"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? "✓" : num}
                </div>
              );
            })}
            <div className="absolute top-1/2 left-10 right-10 h-[3px] bg-gray-300 -translate-y-1/2 z-[1]">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-900 transition-all duration-300"
                style={{
                  width:
                    step === "email" ? "0%" : step === "otp" ? "50%" : "100%",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>Email</span>
            <span>OTP</span>
            <span>Reset</span>
          </div>
        </div>
        {step === "email" && (
          <form onSubmit={emailForm.handleSubmit(sendOtpHandler)}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<MdEmail className="text-gray-400 text-xl" />}
                    placeholder="Enter your email"
                    size="large"
                    status={emailForm.formState.errors.email ? "error" : ""}
                    className="rounded-xl px-4 py-3 text-[15px] border hover:border-green-800 focus-within:border-green-800"
                    autoFocus={true}
                  />
                )}
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-[13px] mt-1.5">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <CommonButton
              themeType="success"
              size="large"
              htmlType="submit"
              icon={<MdArrowForward />}
              children="Send OTP"
              className="h-[50px] w-full text-base font-semibold rounded-xl flex-1 "
              loading={loading}
              onClick={emailForm.handleSubmit(sendOtpHandler)}
              iconPosition="end"
            />
          </form>
        )}
        {step === "otp" && (
          <form onSubmit={otpForm.handleSubmit(verifyOtpHandler)}>
            <div className="bg-gray-100 p-4 rounded-xl mb-6 text-center">
              <p className="text-sm text-gray-600">
                OTP sent to <strong className="text-gray-900">{email}</strong>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter Verification Code
              </label>
              <Controller
                name="otp"
                control={otpForm.control}
                render={() => (
                  <div className="flex gap-2.5 justify-between mb-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        maxLength={1}
                        value={otpValue[index] || ""}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-14 h-16 text-center text-2xl font-bold rounded-xl hover:border-green-800 focus-within:border-green-800"
                        style={{
                          borderWidth: "2px",
                          borderColor: otpForm.formState.errors.otp
                            ? "#ef4444"
                            : "#d1d5db",
                        }}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                )}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-red-500 text-[13px] mt-1.5">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <CommonButton
                themeType="success"
                size="large"
                icon={<MdArrowBack />}
                onClick={() => {
                  otpForm.setValue("otp", "");
                  otpForm.setValue("id", "");
                  setStep("email");
                }}
                children="Back"
                className="h-[50px] flex-1"
              />
              <CommonButton
                themeType="info"
                size="large"
                htmlType="submit"
                icon={<MdVerifiedUser />}
                children="Verify"
                className="h-[50px] text-base font-semibold rounded-xl flex-1 "
                loading={loading}
                onClick={otpForm.handleSubmit(verifyOtpHandler)}
                iconPosition="end"
              />
            </div>

            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Didn't receive code?{" "}
              </span>
              <Button
                type="link"
                onClick={handleResendOTP}
                className="p-0 font-semibold text-sm"
              >
                Resend OTP
              </Button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetForm.handleSubmit(resetPasswordHandler)}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <Controller
                name="password"
                control={resetForm.control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<MdLock className="text-gray-400 text-xl" />}
                    placeholder="Enter new password"
                    size="large"
                    status={resetForm.formState.errors.password ? "error" : ""}
                    className="rounded-xl px-4 py-3 text-[15px] hover:border-green-800 focus-within:border-green-800"
                    autoFocus
                  />
                )}
              />
              {resetForm.formState.errors.password && (
                <p className="text-red-500 text-[13px] mt-1.5">
                  {resetForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <Controller
                name="confirmPassword"
                control={resetForm.control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<MdLock className="text-gray-400 text-xl" />}
                    placeholder="Confirm your password"
                    size="large"
                    status={
                      resetForm.formState.errors.confirmPassword ? "error" : ""
                    }
                    className="rounded-xl px-4 py-3 text-[15px] hover:border-green-800 focus-within:border-green-800"
                  />
                )}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-[13px] mt-1.5">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="primary"
              onClick={resetForm.handleSubmit(resetPasswordHandler)}
              loading={loading}
              block
              htmlType="submit"
              size="large"
              icon={<MdArrowForward />}
              iconPosition="end"
              className="h-[50px] text-base font-semibold rounded-xl shadow-lg shadow-indigo-500/40"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
              }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
