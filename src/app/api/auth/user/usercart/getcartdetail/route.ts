// import { commonResponse } from "@/helper/commonResponbeen";
// import { isNullEmpty } from "@/helper/CommonUtils";
// import { withAuth } from "@/helper/withAuth";
// import { ContexInterface } from "@/interfaces/commonInterace";
// import dbconnect from "@/lib/dbConnect";
// import { toObjectId } from "@/lib/helper";
// import UserModal from "@/model/User";
// import { NextRequest } from "next/server";

// export const GetCartDetail = async (
//   req: NextRequest,
//   context: ContexInterface,
//   body: any
// ) => {
//   await dbconnect();
//   try {
//     const userid = context?.user?.id;

//     const query = {
//       _id: toObjectId(userid),
//       active: true,
//     };
//     const userisActive = await UserModal.findOne(query);

//     if (isNullEmpty(userisActive)) {
//       return commonResponse(false, "User not found");
//     }
//     const cart = await UserModal.aggregate([
//       {
//         $match: query,
//       },
//       {
//         $addFields: {
//           finalcartvalue: {
//             $cond: {
//               if: { $gt: [{ $size: "$cart" }, 0] },
//               then: {
//                 $sum: {
//                   $map: {
//                     input: "$cart",
//                     as: "item",
//                     in: { $multiply: ["$$item.price", "$$item.quantity"] },
//                   },
//                 },
//               },
//               else: 0,
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           cartdata: "$cart",
//           finalcartvalue: 1,
//         },
//       },
//     ]);

//     const responsebody = cart[0] || null;

//     return commonResponse(true, "Cart fetched successfully", responsebody);
//   } catch (error) {
//     console.error("Error Fetch to cart:", error);
//     return commonResponse(false, "Failed to Fetch cart", error);
//   }
// };

// export const POST = withAuth(GetCartDetail);

import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";

export const GetCartDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const userid = context?.user?.id;
    if (!userid) return commonResponse(false, "User not found");

    const query = { _id: toObjectId(userid), active: true };
    const user = await UserModal.findOne(query);

    if (!user) return commonResponse(false, "User not found in DB");

    // ✅ Populate product details
    const cartWithProducts = await Promise.all(
      user.cart.map(async (item: any) => {
        const product = await ProductModel.findById(toObjectId(item.productId));

        if (!product || !product.active) {
          // Skip inactive or deleted products
          return null;
        }

        // ✅ Check if offer is still valid
        const offerValid =
          product.offer &&
          product.offer.discountPercent > 0 &&
          (!product.offer.validUntil ||
            new Date(product.offer.validUntil) > new Date());

        const finalPrice = offerValid
          ? product.price -
            (product.price * product.offer.discountPercent) / 100
          : product.price;

        return {
          productId: product._id,
          name: product.name,
          image: product.images?.find((item) => item?.isMain)?.url || "",
          price: product.price,
          offerPrice: offerValid ? finalPrice : null,
          quantity: item.quantity,
          finalPrice: finalPrice * item.quantity,
        };
      })
    );

    // ✅ Filter out null entries (inactive/deleted products)
    const validCartItems = cartWithProducts.filter((item) => item !== null);

    // ✅ Calculate total cart value
    const finalcartvalue = validCartItems.reduce(
      (total, item) => total + item.finalPrice,
      0
    );

    const responsebody = {
      cartdata: validCartItems,
      finalcartvalue: finalcartvalue || 0,
    };

    return commonResponse(true, "", responsebody);
  } catch (error) {
    console.error("Error Fetching cart:", error);
    return commonResponse(false, "Failed to fetch cart", error);
  }
};

export const POST = withAuth(GetCartDetail);
