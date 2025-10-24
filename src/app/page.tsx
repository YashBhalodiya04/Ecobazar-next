// "use client";
import Categories from "@/components/HomeComponents/Categories";
import Features from "@/components/HomeComponents/Features";
import PosterSlider from "@/components/HomeComponents/PosterSlider";
import Products from "@/components/HomeComponents/Products";
import MasterLayout from "@/components/MasterLyout";
import { useRequestMutation } from "@/redux/commonApi";

export default function Home() {
  const slides = [
    {
      _id: "1",
      title: "Mega Festive Offers",
      description: "Celebrate the season with our biggest discounts yet!",
      image: "/media/login.jpg",
    },
    {
      _id: "2",
      title: "New Arrivals",
      description: "Discover our latest collection and upgrade your style.",
      image: "/media/login.jpg",
    },
    {
      _id: "3",
      title: "Exclusive Deals",
      description: "Limited time offers on top-rated products.",
      image: "/media/login.jpg",
    },
  ];

  const categoryData = [
    {
      id: 1,
      name: "Electronics",
      image: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
    },
    {
      id: 3,
      name: "Home & Kitchen",
      image: "https://cdn-icons-png.flaticon.com/512/706/706164.png",
    },
    {
      id: 4,
      name: "Beauty & Health",
      image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
    {
      id: 5,
      name: "Sports & Fitness",
      image: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
    },
    {
      id: 6,
      name: "Toys & Games",
      image: "https://cdn-icons-png.flaticon.com/512/3203/3203071.png",
    },
  ];

  const productData = [
    {
      id: 1,
      name: "Green Apple",
      price: 11.99,
      rating: 4.5,
      image: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    },
    {
      id: 2,
      name: "Fresh Indian Malta",
      price: 14.29,
      rating: 1,
      image: "https://cdn-icons-png.flaticon.com/512/415/415734.png",
    },
    {
      id: 3,
      name: "Fresh Indian Malta",
      price: 14.29,
      rating: 4,
      image: "https://cdn-icons-png.flaticon.com/512/415/415734.png",
    },
    // ...more items
  ];

  return (
    <MasterLayout showNavbar={true} showFooter={true}>
      <div className="flex flex-col justify-between items-center w-full px-20 sm:px-10 ">
        <PosterSlider slides={slides} />
        <Features />
        <Categories categories={categoryData} />
        <Products productList={productData} />
      </div>
    </MasterLayout>
  );
}
