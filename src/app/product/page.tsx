"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Checkbox,
  Pagination,
  Drawer,
  Carousel,
  Card,
  Skeleton,
} from "antd";
import Image from "next/image";
import CommonButton from "@/components/common/CommonButton";
import CommonProductCard from "@/components/common/CommonProductCard";
import { BsFilter } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useRequestMutation } from "@/redux/commonApi";
import {
  CommonDropdownAPIResponse,
  CommonDropdownOptions,
} from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";
import CommonSelect from "@/components/common/CommonSelect";
import {
  ProductClientGridAPIResponse,
  ProductClientGridRecord,
} from "@/interfaces/ProductInterface";

const sortOptions = [
  { id: "1", value: "Price: Low to High" },
  { id: "2", value: "Price: High to Low" },
  { id: "3", value: "Newest" },
  { id: "4", value: "Oldest" },
];

const carouselImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200",
];

const ProductPage = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [timeoutId, setTimeoutId] = useState<any>();

  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [gridData, setGridData] = useState<ProductClientGridRecord[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [sortOption, setSortOption] = useState<CommonDropdownOptions>({});
  const [categoryListData, setcategoryListData] = useState<
    CommonDropdownOptions[]
  >([]);

  const fetchCategoryData = async () => {
    try {
      const response: CommonDropdownAPIResponse = await request({
        url: apis.WITHOUTTOKEN.getAllCategoryList,
        method: "POST",
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        setcategoryListData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };

  const fetchProductData = async () => {
    try {
      const payload = {
        page: page,
        pagesize: pageSize,
        search: SearchText,
        categoryid: selectedCategories,
        pricerange: "",
        sortby: sortOption?.id,
      };

      const response: ProductClientGridAPIResponse = await request({
        url: apis.WITHOUTTOKEN.getProductList,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        setGridData(response?.data?.data);
        setTotalData(response?.data?.recordsFiltered);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (isMobile) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      fetchProductData();
    }, 400);

    setTimeoutId(id);
    return () => clearTimeout(id);
  }, [SearchText, pageSize, sortOption, selectedCategories, page]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    if (filterDrawerOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
    };
  }, [filterDrawerOpen]);

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
          Categories
        </h3>
        <Checkbox.Group
          options={categoryListData.map((item) => ({
            label: item?.value,
            value: item?.id,
          }))}
          value={selectedCategories}
          onChange={(checkedValues) =>
            setSelectedCategories(checkedValues as string[])
          }
          className="flex flex-col gap-3"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Sort By</h3>
        <CommonSelect
          options={sortOptions}
          onChange={(e) => setSortOption(e)}
          value={sortOption}
          placeholder="Select category"
          focusColor="green"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 w-full px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {carouselImages.map((img, idx) => (
            <div key={idx}>
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                <Image
                  src={img}
                  alt={`Slide ${idx}`}
                  width={1920}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="px-6 sm:px-10 md:px-16 text-white">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Discover Amazing Products
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl mb-6">
                      Up to 50% off on selected items
                    </p>
                    <CommonButton
                      children="Shop Now"
                      type="text"
                      themeType="cancel"
                      className="!bg-white !text-gray-900 !px-6 sm:!px-8 !py-3 sm:!py-4 !rounded-full !font-semibold hover:!bg-gray-100 hover:!scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 md:px-6 sm:px-4 pb-12">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <CommonButton
            onClick={() => setFilterDrawerOpen(true)}
            className="!w-full !bg-white !text-gray-800 !border !border-gray-300 !rounded-xl !py-3 !font-semibold !flex !items-center !justify-center !gap-2"
          >
            <BsFilter size={20} />
            Filters & Sort
          </CommonButton>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={0} sm={0} md={0} lg={6} xl={5}>
            <div className="sticky top-16">
              <FilterSidebar />
            </div>
          </Col>

          {/* Product Grid */}
          <Col xs={24} sm={24} md={24} lg={18} xl={19}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl md:text-xl sm:text-lg font-bold text-gray-800">
                {TotalData} Products Found
              </h2>
            </div>

            <Row gutter={[16, 16]}>
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Col xs={12} sm={12} md={8} lg={8} xl={6} key={index}>
                      <Card
                        className="rounded-2xl overflow-hidden shadow-md"
                        cover={
                          <div className="h-64 bg-gray-200 animate-pulse rounded-t-2xl" />
                        }
                      >
                        <div className="p-2">
                          <Skeleton
                            active
                            paragraph={{ rows: 2 }}
                            title={false}
                          />
                        </div>
                      </Card>
                    </Col>
                  ))
                : gridData.map((item) => (
                    <Col xs={12} sm={12} md={8} lg={8} xl={6} key={item?.id}>
                      <CommonProductCard item={item} />
                    </Col>
                  ))}
              {/* {gridData.map((item) => (
                <Col xs={12} sm={12} md={8} lg={8} xl={6} key={item?.id}>
                  <CommonProductCard item={item} />
                </Col>
              ))} */}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <Pagination
                current={page}
                total={TotalData}
                pageSize={pageSize}
                onChange={(page) => setpage(page)}
                showSizeChanger={false}
                className="custom-pagination"
                responsive
                simple={isMobile}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-lg font-bold">
            <BsFilter size={22} />
            Filters & Sort
          </div>
        }
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={300}
      >
        <FilterSidebar />
        <div className="mt-6 flex gap-3">
          <CommonButton
            onClick={() => {
              setSelectedCategories([]);
              setSortOption({});
              if (isMobile) {
                fetchProductData();
              }
            }}
            className="!flex-1 !bg-gray-100 !text-gray-800 !rounded-lg !py-2"
          >
            Clear All
          </CommonButton>
          <CommonButton
            onClick={() => {
              setFilterDrawerOpen(false);
              if (isMobile) {
                fetchProductData();
              }
            }}
            className="!flex-1 !bg-blue-500 !text-white !rounded-lg !py-2"
          >
            Apply
          </CommonButton>
        </div>
      </Drawer>
    </div>
  );
};

export default ProductPage;
