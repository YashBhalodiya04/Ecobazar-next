import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { AddToCartPayload } from "@/interfaces/UserCartInterface";
import dbconnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const RemoveFromCart = async (
  req: NextRequest,
  context: ContexInterface,
  body: AddToCartPayload
) => {
  await dbconnect();

  try {
    const { productid } = body;

    if (isNullEmpty(productid)) {
      return commonResponse(false, "Product ID is required");
    }

    const user = context?.user;
    if (!user?.id) {
      return commonResponse(false, "User not found");
    }

    const existingUser = await UserModal.findById(user.id);
    if (!existingUser) {
      return commonResponse(false, "User not found in DB");
    }

    const originalCartLength = existingUser.cart.length;
    existingUser.cart = existingUser.cart.filter(
      (item) => item.productId.toString() !== productid
    );

    if (existingUser.cart.length === originalCartLength) {
      return commonResponse(false, "Product not found in cart");
    }

    await existingUser.save();

    return commonResponse(true, "Product removed from cart successfully", {
      cart: existingUser.cart,
      finalCartValue: existingUser.finalcartvalue,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return commonResponse(false, "Failed to remove product from cart", error);
  }
};

export const POST = withAuth(RemoveFromCart);
