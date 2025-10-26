import { commonResponse } from "@/helper/commonResponbeen";
import { getPublicIdFromUrl, parseFormDataWithFiles } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { ProductCreatePayload } from "@/interfaces/ProductInterface";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinaryUpload";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import CategoryModal from "@/model/Category";
import ProductModal from "@/model/Product";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

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

    if (
      !validatePayload(data) ||
      (files?.length === 0 && data?.images?.length === 0)
    ) {
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

    let uploadedImages = data?.images?.map((img) => ({
      id: img.id,
      url: img.url,
      isMain: img.isMain || false,
    }));

    // --- Handle new uploads ---
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file, "products")
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      const newUploads = uploadedUrls.map((url, i) => ({
        id: new mongoose.Types.ObjectId().toString(),
        url,
        isMain: uploadedImages?.length ? false : i === 0, // first if none main
      }));

      uploadedImages = [...(uploadedImages || []), ...newUploads];
    }

    // --- If editing (data.productid exists), remove deleted images from Cloudinary ---
    if (data.productid) {
      const existingProduct = await ProductModal.findById(data.productid);
      if (existingProduct && existingProduct.images?.length > 0) {
        // URLs in current DB
        const oldUrls = existingProduct.images.map((img) => img.url);
        // URLs sent from frontend (still kept)
        const newUrls = (data.images || []).map((img) => img.url);

        // Find URLs removed by user
        const deletedUrls = oldUrls.filter((url) => !newUrls.includes(url));

        // Delete removed images from Cloudinary
        for (const url of deletedUrls) {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
      }
    }

    // --- Limit to max 5 images ---
    const finalImages =
      uploadedImages && uploadedImages.length > 5
        ? uploadedImages.slice(0, 5)
        : uploadedImages;

    const additionalInfo = data.additionalInfo?.map((section) => ({
      id: section?.id ? section?.id : new mongoose.Types.ObjectId().toString(), // assign unique ID to each section
      title: section.title,
      fields: section.fields.map((f) => ({
        id: f?.id ? f?.id : new mongoose.Types.ObjectId().toString(), // assign unique ID to each field
        label: f.label,
        value: f.value,
      })),
    }));

    // --- Prepare Offer ---
    const offer = data.offer
      ? {
          title: data.offer.title,
          discountPercent: data.offer.discountPercent,
          validUntil: new Date(data.offer.validUntil),
          description: data.offer.description || "",
        }
      : undefined;

    if (!data.productid) {
      const product = new ProductModal({
        name: data.name,
        description: data.description,
        category: categoryId,
        images: finalImages,
        price: data.price,
        user: context.user?.id,
        active: data?.active,
        stock: data?.stock,
        offer: offer,
        additionalInfo: additionalInfo,
      });
      await product.save();
      return commonResponse(true, "", "Product created successfully", 200);
    } else {
      await ProductModal.findByIdAndUpdate(toObjectId(data.productid), {
        name: data.name,
        description: data.description,
        category: categoryId,
        images: finalImages,
        price: data.price,
        active: data?.active,
        stock: data?.stock,
        offer: offer,
        additionalInfo: additionalInfo,
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
