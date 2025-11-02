import { getCookieValue } from "@/helper/CommonUtils";
import { ProductClientGridRecord } from "@/interfaces/ProductInterface";
import { Card, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsCart3, BsHeart, BsStarFill } from "react-icons/bs";
import { Toast } from "./toastUtils";
import { useRequestMutation } from "@/redux/commonApi";
import { apis } from "@/redux/apiUrls";
import { CommonApiInterface } from "@/interfaces/commonInterace";

const CommonProductCard = ({ item }: { item: ProductClientGridRecord }) => {
  const user = getCookieValue("user");
  const [request, { isLoading }] = useRequestMutation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const router = useRouter();

  const getStockStatus = () => {
    if (item?.stock === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (item?.stock <= 10)
      return { label: "Limited Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = async (id: string) => {
    try {
      if (!user) {
        Toast.error("Please login to add items to cart");
        return;
      }

      const payload = {
        productid: id,
        quantity: 1,
        action: "add",
        isfromproductlist: true,
      };

      const response: CommonApiInterface = await request({
        url: apis.USER.addToCart,
        method: "POST",
        body: payload,
      }).unwrap();
    } catch (error) {
      console.error(error);
      Toast.error("Failed to add item to cart");
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredCard(item?.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <Card
        hoverable
        className="rounded-2xl overflow-hidden border-2 border-transparent hover:border-green-400 transition-all duration-300 shadow-md hover:shadow-2xl"
        onClick={() => router.push(`/product/${item?.id}`)}
        cover={
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <Image
              src={item?.image}
              alt={item?.name}
              width={320}
              height={256}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay buttons */}
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                hoveredCard === item?.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                className="bg-white p-3 rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item?.id);
                }}
              >
                <BsCart3 size={20} />
              </button>
              <button className="bg-white p-3 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">
                <BsHeart size={20} />
              </button>
            </div>

            {/* New or Offer Badge */}
            {item?.isNew && (
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                NEW
              </div>
            )}
            {item?.hasValidOffer && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                OFFER
              </div>
            )}
          </div>
        }
      >
        <div className="p-2">
          {/* Product name */}
          <h3 className="font-bold text-gray-800 text-base mb-2 truncate">
            {item?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <BsStarFill size={14} className="text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">
              {item?.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({item?.reviews})</span>
          </div>

          {/* Price section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {item?.hasValidOffer ? (
                <>
                  <span className="text-sm line-through text-gray-500">
                    ₹{item?.price.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{item?.finalPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-blue-600">
                  ₹{item?.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${stockStatus?.color}`}
            >
              {stockStatus?.label}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommonProductCard;
