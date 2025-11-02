import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { AddToCartPayload } from "@/interfaces/UserCartInterface";
import dbconnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";
import { toObjectId } from "@/lib/helper";

export const AddToCart = async (
  req: NextRequest,
  context: ContexInterface,
  body: AddToCartPayload
) => {
  await dbconnect();

  try {
    const { productid, quantity, action, isfromproductlist } = body;
    const error = validatePayload(body);
    if (error) return commonResponse(false, error);

    const user = context?.user;
    if (!user?.id) return commonResponse(false, "User not found");

    const existingUser = await UserModal.findById(toObjectId(user.id));
    if (!existingUser) return commonResponse(false, "User not found in DB");

    const product = await ProductModel.findById(toObjectId(productid));
    if (!product || !product.active)
      return commonResponse(false, "Product not found or inactive");

    let finalPrice = product.price;
    if (
      product.offer &&
      product.offer.discountPercent > 0 &&
      (!product.offer.validUntil ||
        new Date(product.offer.validUntil) > new Date())
    ) {
      finalPrice =
        product.price - (product.price * product.offer.discountPercent) / 100;
    }

    const existingItemIndex = existingUser.cart.findIndex(
      (item) => item.productId.toString() === productid
    );
    if (isfromproductlist && existingItemIndex > -1) {
      return commonResponse(false, "Item already in cart");
    }

    if (existingItemIndex > -1) {
      if (quantity === 0) {
        existingUser.cart.splice(existingItemIndex, 1);
      } else {
        existingUser.cart[existingItemIndex].quantity = quantity;
      }
    } else {
      if (action === "add") {
        existingUser.cart.push({
          productId: productid,
          quantity,
          price: finalPrice,
        });
      } else {
        return commonResponse(false, "Cannot remove an item not in cart");
      }
    }

    await existingUser.save();

    return commonResponse(true, "Cart updated successfully", '');
  } catch (error) {
    console.error("Error adding to cart:", error);
    return commonResponse(false, "Failed to update cart", error);
  }
};

export const POST = withAuth(AddToCart);

const validatePayload = (payload: AddToCartPayload): string => {
  const { productid, quantity, action } = payload;
  if (isNullEmpty(productid) || isNullEmpty(quantity.toString()) || isNullEmpty(action))
    return "All fields are required";

  if (!["add", "remove"].includes(action))
    return "Action must be 'add' or 'remove'";

  return "";
};
