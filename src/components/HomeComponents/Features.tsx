import React from "react";
import { BsTruck, BsHeadset, BsBagCheck, BsBoxSeam } from "react-icons/bs";

const featureData = [
  {
    icon: <BsTruck className="text-green-500 text-4xl" />,
    title: "Free Shipping",
    description: "Free shipping on all your orders",
  },
  {
    icon: <BsHeadset className="text-green-500 text-4xl" />,
    title: "Customer Support 24/7",
    description: "Instant access to Support",
  },
  {
    icon: <BsBagCheck className="text-green-500 text-4xl" />,
    title: "100% Secure Payment",
    description: "We ensure your money is safe",
  },
  {
    icon: <BsBoxSeam className="text-green-500 text-4xl" />,
    title: "Money-Back Guarantee",
    description: "30 Days Money-Back Guarantee",
  },
];

const Features = () => {
  return (
    <div className="w-[90%] items-center justify-center px-5 py-4 grid grid-cols-4 gap-5 mt-2  drop-shadow-2xl shadow-black bg-white font-Poppins md:grid-cols-2 md:gap-5 sm:grid-cols-1 sm:gap-7 rounded-2xl">
      {featureData?.map((item) => {
        return (
          <div
            className="flex justify-start items-center gap-5"
            key={item?.title}
          >
            {item?.icon}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-base font-semibold text-gray-800 sm:text-sm">
                {item?.title}
              </h1>
              <p className="opacity-30 text-black text-sm sm:text-xs">
                {item?.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Features;
