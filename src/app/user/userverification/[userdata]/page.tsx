"use client";
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdEmail, MdVerifiedUser } from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
import { Toast } from "@/components/common/toastUtils";
import { useParams, useRouter } from "next/navigation";
import encryptDecryptUtil from "@/lib/encrypt-decrypt-utils";
import { useRequestMutation } from "@/redux/commonApi";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  id: z.string().nonempty("User ID is required"),
});

const UserVerification = () => {
  const router = useRouter();
  const params = useParams();
  const { userdata } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [request, { isLoading }] = useRequestMutation();
  const otpInputRefs = useRef([]);
  const encryptedValue = Array.isArray(userdata) ? userdata[0] : userdata;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
      id: "",
    },
  });

  useEffect(() => {
    if (!encryptedValue) {
      router.push("/login");
      return;
    }

    try {
      const safeValue = decodeURIComponent(encryptedValue).replace(/ /g, "+");
      const decrypted = encryptDecryptUtil.decryptJSData(safeValue);
      setValue("email", decrypted?.email);
      setValue("id", decrypted?.id);
    } catch (error) {
      router.push("/login");
      return;
    }
  }, [encryptedValue]);

  const otpValue = watch("otp") || "";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
        id: data.id,
      };
      const response: CommonApiInterface = await request({
        url: apis.WITHOUTTOKEN.verifyOtp,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    Toast.info("New OTP sent to your email");
    setValue("otp", "");
    otpInputRefs.current[0]?.focus();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = otpValue.split("");
    newOtp[index] = value.slice(-1);
    const updatedOtp = newOtp.join("").slice(0, 6);

    setValue("otp", updatedOtp);

    // Auto-focus next input
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
        setValue("otp", newOtp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      setValue("otp", pastedData.padEnd(6, "").slice(0, 6));
      const focusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500  to-green-900 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500  to-green-900  rounded-full mb-4">
            <MdVerifiedUser style={{ fontSize: "32px", color: "white" }} />
          </div>
          <h1 className="text-[28px] font-bold mb-2 text-[#1f2937]">
            Verify Your Account
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            We've sent a 6-digit verification code to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email Address"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
            className="mb-6 flex flex-col"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MdEmail style={{ color: "#9ca3af" }} />}
                  size="large"
                  disabled
                  className="bg-gray-100 cursor-not-allowed border-0 border-b-2 border-indigo-300 rounded-none outline-none pl-9"
                  onFocus={(e) =>
                    (e.target.style.borderBottom = "2px solid #4f46e5")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottom = errors.email
                      ? "2px solid #ef4444"
                      : "2px solid #a5b4fc")
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Enter Verification Code"
            validateStatus={errors.otp ? "error" : ""}
            help={errors.otp?.message}
            className="mb-6 flex flex-col"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="otp"
              control={control}
              render={() => (
                <div className="flex gap-4 justify-center">
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
                      className={`w-12 h-[54px] text-center text-2xl font-semibold border-0 border-b-4 ${
                        errors.otp ? "border-red-500" : "border-green-900"
                      } bg-transparent outline-none transition-colors duration-300 hover:border-green-600 focus-within:border-green-600`}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = "3px solid #16a34a")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = errors.otp
                          ? "3px solid #ef4444"
                          : "3px solid #14532d")
                      }
                    />
                  ))}
                </div>
              )}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              size="large"
              htmlType="submit"
              loading={loading}
              block
              onClick={handleSubmit(onSubmit)}
              className="
  h-[50px] text-base font-semibold rounded-xl 
  shadow-lg shadow-indigo-500/40 
  bg-gradient-to-br from-green-600 to-green-900 border-0 
  !text-black
  hover:!bg-green-700
  transform transition-all duration-300 ease-out
  hover:scale-[1.04] hover:shadow-xl 
  active:scale-[0.97]
"
            >
              Verify Account
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Didn't receive the code?{" "}
            </span>
            {/* <Button
              type="link"
              onClick={handleResendOTP}
              icon={<AiOutlineReload />}
              style={{ padding: "0", fontWeight: "600" }}
            >
              Resend OTP
            </Button> */}
          </div>
        </form>
        <p className="text-center text-[#9ca3af] text-xs mt-6 mb-0">
          The verification code will expire in 10 minutes
        </p>
      </div>
    </div>
  );
};

export default UserVerification;
