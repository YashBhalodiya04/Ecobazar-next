import { commonResponse } from "@/helper/commonResponbeen";
import { parseFormDataWithFiles } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { CategoryCreatePayload } from "@/interfaces/CategoryInterface";
import { ContexInterface } from "@/interfaces/commonInterace";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import CategoryModal from "@/model/Category";
import { NextRequest } from "next/server";

export const CreateCategory = async (
  req: NextRequest,
  context: ContexInterface,
  body: FormData
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }

    const { data, files } = parseFormDataWithFiles<CategoryCreatePayload>(body);

    if (!validatePayload(data) || (files?.length === 0 && !data?.imagepath)) {
      return commonResponse(false, "Please Fill All Fields", "", 200);
    }

    let duplicateCategory: any;
    if (!data?.categoryid) {
      duplicateCategory = await CategoryModal.findOne({
        name: data.name,
        active: true,
      });
    } else {
      const categoryId = toObjectId(data.categoryid);
      if (!categoryId) {
        return commonResponse(false, "Invalid category ID", "", 200);
      }

      duplicateCategory = await CategoryModal.findOne({
        name: data.name,
        _id: { $ne: categoryId }, // exclude current category
        active: true,
      });

      const isExistCategory = await CategoryModal.findById(categoryId);
      if (!isExistCategory) {
        return commonResponse(false, "Category not found", "", 404);
      }
    }

    if (duplicateCategory) {
      return commonResponse(false, "Category name already exists", "", 200);
    }

    let imgurl: string = data.imagepath || "";
    if (files?.length > 0) {
      imgurl = await uploadToCloudinary(files[0], "categories");
    }

    if (!data.categoryid) {
      const category = new CategoryModal({
        name: data.name,
        description: data.description,
        image: imgurl,
        active: data.active,
        user: context.user?.id,
      });
      await category.save();
      return commonResponse(true, "", "Category created successfully", 200);
    } else {
      const categoryId = toObjectId(data.categoryid);
      await CategoryModal.findByIdAndUpdate(categoryId, {
        name: data.name,
        description: data.description,
        image: imgurl,
        active: data.active,
      });
      return commonResponse(true, "", "Category updated successfully", 200);
    }
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Error On Save Category", error);
  }
};

export const POST = withAuth(CreateCategory);

const validatePayload = (body: CategoryCreatePayload): boolean => {
  const { name, description } = body;
  if (!name?.trim() || !description?.trim()) {
    return false;
  }
  return true;
};
