"use client";
import React from "react";
import { Card, Row, Col, Skeleton } from "antd";
import { GoArrowRight } from "react-icons/go";
import CommonButton from "../common/CommonButton";
import { categoryData } from "@/interfaces/commonInterace";
import { useRouter } from "next/navigation";

const { Meta } = Card;

interface CategoriesProps {
  categories: categoryData[];
  isLoading?: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ categories, isLoading }) => {
  const router = useRouter()
  const handleViewCategory = (id?: string) => {
    if (id) {
     router.push(`/product?category=${id}`);
    } else {
      router.push("/product")
    }
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
          className="!border-none hover:!text-green-600 !rounded-2xl px-5 !text-base sm:!text-sm"
          onClick={() => handleViewCategory()}
          children="View All"
          themeType="success"
          icon={<GoArrowRight />}
        />
      </div>

      {isLoading ? (
        <Row
          gutter={[16, 16]}
          justify="start"
          className="flex flex-wrap"
        >
          {skeletonCards.map((_, index) => (
            <Col
              key={index}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={4}
              className="flex justify-center"
            >
              <Card
                hoverable
                className="[&_.ant-card-body]:!p-4 shadow-sm rounded-2xl text-center bg-white border border-gray-100 w-full max-w-[160px] sm:max-w-[180px] h-[160px] sm:h-[180px] flex flex-col justify-center items-center"
              >
                <div className="flex flex-col justify-center items-center w-full">
                  <Skeleton.Image
                    active
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  />
                  <Skeleton.Input
                    active
                    style={{
                      width: 90,
                      height: 16,
                      borderRadius: 8,
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[16, 16]} justify="start">
          {categories?.map((category) => (
            <Col
              key={category.id}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={4}
              className="flex justify-center"
            >
              <Card
                hoverable
                variant="borderless"
                className="[&_.ant-card-body]:!p-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl text-center bg-white border border-gray-100 hover:border-green-400 w-full max-w-[160px] sm:max-w-[180px] h-[160px] sm:h-[180px] flex flex-col justify-center items-center"
                onClick={() => handleViewCategory(category.id)}
              >
                <div className="flex flex-col justify-center items-center w-full">
                  <img
                    alt={category.name}
                    src={category.image}
                    className="w-40 md:w-56 h-14 md:h-16 object-contain mb-3 rounded-xl"
                  />
                  <Meta
                    title={
                      <span className="font-semibold text-gray-800 text-xs sm:text-sm">
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
