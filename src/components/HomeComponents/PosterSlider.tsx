"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { Skeleton } from "antd";
import { MainSliderData } from "@/interfaces/commonInterace";

interface PosterSliderProps {
  slides: MainSliderData[];
  isLoading?: boolean;
}

const PosterSlider: React.FC<PosterSliderProps> = ({ slides, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-4 w-full">
        <Skeleton active avatar paragraph={{ rows: 1 }} className="mb-4" />
        <div className="w-full bg-white p-8 rounded-2xl flex justify-between items-center">
          <div className="w-full">
            {/* <Skeleton.Input active style={{ width: 150, height: 20, marginBottom: 10 }} /> */}
            <Skeleton.Input
              active
              style={{ width: 250, height: 30, marginBottom: 20 }}
            />
            <Skeleton.Button active size="large" style={{ width: 120 }} />
          </div>
          <div className="w-1/2 flex justify-end sm:hidden">
            <Skeleton.Image
              active
              style={{ width: 450, height: 300, borderRadius: 16 }}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      slidesPerView={1}
      loop={slides.length > 1}
      autoplay={{ delay: 5000 }}
      effect="fade"
      pagination={{ clickable: true }}
      navigation
      className="home-slider mt-4"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="w-full bg-white flex items-center justify-between p-8 rounded-2xl">
            <div className="flex flex-col items-start justify-center h-full gap-4 w-1/2 sm:w-full z-10">
              <p className="text-sm text-green-600 uppercase tracking-wide">
                {slide?.title}
              </p>
              <h1 className="text-5xl font-bold text-gray-900 sm:text-3xl">
                {slide?.description}
              </h1>
              <Link
                href="/aboutus"
                className="flex items-center gap-3 justify-center text-white border bg-green-600 rounded-full py-3 px-6 hover:bg-white hover:border-green-600 hover:text-green-600 transition-all sm:py-2 sm:px-4 sm:text-sm"
              >
                Shop now <GoArrowRight className="text-center" />
              </Link>
            </div>
            <div className="w-1/2 h-full flex items-center justify-end sm:hidden">
              <img
                src={slide?.image}
                alt={slide?.title}
                width={450}
                height={400}
                className="object-contain h-full rounded-3xl"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PosterSlider;
