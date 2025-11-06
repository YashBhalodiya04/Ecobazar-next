"use client";
import { CartData, CartResponse } from "@/interfaces/UserCartInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import {
  DeleteOutlined,
  Loading3QuartersOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Empty, Image, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CommonButton from "./common/CommonButton";
import { CommonApiInterface } from "@/interfaces/commonInterace";
const { Text } = Typography;

interface CartModalProps {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  const router = useRouter();
  const [request] = useRequestMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartData>();

  const fetchCart = async () => {
    if (!isOpenModal) return;
    setLoading(true);
    try {
      const response: CartResponse = await request({
        url: apis.USER.getCart,
        method: "POST",
        body: "",
      }).unwrap();

      if (response?.success) {
        setCartItems(response?.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isOpenModal]);

  const updateCartQuantity = async (
    productId: string,
    newQuantity: number,
    action: "add" | "remove"
  ) => {
    try {
      const payload = {
        productid: productId,
        quantity: newQuantity,
        action: action,
      };
      setLoading(true);

      const response: CommonApiInterface = await request({
        url: apis.USER.addToCart,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    newQty: number,
    action: "add" | "remove"
  ) => {
    // try {
    //   await request({
    //     url: apis.USER.updateCartQty,
    //     method: "POST",
    //     body: { productId, quantity: newQty },
    //   }).unwrap();
    //   fetchCart(); // refresh cart
    // } catch (error) {
    //   console.error("Error updating quantity:", error);
    // }
  };

  // 🗑️ Function: Remove item
  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      const payload = {
        productid: productId,
      };
      const response: CommonApiInterface = await request({
        url: apis.USER.removeFromCart,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "green" }} spin />
  );

  const checkoutOrder = async () => {
    try {
      const response: CommonApiInterface = await request({
        url: apis.USER.checkoutOrder,
        method: "POST",
      }).unwrap();
      if (response?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <ShoppingCartOutlined />
          <span>Your Cart</span>
        </div>
      }
      placement="right"
      onClose={() => setIsOpenModal(false)}
      open={isOpenModal}
      width={380}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          {/* <Spin size="large" className="!text-green-700 " /> */}
          <Spin indicator={antIcon} />;
        </div>
      ) : cartItems?.cartdata?.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <div className="flex flex-col gap-4 h-full justify-between">
          {/* 🧾 Cart Items */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
            {cartItems?.cartdata?.map((item) => {
              const displayPrice =
                item.offerPrice && item.offerPrice > 0
                  ? item.offerPrice
                  : item.price;

              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border-b pb-3"
                >
                  <Image
                    src={item?.image || "/media/placeholder.png"}
                    alt={item?.name || "Product"}
                    width={80}
                    height={60}
                    className="rounded-md border border-zinc-700 object-cover"
                    preview={true}
                  />

                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item?.name}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <CommonButton
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.quantity - 1,
                            "remove"
                          )
                        }
                        icon={<MinusOutlined />}
                        size="small"
                        // disabled={quantity <= 0}
                        // loading={cartLoading}
                        themeType="success"
                        className="!border-hidden !shadow-none !bg-transparent hover:!bg-green-100"
                      />
                      <Text strong className="text-lg">
                        {item.quantity}
                      </Text>

                      <CommonButton
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.quantity + 1,
                            "add"
                          )
                        }
                        icon={<PlusOutlined />}
                        // disabled={quantity >= (productData?.stock || 0)}
                        // loading={cartLoading}
                        size="small"
                        themeType="success"
                        className="!border-hidden !shadow-none !bg-transparent hover:!bg-green-100"
                      />
                    </div>

                    {/* Price */}
                    <div className="text-sm text-gray-600 mt-1">
                      {item.offerPrice && item.offerPrice > 0 ? (
                        <>
                          <span className="text-green-600 font-semibold">
                            ₹{item.offerPrice.toFixed(2)} / Item
                          </span>{" "}
                          <span className="line-through text-gray-400 text-xs">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>₹{item.price.toFixed(2)} / Item</span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-semibold">
                      ₹{item.finalPrice.toFixed(2)}
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={() => removeItem(item.productId)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Final Cart Summary */}
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>₹{cartItems?.finalcartvalue?.toFixed(2) || "0.00"}</span>
            </div>

            <CommonButton
              size="large"
              themeType="success"
              icon={<ShoppingCartOutlined />}
              className="w-full"
              disabled={cartItems?.cartdata?.length === 0}
              onClick={() => checkoutOrder()}
            >
              Proceed to Checkout
            </CommonButton>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartModal;
