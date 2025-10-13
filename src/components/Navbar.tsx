"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BsCartCheck, BsFillPersonFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
const navbarLinks = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/shop",
    name: "Shop",
  },
  {
    path: "/about",
    name: "About us",
  },
  {
    path: "/contact",
    name: "Contact us",
  },
];

const Navbar = () => {
  const [isManuOpen, setIsManuOpen] = useState<boolean>(false);
  const isLoggedIn = false;
  return (
    <nav className="w-full flex justify-between items-center rounded overflow-hidden shadow-md px-20 py-4 sm:px-2 sm:py-3 bg-white">
      <div className="flex flex-row justify-between items-center cursor-pointer select-none ">
        <Link href="/" className="flex flex-row justify-between items-center">
          <img src="/media/logo.svg" alt="LOGO" className="h-full" />
          {/* <h1 className=" font-serif font-medium text-[32px] text-white sm:text-lg">
            Ecobazar
          </h1> */}
        </Link>
      </div>

      <div
        className={`flex items-center justify-between gap-4 sm:hidden md:hidden`}
      >
        {navbarLinks.map((item, id) => {
          return (
            <Link href={item.path} key={id}>
              <li className=" block text-black p-2">{item.name}</li>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4 sm:hidden md:hidden ">
        {!isLoggedIn && (
          <>
            <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <Link href="/login">Login</Link>
            </button>
            <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <Link href="/signup">Signup</Link>
            </button>
          </>
        )}
        {isLoggedIn && (
          <>
            <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <Link href="/api/v1/user/cart">
                <BsCartCheck className="text-xl" />
              </Link>
            </button>
            <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <Link href="/api/v1/user/profile">
                <BsFillPersonFill className="text-xl" />
              </Link>
            </button>
            <button
              type="button"
              // onClick={Logoutbtn}
              className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="lg:hidden sm:block md:block z-0">
        <FiMenu
          className="text-3xl text-gray-700 cursor-pointer"
          onClick={() => setIsManuOpen(true)}
        />
      </div>

      {/* Sidebar */}

      <div
        className={`${
          isManuOpen
            ? " visible md:w-full md:fixed md:h-full md:top-0  md:backdrop-blur-sm  md:right-0 z-[900]"
            : "-right-full hidden"
        }`}
      >
        <nav className="w-[40%] sm:w-[60%] h-full absolute top-0 right-0 p-8 flex flex-col justify-between bg-gray-100 gap-6 lg:hidden">
          <div className="self-end mr-10">
            <IoMdClose
              className="text-3xl text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsManuOpen(false)}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-6">
            {navbarLinks.map((item, id) => {
              return (
                <Link
                  href={item.path}
                  key={id}
                  onClick={() => setIsManuOpen(false)}
                  className="text-lg hover:font-semibold hover:pl-1 transition-all cursor-pointer"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            {!isLoggedIn && (
              <>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <Link href="/login" onClick={() => setIsManuOpen(false)}>
                    Login
                  </Link>
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <Link href="/signup" onClick={() => setIsManuOpen(false)}>
                    Signup
                  </Link>
                </button>
              </>
            )}
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <Link href="/api/v1/user/cart">
                    <BsCartCheck
                      className="text-xl"
                      onClick={() => setIsManuOpen(false)}
                    />
                  </Link>
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <Link href="/api/v1/user/profile">
                    <BsFillPersonFill
                      className="text-xl"
                      onClick={() => setIsManuOpen(false)}
                    />
                  </Link>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Logoutbtn();
                    setIsManuOpen(false);
                  }}
                  className="rounded-md bg-green-600 px-3 py-2 text-sm hover:text-green-700 hover:bg-white font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
