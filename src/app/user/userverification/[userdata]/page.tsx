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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <MdVerifiedUser style={{ fontSize: "32px", color: "white" }} />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1f2937",
            }}
          >
            Verify Your Account
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            We've sent a 6-digit verification code to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <Form.Item
            label="Email Address"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
            style={{
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
            }}
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
                  style={{
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                    border: "none",
                    borderBottom: "2px solid #a5b4fc",
                    borderRadius: "0px",
                    outline: "none",
                    paddingLeft: "36px",
                  }}
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
            style={{
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="otp"
              control={control}
              render={() => (
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    justifyContent: "center",
                  }}
                >
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
                      style={{
                        width: "48px",
                        height: "54px",
                        textAlign: "center",
                        fontSize: "24px",
                        fontWeight: "600",
                        border: "none",
                        borderBottom: errors.otp
                          ? "3px solid #ef4444"
                          : "3px solid #a5b4fc",
                        background: "transparent",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = "3px solid #4f46e5")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = errors.otp
                          ? "3px solid #ef4444"
                          : "3px solid #a5b4fc")
                      }
                    />
                  ))}
                </div>
              )}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              block
              onClick={handleSubmit(onSubmit)}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
              }}
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
        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "12px",
            marginTop: "24px",
            marginBottom: "0",
          }}
        >
          The verification code will expire in 10 minutes
        </p>
      </div>
    </div>
  );
};

export default UserVerification;
