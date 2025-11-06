"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Tabs,
  Button,
  message,
  Popconfirm,
  Image,
  Upload,
  Skeleton,
  UploadProps,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import CommonInput from "@/components/common/CommonInput";
import CommonButton from "@/components/common/CommonButton";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { UserProfileForm, userProfileSchema } from "@/schemas/authSchemas";
import { UserProfileAPiResponse } from "@/interfaces/UserCartInterface";
import { getCookieValue, isRestrictedFile } from "@/helper/CommonUtils";
import { Toast } from "@/components/common/toastUtils";
import { useRouter } from "next/navigation";
import { CommonApiInterface } from "@/interfaces/commonInterace";

const UserProfilePage: React.FC = () => {
  const userLogin = getCookieValue("user");
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Store the API user data separately
  const [userData, setUserData] = useState<UserProfileForm | null>(null);

  const defaultValues: UserProfileForm = {
    username: "",
    email: "",
    phone: "",
    userimage: "",
    billingAddress: [
      {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phoneNumber: "",
        isPrimary: true,
      },
    ],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billingAddress",
  });

  const user = watch();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response: UserProfileAPiResponse = await request({
        url: apis.USER.getProfile,
        method: "POST",
        body: "",
      }).unwrap();
      if (response?.success) {
        setUserData(response.data);
        reset(response.data);
      }
    } catch (error) {
      console.error("Something went wrong while fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLogin) fetchUserData();
    else router.push("/");
  }, [userLogin]);

  const handleProfileCancel = () => {
    if (userData) reset(userData);
    setEditProfile(false);
  };

  const handleAddressCancel = () => {
    if (userData) reset(userData);
    setEditAddress(false);
  };

  const onSubmit = async (data: UserProfileForm) => {
    const payload = {
      username: data?.username || "",
      email: data?.email || "",
      phone: data?.phone || "",
      userimage: data?.userimage || "",
      billingAddress: data?.billingAddress || [],
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(payload));
    if (fileList?.length > 0 && fileList[0].originFileObj) {
      formdata.append("files", fileList[0].originFileObj);
    } else {
      formdata.append("files", "");
    }

    const response: CommonApiInterface = await request({
      url: apis.USER.updateProfile,
      method: "POST",
      body: formdata,
    }).unwrap();
    if (response?.success) {
      await fetchUserData();
      setEditProfile(false);
      setEditAddress(false);
    }
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const lastFile = newFileList[newFileList.length - 1];
      if (lastFile.originFileObj) {
        const isRestrict = isRestrictedFile(lastFile.originFileObj?.name);
        if (isRestrict?.valid) {
          Toast.error(`${isRestrict?.message}`);
          return;
        }
        const fileType = lastFile.originFileObj.type;
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(fileType)) {
          Toast.error("Invalid file type. Please upload a JPEG or PNG file.");
          return;
        }
        if (lastFile.originFileObj.size > 5 * 1024 * 1024) {
          Toast.error("File size exceeds the maximum limit of 5 MB");
          return;
        }
        const imageUrl = URL.createObjectURL(lastFile.originFileObj);
        setValue("userimage", imageUrl);
        setFileList([lastFile]);
      }
    }
  };

  const AddressSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton.Button style={{ width: 130 }} active />
      </div>
      {[1, 2].map((i) => (
        <Card key={i} className="border border-gray-200 rounded-xl">
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-start gap-2">
        <Skeleton.Avatar active size={100} shape="circle" />
        <Skeleton.Button active size="small" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton active paragraph={{ rows: 0 }} />
        <Skeleton active paragraph={{ rows: 0 }} />
        <Skeleton active paragraph={{ rows: 0 }} />
      </div>
      <div className="flex gap-2">
        <Skeleton.Button active />
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-0 font-Poppins">
      <Card className="max-w-6xl mx-auto shadow-lg rounded-2xl p-4 md:p-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "profile",
              label: "Profile Info",
              icon: <UserOutlined />,
              children: isLoading ? (
                <ProfileSkeleton />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Profile Info */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start">
                      <Image
                        src={user?.userimage || "/user.png"}
                        alt="User"
                        width={80}
                        height={80}
                        className="rounded-full border"
                      />
                      {editProfile && (
                        <Upload
                          beforeUpload={() => false}
                          showUploadList={false}
                          onChange={handleChange}
                          accept="image/*"
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      )}
                    </div>

                    <div className="flex flex-col items-start space-y-3">
                      {editProfile ? (
                        <>
                          <CommonInput
                            id="username"
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            {...register("username")}
                            errorMessage={errors.username?.message}
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />
                          <CommonInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            errorMessage={errors.email?.message}
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />
                          <CommonInput
                            id="phone"
                            label="Phone"
                            type="text"
                            placeholder="Enter your phone number"
                            {...register("phone")}
                            errorMessage={errors.phone?.message}
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <MailOutlined /> {user.email}
                          </p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <PhoneOutlined /> {user.phone}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {editProfile ? (
                        <>
                          <CommonButton
                            icon={<CloseOutlined />}
                            onClick={handleProfileCancel}
                            themeType="danger"
                            children="Cancel"
                          />
                          <CommonButton
                            htmlType="submit"
                            type="primary"
                            icon={<SaveOutlined />}
                            themeType="success"
                            children="Save"
                          />
                        </>
                      ) : (
                        <CommonButton
                          icon={<EditOutlined />}
                          onClick={() => setEditProfile(true)}
                          themeType="info"
                          children="Edit"
                        />
                      )}
                    </div>
                  </div>
                </form>
              ),
            },

            {
              key: "address",
              label: "Billing Address",
              icon: <HomeOutlined />,
              children: isLoading ? (
                <AddressSkeleton />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-end mb-3">
                    {editAddress ? (
                      <>
                        <CommonButton
                          icon={<CloseOutlined />}
                          onClick={handleAddressCancel}
                          themeType="danger"
                          children="Cancel"
                          className="me-3"
                        />
                        <CommonButton
                          htmlType="submit"
                          type="primary"
                          icon={<SaveOutlined />}
                          themeType="success"
                          children="Save"
                        />
                      </>
                    ) : (
                      <CommonButton
                        icon={<EditOutlined />}
                        onClick={() => setEditAddress(true)}
                        themeType="info"
                        children={`${
                          fields?.length === 0 ? "Add" : "Edit"
                        } Address`}
                      />
                    )}
                  </div>
                  {fields.map((field, i) => (
                    <Card
                      key={field.id}
                      className="mb-3 border border-gray-200 rounded-xl"
                    >
                      {editAddress ? (
                        <div className="grid md:grid-cols-1 sm:grid-cols-1   grid-cols-2 gap-2">
                          <CommonInput
                            id={`billingAddress.${i}.firstName`}
                            label="First Name"
                            type="text"
                            placeholder="First Name"
                            {...register(`billingAddress.${i}.firstName`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.firstName?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.lastName`}
                            label="Last Name"
                            type="text"
                            placeholder="Last Name"
                            {...register(`billingAddress.${i}.lastName`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.lastName?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.address`}
                            label="Address"
                            type="text"
                            placeholder="Address"
                            {...register(`billingAddress.${i}.address`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.address?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.city`}
                            label="City"
                            type="text"
                            placeholder="City"
                            {...register(`billingAddress.${i}.city`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.city?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.state`}
                            label="State"
                            type="text"
                            placeholder="State"
                            {...register(`billingAddress.${i}.state`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.state?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.zipCode`}
                            label="Zip Code"
                            type="text"
                            placeholder="Zip Code"
                            {...register(`billingAddress.${i}.zipCode`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.zipCode?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.country`}
                            label="Country"
                            type="text"
                            placeholder="Country"
                            {...register(`billingAddress.${i}.country`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.country?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />

                          <CommonInput
                            id={`billingAddress.${i}.phoneNumber`}
                            label="Phone Number"
                            type="text"
                            placeholder="Phone Number"
                            {...register(`billingAddress.${i}.phoneNumber`)}
                            errorMessage={
                              errors.billingAddress?.[i]?.phoneNumber?.message
                            }
                            labelClassName="!text-black"
                            required
                            focusColor="black"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={user.billingAddress[i]?.isPrimary}
                              onChange={() => {
                                fields.forEach((_, idx) =>
                                  setValue(
                                    `billingAddress.${idx}.isPrimary`,
                                    false
                                  )
                                );
                                setValue(`billingAddress.${i}.isPrimary`, true);
                              }}
                            />
                            <label className="text-black text-sm font-medium">
                              Set as Primary Address
                            </label>
                          </div>

                          {fields.length > 1 && (
                            <Popconfirm
                              title="Delete this address?"
                              onConfirm={() => remove(i)}
                            >
                              <Button danger icon={<DeleteOutlined />}>
                                Delete
                              </Button>
                            </Popconfirm>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {field.firstName} {field.lastName}
                            {field.isPrimary && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                                Primary
                              </span>
                            )}
                          </h4>
                          <p>
                            {field.address}, {field.city}, {field.state} -{" "}
                            {field.zipCode}
                          </p>
                          <p>{field.country}</p>
                          <p className="text-gray-600">
                            <PhoneOutlined /> {field.phoneNumber}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}

                  {editAddress && (
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() =>
                        append({
                          firstName: "",
                          lastName: "",
                          address: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          country: "",
                          phoneNumber: "",
                          isPrimary: false,
                        })
                      }
                    >
                      Add New Address
                    </Button>
                  )}
                </form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default UserProfilePage;
