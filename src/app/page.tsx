"use client";
import PosterSlider from "@/components/HomeComponents/PosterSlider";
import { useRequestMutation } from "@/redux/commonApi";
import Image from "next/image";

export default function Home() {
  const slides = [
    {
      _id: "1",
      title: "Mega Festive Offers",
      description: "Celebrate the season with our biggest discounts yet!",
      image: "/media/login.jpg",
    },
    {
      _id: "2",
      title: "New Arrivals",
      description: "Discover our latest collection and upgrade your style.",
      image: "/media/login.jpg",
    },
    {
      _id: "3",
      title: "Exclusive Deals",
      description: "Limited time offers on top-rated products.",
      image: "/media/login.jpg",
    },
  ];

  return (
    <div>
      {/* <PosterSlssider slides={slides} /> */}
    </div>
  );
}
