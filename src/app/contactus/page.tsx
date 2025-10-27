"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import { ContactEmailPayload } from "@/interfaces/commonInterace";
import { SignInResponseAPIData } from "@/interfaces/SignInInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { ContactFormData, contactSchema } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactUsPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const sendEmail = async (data: ContactFormData) => {
    try {
      console.log("Form Data:", data);
      const payload: ContactEmailPayload = {
        email: data?.aboutemail,
        message: data?.description,
      };
      const response: SignInResponseAPIData = await request({
        url: apis.AUTH.contactus,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        reset();
      }
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };
  return (
    <>
      <CommonLoader loading={isLoading} />

      <div className="w-full flex flex-col justify-between items-start gap-12 font-Poppins bg-white text-gray-800">
        <div className="w-full grid grid-cols-about sm:grid-cols-1 md:grid-cols-aboutmid place-content-start gap-16 px-64 sm:px-8 md:px-6 mt-10">
          <div className="w-full h-full px-6 py-8 flex flex-col items-center justify-between gap-6 bg-gray-50 shadow-md rounded-xl border border-gray-200">
            <div className="w-full flex flex-col items-center justify-center gap-2 border-b pb-5">
              <FaMapMarkerAlt className="text-green-600 text-3xl" />
              <p className="text-sm text-center leading-relaxed">
                201, Swastik Society, Naranpura, Ahmedabad
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-2 border-b pb-5">
              <MdEmail className="text-green-600 text-3xl" />
              <p className="text-sm text-center">
                XYZ@gmail.com <br /> Sample@gmail.com
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <FaPhoneAlt className="text-green-600 text-3xl" />
              <p className="text-sm text-center">
                +91-000000000 <br /> +91-999999999
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col items-start justify-between gap-4 bg-gray-50 shadow-md border border-gray-200 px-6 py-6 rounded-xl">
            <h1 className="font-semibold text-2xl text-gray-900">
              Just Say Hello!
            </h1>
            <p className="w-3/4 text-sm sm:w-full text-gray-600">
              Want to say hi or start your project with us? Feel free to reach
              out — we’d love to hear from you.
            </p>

            <div className="w-full h-full flex items-center justify-center">
              <form
                ref={formRef}
                onSubmit={handleSubmit(sendEmail)}
                className="w-full flex flex-col items-center justify-center gap-4"
              >
                <CommonInput
                  id="aboutemail"
                  label="Your Email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("aboutemail")}
                  errorMessage={errors.aboutemail?.message}
                  className="!placeholder-gray-400 !border-gray-500 !text-black"
                  labelClassName="!text-black"
                  required
                />
                <CommonInput
                  id="description"
                  label="Message"
                  type="text"
                  placeholder="Type your message..."
                  {...register("description")}
                  errorMessage={errors.description?.message}
                  labelClassName="!text-black"
                  className="!placeholder-gray-400 !border-gray-500 !text-black"
                  required
                  istexarea
                />
                <button
                  type="submit"
                  className="w-1/3 rounded-lg py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition-all duration-200"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full h-[300px] px-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.568060525836!2d72.55975347521209!3d23.03962657916187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848b5c490c6b%3A0xf14b0795bcd3f161!2sPolaris%20Building%2C%20Swastik%20Society%20Cross%20Rd%2C%20Swastik%20Society%2C%20Navrangpura%2C%20Ahmedabad%2C%20Gujarat%20380009!5e0!3m2!1sen!2sin!4v1712770113368!5m2!1sen!2sin"
            className="w-full h-full rounded-lg border border-gray-200"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
