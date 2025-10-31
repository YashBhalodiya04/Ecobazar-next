"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Carousel, Typography, Button, Space, Divider } from "antd";
import Image from "next/image";
import {
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRequestMutation } from "@/redux/commonApi";
import { apis } from "@/redux/apiUrls";
import {
  ProductDetailData,
  ProductDetailResponse,
} from "@/interfaces/ProductInterface";

const { Title, Paragraph, Text } = Typography;

const products = [
  {
    id: 1,
    name: "Modern Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    inStock: 25,
    description:
      "Experience premium sound quality with these wireless headphones. Designed for comfort and superior noise isolation. Enjoy seamless Bluetooth connectivity, a long-lasting battery, and an immersive listening experience.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80",
      "https://images.unsplash.com/photo-1580894732444-8ecded7900a0?w=800&q=80",
      "https://images.unsplash.com/photo-1606813902781-9b6e82f0cbd4?w=800&q=80",
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800&q=80",
    ],
  },
];

const ProductDetail = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();
  const params = useParams();
  const { id } = params;

  const [productData, setproductData] = useState<ProductDetailData | null>(
    null
  );

  const fetchProductData = async () => {
    try {
      const payload = {
        productid: id,
      };
      const response: ProductDetailResponse = await request({
        url: apis.WITHOUTTOKEN.getProductDetails,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        setproductData(response?.data);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  return (
    <div className="w-full flex justify-center px-20 sm:px-10">
      <Card
        style={{
          width: "100%",
          //   maxWidth: 1100,
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 45%", minWidth: 320 }}>
            <Carousel autoplay autoplaySpeed={4000} effect="fade">
              {productData?.imagelist.map((img, idx) => (
                <div key={img?.id}>
                  <Image
                    src={img?.url}
                    alt={img?.url}
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 12,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div
            style={{
              flex: "1 1 45%",
              minWidth: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Product Header */}
            <div>
              <Title level={2} style={{ marginBottom: 4 }}>
                {productData?.name}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Category: <b>{productData?.categoryName}</b>
              </Text>

              <Divider />
              <div style={{ marginTop: 10 }}>
                <Title
                  level={3}
                  style={{
                    color: "#52c41a",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  ${productData?.price.toFixed(2)}
                </Title>
                <Text
                  type={productData?.stock > 0 ? "success" : "danger"}
                  style={{
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {productData?.stock > 0
                    ? `${productData?.stock} available in stock`
                    : "Out of stock"}
                </Text>
              </div>

              <Paragraph
                style={{
                  marginTop: 12,
                  lineHeight: 1.6,
                  color: "#555",
                  fontSize: 15,
                }}
              >
                {productData?.description}
              </Paragraph>

              <Divider />

              <div style={{ marginTop: 10 }}>
                <Text strong style={{ marginRight: 10 }}>
                  Quantity:
                </Text>
                {/* <Space align="center">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={decreaseQty}
                    disabled={quantity === 1}
                  />
                  <Text strong style={{ minWidth: 30, textAlign: "center" }}>
                    {quantity}
                  </Text>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={increaseQty}
                    disabled={quantity >= product.inStock}
                  />
                </Space> */}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ flex: 1, minWidth: 180 }}
                  disabled={productData?.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    borderColor: "#ff4d4f",
                    color: "#ff4d4f",
                  }}
                >
                  Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
