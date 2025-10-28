"use client";
import React from "react";
import { Card, Row, Col, Skeleton } from "antd";
import { GoArrowRight } from "react-icons/go";
import CommonButton from "../common/CommonButton";
import { categoryData } from "@/interfaces/commonInterace";

const { Meta } = Card;

interface CategoriesProps {
  categories: categoryData[];
  isLoading?: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ categories, isLoading }) => {
  const handleViewCategory = () => {
    console.log("Navigating to /shop");
  };
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="w-full mx-auto mt-10 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-Poppins text-gray-900">
          Popular Categories
        </h2>
        <CommonButton
          type="default"
          className="!border-none hover:!text-green-600 !rounded-2xl px-5"
          onClick={handleViewCategory}
          children="View All"
          themeType="success"
          icon={<GoArrowRight />}
        />
      </div>

      {isLoading ? (
        <Row
          gutter={[24, 24]}
          justify="start"
          className="flex flex-wrap gap-y-6 md:gap-y-8"
        >
          {skeletonCards.map((_, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={8}
              lg={4}
              xl={4}
              className="flex justify-center"
            >
              <Card
                hoverable
                className="[&_.ant-card-body]:!p-4 shadow-sm rounded-2xl text-center bg-white border border-gray-100 w-[180px] h-[180px] flex flex-col justify-center items-center"
              >
                <div className="flex flex-col justify-center items-center w-full">
                  <Skeleton.Image
                    active
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      marginBottom: 12,
                    }}
                  />
                  <Skeleton.Input
                    active
                    style={{
                      width: 100,
                      height: 18,
                      borderRadius: 8,
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row
          gutter={[24, 24]}
          justify="start"
          className="flex flex-wrap gap-y-6 md:gap-y-8"
        >
          {categories?.map((category) => (
            <Col
              key={category.id}
              xs={24}
              sm={12}
              md={8}
              lg={4}
              xl={4}
              className="flex justify-center"
            >
              <Card
                hoverable
                variant="borderless"
                className="[&_.ant-card-body]:!p-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl text-center bg-white border border-gray-100 hover:border-green-400 w-[180px] h-[180px] flex flex-col justify-center items-center"
                onClick={handleViewCategory}
                cover={null}
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    alt={category.name}
                    src={category.image}
                    className="w-full h-16 object-contain mb-3 rounded-xl"
                  />
                  <Meta
                    title={
                      <span className="font-semibold text-gray-800 text-sm">
                        {category.name}
                      </span>
                    }
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Categories;
