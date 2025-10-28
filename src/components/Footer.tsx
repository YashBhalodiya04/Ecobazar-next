import Link from "next/link";
import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitterX,
} from "react-icons/bs";

const Footer = () => {
  return (
    <div className="w-full bg-green-800 flex flex-col items-start justify-center gap-4 px-20 pt-16 sm:px-10 sm:py-10 text-white rounded font-Poppins">
      <div className="w-full grid grid-cols-footer  md:grid-cols-1 sm:grid-cols-1 gap-10">
        <div className="flex flex-col gap-3 items-start justify-center">
          <div className="flex flex-row justify-between items-center cursor-pointer select-none">
            <Link
              href="/"
              className="flex flex-row justify-between items-center"
            >
              <img src='/media/logo.svg' alt="LOGO" className="w-full h-full" />
            </Link>
          </div>
          <p className="text-sm text-start opacity-65">
            Ecobazar takes pride in supporting local farmers and eco-conscious
            brands, fostering a community that values ethical and
            environmentally friendly choices. Embrace a healthier lifestyle with
            our diverse range of organic fruits and vegetables,
          </p>
          <p className="w-full sm:flex sm:flex-col flex items-center justify-center gap-4 underline decoration-green-900 decoration-4 underline-offset-4 opacity-65">
            +91 000000000 <span className="no-underline">or</span>
            Ecobazar@gmail.com
          </p>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start">
          <h1 className="text-lg">My Account</h1>
          <p className="mt-4 text-sm opacity-60 hover:opacity-100">
            My Account
          </p>
          <p className="text-sm opacity-60 hover:opacity-100"> Order History</p>
          <p className="text-sm opacity-60 hover:opacity-100">Shoping Cart</p>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start">
          <h1>Help</h1>
          <Link
            href="/contactus"
            className="mt-4 text-sm opacity-60 hover:opacity-100"
          >
            Contect
          </Link>
          <p className="text-sm opacity-60 hover:opacity-100">
            Term & Condition
          </p>
          <p className="text-sm opacity-60 hover:opacity-100">Privicy Policy</p>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start">
          <h1>Proxy</h1>
          <Link
            href="/aboutus"
            className="mt-4 text-sm opacity-60 hover:opacity-100"
          >
            About
          </Link>
          {/* <Link href="/shop" className="text-sm opacity-60 hover:opacity-100">
            Shop
          </Link> */}
        </div>
        {/* <div className="flex flex-col gap-1 items-start justify-start">
          <h1>Categories</h1>
          <Link
            href="/shop"
            className="mt-4 text-sm opacity-60 hover:opacity-100"
          >
            Fruit & Vagitables
          </Link>
          <Link href="/shop" className="text-sm opacity-60 hover:opacity-100">
            Bread & Bakery
          </Link>
          <Link href="/shop" className="text-sm opacity-60 hover:opacity-100">
            Snacks
          </Link>
        </div> */}
      </div>
      <div className="flex items-center justify-center gap-4 w-full text-4xl">
        <BsFacebook className="cursor-pointer hover:bg-green-500 rounded-full p-1" />
        <BsInstagram className="cursor-pointer hover:bg-green-500 rounded-full p-1" />
        <BsLinkedin className="cursor-pointer hover:bg-green-500 rounded-full p-1" />
        <BsTwitterX className="cursor-pointer hover:bg-green-500 rounded-full p-1" />
      </div>
      <hr className="w-full" />
      <div className="w-full flex items-center justify-center ">
        <p>Ecobazar eCommerce © {new Date().getFullYear()}. All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
