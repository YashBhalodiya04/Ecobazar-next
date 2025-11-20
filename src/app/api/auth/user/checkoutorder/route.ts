import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";
import OrderModel from "@/model/OrderModal";
import ProductModal from "@/model/Product";

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

    const items = user.cart.map((cartItem) => ({
      product: cartItem.productId,
      price: cartItem.price,
      quantity: cartItem.quantity,
      subtotal: cartItem.price * cartItem.quantity,
      itemStatus: "0",
      rejectionReason: "",
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = 0;
    const finalAmount = totalAmount - discount;

    await OrderModel.create({
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
        method: body?.paymentMethod || "1",
        status: "0",
      },
      orderStatus: "0",
      totalAmount,
      discount,
      finalAmount,
      active: true,
    });
    
    await Promise.all(
      items.map((item) =>
        ProductModal.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      )
    );

    user.cart = [];
    await user.save();

    return commonResponse(true, "Order placed successfully", "");
  } catch (error) {
    console.error("Checkout API Error:", error);
    return commonResponse(false, "Failed to checkout order", error, 500);
  }
};

export const POST = withAuth(CheckOutOrder);
