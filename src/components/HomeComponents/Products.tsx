"use client";
import React from "react";
import { Card, Row, Col, Skeleton, Rate } from "antd";
import { GoArrowRight } from "react-icons/go";
import CommonButton from "../common/CommonButton";
import { ProductData } from "@/interfaces/commonInterace";
import { useRouter } from "next/navigation";

const { Meta } = Card;

interface ProductsProps {
  productList: ProductData[];
  isLoading?: boolean;
}

const Products: React.FC<ProductsProps> = ({ productList, isLoading }) => {
  const router = useRouter();
  const handleViewAll = () => {
    router.push("/product");
  };

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="w-full mx-auto mt-10 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-Poppins text-gray-900">
          Popular Products
        </h2>
        <CommonButton
          type="default"
          className="!border-none hover:!text-green-600 !rounded-2xl px-5"
          onClick={handleViewAll}
          children="View All"
          themeType="success"
          icon={<GoArrowRight />}
        />
      </div>
      {isLoading ? (
        <Row gutter={[24, 24]}>
          {skeletonCards.map((_, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              className="flex justify-center"
            >
              <Card
                hoverable
                className="shadow-sm rounded-2xl overflow-hidden text-center bg-white border border-gray-100 w-[200px] flex flex-col justify-between"
              >
                <div className="!flex !justify-center !items-center py-4 bg-[#f9fafb] rounded-t-2xl">
                  <Skeleton.Image
                    active
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 12,
                    }}
                  />
                </div>
                <div className="flex flex-col items-center p-4 space-y-2">
                  <Skeleton.Input
                    active
                    style={{ width: 120, height: 16, borderRadius: 8 }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: 80, height: 16, borderRadius: 8 }}
                  />
                  <Skeleton.Button
                    active
                    size="small"
                    shape="round"
                    style={{ width: 100 }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
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
              onClick={() => router.push(`/product/${item?.id}`)}
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
      )}
    </div>
  );
};

export default Products;
