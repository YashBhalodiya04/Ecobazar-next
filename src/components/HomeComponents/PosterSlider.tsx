"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

interface PosterSliderProps {
  slides: {
    _id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

const PosterSlider: React.FC<PosterSliderProps> = ({ slides }) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 5000 }}
      effect="fade"
      pagination={{ clickable: true }}
      navigation
      className="w-full h-[70vh]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide._id}>
          <div className="w-full flex items-center  p-4 h-[300px] ">
            <div className="flex flex-col items-start justify-center h-full gap-3 relative z-10">
              <p className="text-[10px] text-green-600 sm:text-sm ">
                {slide.title}
              </p>
              <h1 className="text-5xl font-bold  sm:text-3xl">
                {slide.description}
              </h1>
              <Link
                href={"/shop"}
                className="flex items-center gap-3 justify-center text-white  border bg-green-600 rounded-full py-3 px-6 hover:bg-white hover:border-green-400 hover:text-green-500 sm:py-2 sm:px-3 sm:text-sm"
              >
                Shop now <GoArrowRight className="text-center" />
              </Link>
            </div>
            <div className="w-full absolute top-0 right-48 h-full sm:right-0 md:right-10">
              <img
                src={slide.image}
                alt=""
                width={450}
                height={300}
                className="float-right"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PosterSlider;
