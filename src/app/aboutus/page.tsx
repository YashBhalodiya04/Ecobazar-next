"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Skeleton } from "antd";
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
      <div className="w-full flex flex-col px-4 md:px-10 lg:px-20 mt-10">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={18}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>
          <Col xs={24} md={6}>
            <Skeleton.Image
              active
              style={{ width: "100%", height: 300, borderRadius: 16 }}
            />
          </Col>
        </Row>
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Skeleton.Image
              active
              style={{ width: "100%", height: 300, borderRadius: 16 }}
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
              style={{ width: "100%", height: 300, borderRadius: 16 }}
            />
          </Col>
        </Row>
      </div>
    );
  }

  // ✅ Actual Responsive Content
  return (
    <div className="w-full flex flex-col gap-16 px-4 md:px-10 lg:px-20 mt-10 font-Poppins text-black">
      {/* SECTION 1 */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Text */}
        <div className="flex-1 flex flex-col justify-center items-start gap-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-center lg:text-left">
            100% Trusted <br className="hidden sm:block" /> Organic Food Store
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:w-[550px] text-center lg:text-left">
            We are committed to providing farm-fresh organic produce and
            sustainable grocery essentials. Every product we offer is carefully
            sourced from trusted farms that follow ethical and eco-friendly
            practices. Our goal is to make healthy eating simple, accessible,
            and enjoyable for everyone.
          </p>
        </div>
        {/* Image */}
        <div className="flex-1 w-full">
          <img
            src="/media/about/aboutPhoto1.svg"
            alt="About Us"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Image */}
        <div className="flex-1 w-full order-2 lg:order-1">
          <img
            src="/media/about/aboutPhoto2.svg"
            alt="Our Mission"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        {/* Text + Features */}
        <div className="flex-1 flex flex-col items-start justify-center gap-4 order-1 lg:order-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-center lg:text-left">
            We Grow with Passion <br className="hidden sm:block" /> and Deliver
            with Care
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:w-[550px] text-center lg:text-left">
            From seed to shelf, we take pride in maintaining the highest
            standards of quality. Our partnerships with local farmers help us
            ensure that each item you receive is naturally grown, freshly
            harvested, and full of nutrition. With a focus on sustainability, we
            bring nature’s best directly to your table.
          </p>

          {/* Features Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {features.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-[55px] h-[55px] flex items-center justify-center bg-green-100 rounded-full shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col items-start">
                  <h2 className="text-base font-medium">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Text */}
        <div className="flex-1 flex flex-col justify-between items-start gap-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-center lg:text-left">
            We Deliver, You Enjoy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:w-[550px] text-center lg:text-left">
            Our logistics team ensures that every order is delivered fresh, on
            time, and in perfect condition. Whether you’re shopping for daily
            groceries or planning a weekend feast, our reliable delivery service
            brings organic goodness right to your doorstep. Freshness and flavor
            — guaranteed in every bite.
          </p>
        </div>
        {/* Image */}
        <div className="flex-1 w-full">
          <img
            src="/media/about/aboutPhoto3.svg"
            alt="Delivery"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
