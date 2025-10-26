"use client";
import React from "react";
import { Card, Row, Col, Button, Rate } from "antd";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import CommonButton from "../common/CommonButton";
import { ProductData } from "@/interfaces/commonInterace";

const { Meta } = Card;

// ✅ Props type for component
interface ProductsProps {
  productList: ProductData[];
}

const Products: React.FC<ProductsProps> = ({ productList }) => {
  const handleViewAll = () => {
    console.log("Navigating to /shop");
  };

  return (
    <div className="w-full mx-auto mt-10 mb-16">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-Poppins text-gray-900">
          Popular Products
        </h2>

        <CommonButton
          type="default"
          className="!border-none hover:!text-green-600  !rounded-2xl px-5"
          onClick={handleViewAll}
          children="View All"
          themeType="success"
          icon={<GoArrowRight />}
        />
      </div>

      {/* Product Grid */}
      <Row gutter={[24, 24]}>
        {productList?.map((item) => (
          <Col
            key={item?.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            className="flex justify-center"
          >
            <Card
              hoverable
              variant="borderless"
              className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden text-center bg-white border border-gray-100 hover:border-green-400 w-[200px]"
              cover={
                <div className="!flex !justify-center !items-center py-4 bg-[#f9fafb] rounded-t-2xl">
                  <img
                    alt={item?.name}
                    src={item?.image}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              }
            >
              <Meta
                title={
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {item?.name}
                    </span>
                    <span className="text-green-600 font-bold text-base">
                      ${item?.price.toFixed(2)}
                    </span>
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={item?.rating}
                      className="text-xs"
                    />
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
