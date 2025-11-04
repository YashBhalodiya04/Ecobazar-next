"use client";
import CommonLoader from "@/components/common/CommonLoader";
import Categories from "@/components/HomeComponents/Categories";
import Features from "@/components/HomeComponents/Features";
import PosterSlider from "@/components/HomeComponents/PosterSlider";
import Products from "@/components/HomeComponents/Products";
import MasterLayout from "@/components/MasterLyout";
import {
  HomeDataResponse,
  HomePageAPIResponse,
} from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [request] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);

  const [homeData, sethomeData] = useState<HomeDataResponse | null>(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response: HomePageAPIResponse = await request({
        url: apis.WITHOUTTOKEN.getHomeData,
        method: "POST",
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        sethomeData(response?.data);
      } else {
        sethomeData(null);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);
  
  return (
    <>
      {/* <CommonLoader loading={loading} /> */}
      <MasterLayout showNavbar={true} showFooter={true}>
        <div className="flex flex-col justify-between items-center w-full px-20 md:px-0 ">
          <PosterSlider slides={homeData?.slidersData || []} isLoading={loading} />
          <Features />
          <Categories categories={homeData?.categoryData || []} isLoading={loading} />
          <Products productList={homeData?.productData || []} isLoading={loading} />
        </div>
      </MasterLayout>
    </>
  );
}
