"use client";

import React, { useEffect, useState } from "react";
import { Col, Row, Skeleton } from "antd";
import {
  FaLeaf,
  FaHeadset,
  FaStar,
  FaShoppingBag,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";

const AboutUsPage = () => {
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <FaLeaf className="text-green-600 text-3xl" />,
      title: "100% Organic Food",
      desc: "Fresh produce grown without harmful chemicals or preservatives.",
    },
    {
      icon: <FaHeadset className="text-green-600 text-3xl" />,
      title: "24/7 Support",
      desc: "Our team is always ready to assist you with your orders and queries.",
    },
    {
      icon: <FaStar className="text-green-600 text-3xl" />,
      title: "Customer Feedback",
      desc: "Thousands of satisfied customers who trust our quality and service.",
    },
    {
      icon: <FaShoppingBag className="text-green-600 text-3xl" />,
      title: "Secure Payment",
      desc: "Safe and encrypted payment options for a seamless checkout experience.",
    },
    {
      icon: <FaTruck className="text-green-600 text-3xl" />,
      title: "Free Shipping",
      desc: "Fast and free delivery straight to your doorstep on all orders.",
    },
    {
      icon: <FaBoxOpen className="text-green-600 text-3xl" />,
      title: "Fresh Packaging",
      desc: "Eco-friendly packaging designed to keep your food fresh and safe.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col px-20 sm:px-6 mt-10">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={18}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>
          <Col xs={24} md={6}>
            <Skeleton.Image
              active
              style={{ width: 450, height: 300, borderRadius: 16 }}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Skeleton.Image
              active
              style={{ width: 450, height: 300, borderRadius: 16 }}
            />
          </Col>
          <Col xs={24} md={17}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>
        </Row>

        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={18}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>

          <Col xs={24} md={6}>
            <Skeleton.Image
              active
              style={{ width: 450, height: 300, borderRadius: 16 }}
            />
          </Col>
        </Row>
      </div>
    );
  }

  // ✅ Actual Content
  return (
    <div className="w-full flex flex-col items-start justify-between overflow-y-auto custom-scrollbar bg-white text-gray-900">
      <div className="w-full flex flex-col justify-between items-start gap-16 px-20 sm:px-6 mt-10 font-Poppins">
        {/* SECTION 1 */}
        <div className="w-full flex sm:flex-col md:flex-col justify-between items-center gap-10">
          <div className="sm:block md:block hidden w-full">
            <img
              src="/media/about/aboutPhoto1.svg"
              alt="About Us"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="w-full flex flex-col justify-center items-start gap-4">
            <h1 className="text-5xl sm:text-3xl font-semibold leading-tight">
              100% Trusted <br /> Organic Food Store
            </h1>
            <p className="md:w-[550px] text-gray-600">
              We are committed to providing farm-fresh organic produce and
              sustainable grocery essentials. Every product we offer is
              carefully sourced from trusted farms that follow ethical and
              eco-friendly practices. Our goal is to make healthy eating simple,
              accessible, and enjoyable for everyone.
            </p>
          </div>
          <div className="sm:hidden md:hidden block w-full">
            <img
              src="/media/about/aboutPhoto1.svg"
              alt="About Us"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="w-full flex sm:flex-col md:flex-col justify-between items-center gap-10">
          <div className="w-full">
            <img
              src="/media/about/aboutPhoto2.svg"
              alt="Our Mission"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-4">
            <h1 className="text-5xl sm:text-3xl font-semibold leading-tight">
              We Grow with Passion <br /> and Deliver with Care
            </h1>
            <p className="md:w-[550px] text-gray-600">
              From seed to shelf, we take pride in maintaining the highest
              standards of quality. Our partnerships with local farmers help us
              ensure that each item you receive is naturally grown, freshly
              harvested, and full of nutrition. With a focus on sustainability,
              we bring nature’s best directly to your table.
            </p>

            {/* FEATURES GRID */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-1 gap-6 mt-4">
              {features.map((item, i) => (
                <div key={i} className="flex items-center justify-start gap-4">
                  <div className="w-[60px] h-[60px] flex items-center justify-center bg-green-100 rounded-full">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <h2 className="text-base font-medium">{item.title}</h2>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="w-full flex sm:flex-col md:flex-col justify-between items-center gap-10">
          <div className="w-full flex flex-col justify-between items-start gap-4">
            <div className="sm:block md:block hidden w-full">
              <img
                src="/media/about/aboutPhoto3.svg"
                alt="Delivery"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <h1 className="text-5xl sm:text-3xl font-semibold leading-tight">
              We Deliver, You Enjoy
            </h1>
            <p className="md:w-[550px] text-gray-600">
              Our logistics team ensures that every order is delivered fresh, on
              time, and in perfect condition. Whether you’re shopping for daily
              groceries or planning a weekend feast, our reliable delivery
              service brings organic goodness right to your doorstep. Freshness
              and flavor — guaranteed in every bite.
            </p>
          </div>
          <div className="sm:hidden md:hidden block w-full">
            <img
              src="/media/about/aboutPhoto3.svg"
              alt="Delivery"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
