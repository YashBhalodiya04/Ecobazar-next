"use client";
import React, { useState } from "react";
import {
  Row,
  Col,
  Checkbox,
  Radio,
  Select,
  Pagination,
  Card,
  Carousel,
} from "antd";
import Image from "next/image";
import CommonButton from "@/components/common/CommonButton";
import CommonProductCard from "@/components/common/CommonProductCard";

const { Meta } = Card;
const { Option } = Select;

const ProductPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(8);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 🧺 Static product data
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1999,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      rating: 4.8,
      reviews: 256,
    },
    {
      id: 3,
      name: "Leather Jacket",
      price: 2999,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 4,
      name: "Sunglasses",
      price: 999,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      rating: 4.3,
      reviews: 64,
    },
    {
      id: 5,
      name: "Casual Shoes",
      price: 1599,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      rating: 4.7,
      reviews: 192,
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      price: 2499,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      rating: 4.4,
      reviews: 147,
    },
    {
      id: 7,
      name: "Backpack",
      price: 1299,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      rating: 4.5,
      reviews: 203,
    },
    {
      id: 8,
      name: "Denim Jeans",
      price: 1899,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      rating: 4.6,
      reviews: 178,
    },
  ];

  // 🖼️ Image carousel (5 slides)
  const carouselImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200",
  ];

  const categories = ["Electronics", "Fashion", "Accessories", "Footwear"];

  const priceOptions = [
    { label: "₹0 - ₹1,000", value: "0-1000" },
    { label: "₹1,001 - ₹3,000", value: "1001-3000" },
    { label: "₹3,001 - ₹5,000", value: "3001-5000" },
    { label: "₹5,000+", value: "5000-above" },
  ];

  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Oldest",
  ];

  // 🧠 Filters
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    let matchPrice = true;
    if (selectedPrice) {
      if (selectedPrice === "5000-above") matchPrice = product.price > 5000;
      else {
        const [min, max] = selectedPrice.split("-").map(Number);
        matchPrice = product.price >= min && product.price <= max;
      }
    }

    return matchCategory && matchPrice;
  });

  const startIdx = (currentPage - 1) * perPage;
  const currentProducts = filteredProducts.slice(startIdx, startIdx + perPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 w-full px-20 sm:px-10">
      <div className="relative mb-8 overflow-hidden">
        <Carousel
          autoplay
          autoplaySpeed={4000}
          dots={{ className: "custom-dots" }}
          effect="fade"
        >
          {carouselImages.map((img, idx) => (
            <div key={idx}>
              <div className="relative h-96 w-full">
                <Image
                  src={img}
                  alt={`Slide ${idx}`}
                  width={1920}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-8 text-white">
                    <h1 className="text-5xl font-bold mb-4">
                      Discover Amazing Products
                    </h1>
                    <p className="text-xl mb-6">
                      Up to 50% off on selected items
                    </p>
                    <CommonButton
                      children="Shop Now"
                      type="text"
                      themeType="cancel"
                      className="!bg-white !text-gray-900 !px-8 !py-6 !rounded-full !font-semibold hover:!bg-gray-100 hover:!text-gray-900 !transition-all !transform hover:!scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={8} md={6} lg={5}>
            <div className="sticky top-16">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                    Categories
                  </h3>
                  <Checkbox.Group
                    options={categories}
                    value={selectedCategories}
                    onChange={(checkedValues) =>
                      setSelectedCategories(checkedValues as string[])
                    }
                    className="flex flex-col gap-3"
                  />
                </div>

                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Price Range
                  </h3>
                  <Radio.Group
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    value={selectedPrice}
                    className="flex flex-col gap-3"
                  >
                    {priceOptions.map((p) => (
                      <Radio
                        key={p.value}
                        value={p.value}
                        className="text-gray-700"
                      >
                        {p.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Sort By
                  </h3>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select option"
                    onChange={(val) => setSortOption(val)}
                    className="rounded-lg"
                    size="large"
                  >
                    {sortOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={16} md={18} lg={19}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredProducts.length} Products Found
              </h2>
            </div>

            <Row gutter={[24, 24]}>
              {currentProducts.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <CommonProductCard item={item} />
                </Col>
              ))}
            </Row>
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={perPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductPage;
