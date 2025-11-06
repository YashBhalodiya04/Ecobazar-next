import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";
import OrderModel from "@/model/OrderModal";

export const CheckOutOrder = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const userId = toObjectId(context?.user?.id);
    const user = await UserModal.findById(userId).populate("cart.productId");

    if (!user) return commonResponse(false, "User not found");
    if (!user.cart || user.cart.length === 0)
      return commonResponse(false, "Cart is empty");

    const shippingAddress = user.billingAddress?.find((addr) => addr.isPrimary);
    if (!shippingAddress)
      return commonResponse(false, "No primary shipping address found");

    const items = user.cart.map((cartItem: any) => ({
      product: cartItem.productId._id,
      name: cartItem.productId.name,
      image: cartItem.productId.images?.[0]?.url || "",
      price: cartItem.price,
      quantity: cartItem.quantity,
      subtotal: cartItem.price * cartItem.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = 0;
    const finalAmount = totalAmount - discount;

    const newOrder = await OrderModel.create({
      user: user._id,
      items,
      shippingAddress: {
        fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: shippingAddress.phoneNumber,
        addressLine1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.zipCode,
        country: shippingAddress.country,
      },
      paymentInfo: {
        method: body?.paymentMethod || "COD",
        status: "pending",
      },
      totalAmount,
      discount,
      finalAmount,
    });

    user.cart = [];
    await user.save();

    return commonResponse(true, "Order placed successfully", "");
  } catch (error) {
    console.error("Checkout API Error:", error);
    return commonResponse(false, "Failed to checkout order", error, 500);
  }
};

export const POST = withAuth(CheckOutOrder);
