import { Card, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsCart3, BsHeart, BsStarFill } from "react-icons/bs";

export interface CommonProductList {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}

const CommonProductCard = ({ item }: { item: CommonProductList }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const router = useRouter();
  return (
    <>
      <div
        className="relative group"
        onMouseEnter={() => setHoveredCard(item.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Card
          hoverable
          className="rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-2xl"
          onClick={() => router.push(`/product/${item.id}`)}
          cover={
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                width={320}
                height={256}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay buttons */}
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                  hoveredCard === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <button className="bg-white p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:scale-110">
                  <BsCart3 size={20} />
                </button>
                <button className="bg-white p-3 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">
                  <BsHeart size={20} />
                </button>
              </div>
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                NEW
              </div>
            </div>
          }
        >
          <div className="p-2">
            <h3 className="font-bold text-gray-800 text-base mb-2 truncate">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <BsStarFill size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                {item.rating}
              </span>
              <span className="text-xs text-gray-500">({item.reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                ₹{item.price.toLocaleString()}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                In Stock
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CommonProductCard;
