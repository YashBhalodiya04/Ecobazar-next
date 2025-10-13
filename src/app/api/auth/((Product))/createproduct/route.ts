import { commonResponse } from "@/helper/commonResponbeen";
import { parseFormDataWithFiles } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { ProductCreatePayload } from "@/interfaces/ProductInterface";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import CategoryModal from "@/model/Category";
import ProductModal from "@/model/Product";
import { NextRequest } from "next/server";

export const CreateProduct = async (
  req: NextRequest,
  context: ContexInterface,
  body: FormData
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 403);
    }
    const { data, files } = parseFormDataWithFiles<ProductCreatePayload>(body);

    if (!validatePayload(data) || (files?.length === 0 && !data?.imagepath)) {
      return commonResponse(false, "Please Fill All Fields", "", 200);
    }

    const categoryId = toObjectId(data.categoryid);
    if (!categoryId) {
      return commonResponse(false, "Invalid category ID", "", 200);
    }

    const category = await CategoryModal.findOne({
      _id: categoryId,
      active: true,
    });
    if (!category) {
      return commonResponse(false, "Category not found", "", 404);
    }

    let duplicateProduct: any;
    if (!data.productid) {
      duplicateProduct = await ProductModal.findOne({
        name: data.name,
        categoryid: categoryId,
        active: true,
      });
    } else {
      const productId = toObjectId(data.productid);
      duplicateProduct = await ProductModal.findOne({
        name: data.name,
        categoryid: categoryId,
        _id: { $ne: productId },
        active: true,
      });

      const existingProduct = await ProductModal.findById(productId);
      if (!existingProduct) {
        return commonResponse(false, "Product not found", "", 404);
      }
    }

    if (duplicateProduct) {
      return commonResponse(
        false,
        "Product with this name already exists in this category",
        "",
        200
      );
    }

    let imgurl = data.imagepath || "";
    if (files?.length > 0) {
      imgurl = await uploadToCloudinary(files[0], "products");
    }

    if (!data.productid) {
      const product = new ProductModal({
        name: data.name,
        description: data.description,
        categoryid: categoryId,
        image: imgurl,
        price: data.price,
        user: context.user?.id,
        active: true,
      });
      await product.save();
      return commonResponse(true, "", "Product created successfully", 200);
    } else {
      await ProductModal.findByIdAndUpdate(toObjectId(data.productid), {
        name: data.name,
        description: data.description,
        categoryid: categoryId,
        image: imgurl,
        price: data.price,
        active: true,
      });
      return commonResponse(true, "", "Product updated successfully", 200);
    }
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to create product", error);
  }
};

export const POST = withAuth(CreateProduct);

const validatePayload = (body: ProductCreatePayload): boolean => {
  const { name, description, price, stock } = body;
  if (!name?.trim() || !description?.trim() || !price || !stock) {
    return false;
  }
  return true;
};
