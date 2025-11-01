"use client";
import { getCookieValue } from "@/helper/CommonUtils";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BsCartCheck, BsFillPersonFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const navbarLinks = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/product",
    name: "Shop",
  },
  {
    path: "/aboutus",
    name: "About us",
  },
  {
    path: "/contactus",
    name: "Contact us",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [request] = useRequestMutation();
  const [isManuOpen, setIsManuOpen] = useState<boolean>(false);

  let isLoggedIn = false;

  const user = getCookieValue("user");
  if (user) {
    isLoggedIn = true;
  }

  const handleLogout = async () => {
    const response: CommonApiInterface = await request({
      url: apis.AUTH.logout,
      method: "POST",
    }).unwrap();
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isManuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isManuOpen]);

  return (
    <nav className="w-full flex justify-between items-center shadow-md px-4 sm:px-6 md:px-10 lg:px-20 py-3 md:py-4 bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center cursor-pointer select-none">
        <Link href="/" className="flex items-center">
          <img
            src="/media/logo.svg"
            alt="LOGO"
            className="h-8 md:h-10 lg:h-12 w-auto"
          />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
        {navbarLinks.map((item, id) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));
          return (
            <Link href={item.path} key={id}>
              <li
                className={`font-medium transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center gap-3">
        {!isLoggedIn && (
          <>
            <Link href="/login">
              <button
                type="button"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
              >
                Signup
              </button>
            </Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link href="/api/v1/user/cart">
              <button
                type="button"
                className="rounded-md bg-green-600 p-2.5 text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
                aria-label="Cart"
              >
                <BsCartCheck className="text-xl" />
              </button>
            </Link>
            <Link href="/api/v1/user/profile">
              <button
                type="button"
                className="rounded-md bg-green-600 p-2.5 text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
                aria-label="Profile"
              >
                <BsFillPersonFill className="text-xl" />
              </button>
            </Link>
            <button
              onClick={() => handleLogout()}
              type="button"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-700 hover:text-green-600 transition-colors"
        onClick={() => setIsManuOpen(true)}
        aria-label="Open menu"
      >
        <FiMenu className="text-3xl" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isManuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
          onClick={() => setIsManuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[280px] sm:w-[320px] md:w-[360px]
          bg-white shadow-2xl z-[999]
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isManuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsManuOpen(false)}
              className="text-gray-600 hover:text-green-600 transition-colors"
              aria-label="Close menu"
            >
              <IoMdClose className="text-3xl" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-6 mb-8 flex-1">
            {navbarLinks.map((item, id) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  href={item.path}
                  key={id}
                  onClick={() => setIsManuOpen(false)}
                  className={`text-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-green-600 pl-2 border-l-4 border-green-600"
                      : "text-gray-700 hover:text-green-600 hover:pl-2"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
            {!isLoggedIn && (
              <>
                <Link href="/login" onClick={() => setIsManuOpen(false)}>
                  <button
                    type="button"
                    className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setIsManuOpen(false)}>
                  <button
                    type="button"
                    className="w-full rounded-md bg-white border-2 border-green-600 px-4 py-3 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 transition-colors duration-200"
                  >
                    Signup
                  </button>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link
                    href="/api/v1/user/cart"
                    onClick={() => setIsManuOpen(false)}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-600 p-3 text-white shadow-sm hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <BsCartCheck className="text-xl" />
                      <span className="text-sm font-semibold">Cart</span>
                    </button>
                  </Link>
                  <Link
                    href="/api/v1/user/profile"
                    onClick={() => setIsManuOpen(false)}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-600 p-3 text-white shadow-sm hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <BsFillPersonFill className="text-xl" />
                      <span className="text-sm font-semibold">Profile</span>
                    </button>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Logoutbtn();
                    setIsManuOpen(false);
                  }}
                  className="w-full rounded-md bg-white border-2 border-green-600 px-4 py-3 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;
