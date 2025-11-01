"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Carousel,
  Typography,
  Space,
  Divider,
  Skeleton,
  Avatar,
  Rate,
  Tag,
} from "antd";
import Image from "next/image";
import {
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRequestMutation } from "@/redux/commonApi";
import { apis } from "@/redux/apiUrls";
import {
  ProductDetailData,
  ProductDetailResponse,
  ProductReview,
} from "@/interfaces/ProductInterface";
import dayjs from "dayjs";
import { Toast } from "@/components/common/toastUtils";
import { getCookieValue } from "@/helper/CommonUtils";
import CommonButton from "@/components/common/CommonButton";
import { Controller, useForm } from "react-hook-form";
import { ReviewFormData, reviewSchema } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonInput from "@/components/common/CommonInput";
import { FaRupeeSign } from "react-icons/fa6";

const { Title, Paragraph, Text } = Typography;

const ProductDetail = () => {
  const user = getCookieValue("user");
  const [request, { isLoading }] = useRequestMutation();
  const params = useParams();
  const { id } = params;

  const [productData, setProductData] = useState<ProductDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const fetchProductData = async () => {
    try {
      const payload = { productid: id };
      const response: ProductDetailResponse = await request({
        url: apis.WITHOUTTOKEN.getProductDetails,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) setProductData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductData();
  }, [id]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const payload = {
        productId: id,
        rating: data?.rating,
        comment: data?.comment,
      };
      const response = await request({
        url: apis.USER.addProductReview,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        reset();
        fetchProductData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center px-20 sm:px-10 mb-3">
      <Card className="w-full rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex-1 min-w-[320px] max-w-[45%]">
            {loading ? (
              <Skeleton.Image active className="w-full h-[400px]" />
            ) : (
              <Carousel autoplay autoplaySpeed={4000} effect="fade">
                {productData?.imagelist?.map((img) => (
                  <div key={img.id}>
                    <Image
                      src={img.url}
                      alt={img.url}
                      width={500}
                      height={400}
                      className="w-full h-auto rounded-xl object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-[320px]">
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <>
                <Title level={2}>{productData?.name}</Title>
                <Text type="secondary">
                  Category: <b>{productData?.categoryName}</b>
                </Text>

                <Divider />
                <div className="flex items-baseline gap-3 mt-3">
                  <Title
                    level={3}
                    className="text-green-600 font-semibold !m-0 flex items-center"
                  >
                    <FaRupeeSign className="mr-1 text-green-600" />
                    {productData?.finalPrice.toFixed(2)}
                  </Title>
                  {productData?.hasValidOffer && (
                    <>
                      <Text delete className="text-gray-500 text-base">
                        <FaRupeeSign className="inline text-gray-500 mr-0.5 mt-[-7px]" />
                        {productData?.price.toFixed(2)}
                      </Text>

                      <Tag
                        color="green"
                        className="text-sm font-medium rounded-full px-2 py-0.5"
                      >
                        {productData?.offerDiscount}% OFF
                      </Tag>
                    </>
                  )}
                </div>

                <Text
                  type={productData?.stock > 0 ? "success" : "danger"}
                  className="block mb-3"
                >
                  {productData?.stock > 0
                    ? `${productData?.stock} available in stock`
                    : "Out of stock"}
                </Text>

                <Paragraph>{productData?.description}</Paragraph>

                <Divider />
                <div className="mt-2">
                  <Text strong>Quantity:</Text>
                  <Space align="center" className="ml-2">
                    <CommonButton
                      onClick={() => {}}
                      icon={<MinusOutlined />}
                      disabled={productData?.stock === 1}
                      themeType="success"
                      className="!border-hidden"
                    />
                    <Text strong>{productData?.stock}</Text>
                    <CommonButton
                      onClick={() => {}}
                      icon={<PlusOutlined />}
                      themeType="success"
                      className="!border-hidden"
                    />
                  </Space>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CommonButton
                    size="large"
                    themeType="success"
                    icon={<ShoppingCartOutlined />}
                    disabled={productData?.stock === 0}
                    className="flex-1"
                    children="Add To Cart"
                  />
                  <CommonButton
                    themeType="danger"
                    size="large"
                    icon={<HeartOutlined />}
                    className="flex-1"
                    onClick={() => Toast.success("Added to wishlist!")}
                    children="Wishlist"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <Divider />
        <div className="mt-8 border-t border-gray-200 pt-6">
          <Title level={4}>Write a Review</Title>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 "
          >
            <div className="flex items-center gap-2">
              <Text strong>Rating:</Text>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rate
                    {...field}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rating.message}
                </p>
              )}
            </div>
            <div>
              <CommonInput
                id="comment"
                label="Comment"
                type="text"
                placeholder="Share your experience..."
                required
                {...register("comment")}
                errorMessage={errors?.comment?.message || ""}
                istexarea={true}
                labelClassName="!text-black"
                focusColor="black"
              />
            </div>

            <div className="flex justify-end">
              <CommonButton
                themeType="dark"
                // icon={<HeartOutlined />}
                htmlType="submit"
                children={isSubmitting ? "Submitting..." : "Submit Review"}
              />
            </div>
          </form>
        </div>
        <div className="mt-5">
          <Title level={4}>Customer Reviews</Title>

          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="mt-5">
                  <Space align="start" size="middle" className="w-full">
                    <Skeleton.Avatar active size="large" shape="circle" />
                    <div className="w-full flex flex-col gap-2">
                      <Skeleton.Input active size="small" className="w-2/5" />
                      <Skeleton.Input active size="large" className="w-full" />
                    </div>
                  </Space>
                  <Divider />
                </div>
              ))}
            </>
          ) : productData?.reviews?.length ? (
            productData.reviews.map((review: ProductReview) => (
              <div key={review.id} className="mb-6">
                <Space align="start">
                  <Avatar
                    src={review.user?.userimage || undefined}
                    icon={<UserOutlined />}
                    size={50}
                  />
                  <div>
                    <Text strong className="">
                      {review.user?.username || "Anonymous"}
                      {/* <Text type="secondary" className="text-xs !text-black ms-3">
                        {dayjs(review.date).format("DD-MM-YY HH:mm")}
                      </Text> */}
                    </Text>
                    <br />
                    <Rate disabled defaultValue={review.rating} />
                    <Paragraph className="mt-1">{review.comment}</Paragraph>
                  </div>
                </Space>
                <Divider />
              </div>
            ))
          ) : (
            <Text type="secondary">No reviews yet.</Text>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
