"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, Carousel, Typography, Button, Space, Divider } from "antd";
import Image from "next/image";
import {
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

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
  const params = useParams();
  const { id } = params;
  const product = products.find((p) => String(p.id) === String(id));

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>Product not found!</h2>
    );
  }

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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
          {/* LEFT SIDE - Product Slider */}
          <div style={{ flex: "1 1 45%", minWidth: 320 }}>
            <Carousel autoplay autoplaySpeed={4000} effect="fade">
              {product.images.map((img, idx) => (
                <div key={idx}>
                  <Image
                    src={img}
                    alt={product.name}
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

          {/* RIGHT SIDE - Product Info */}
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
                {product.name}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Category: <b>{product.category}</b>
              </Text>

              <Divider />

              {/* Price and Stock Info */}
              <div style={{ marginTop: 10 }}>
                <Title
                  level={3}
                  style={{
                    color: "#52c41a",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  ${product.price.toFixed(2)}
                </Title>
                <Text
                  type={product.inStock > 0 ? "success" : "danger"}
                  style={{
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {product.inStock > 0
                    ? `${product.inStock} available in stock`
                    : "Out of stock"}
                </Text>
              </div>

              {/* Description */}
              <Paragraph
                style={{
                  marginTop: 12,
                  lineHeight: 1.6,
                  color: "#555",
                  fontSize: 15,
                }}
              >
                {product.description}
              </Paragraph>

              <Divider />

              {/* Quantity Selector */}
              <div style={{ marginTop: 10 }}>
                <Text strong style={{ marginRight: 10 }}>
                  Quantity:
                </Text>
                <Space align="center">
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
                </Space>
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
                  disabled={product.inStock === 0}
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
