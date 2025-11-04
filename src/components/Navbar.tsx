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
import CartModal from "./CartModal";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // 👇 new states
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ safely detect cookie only after mount
  useEffect(() => {
    setIsClient(true);
    const user = getCookieValue("user");
    if (user) setIsLoggedIn(true);
  }, []);

  const patharray = ["/user/userprofile"];

  const handleLogout = async () => {
    const response: CommonApiInterface = await request({
      url: apis.AUTH.logout,
      method: "POST",
    }).unwrap();
    if (response?.success) {
      if (patharray.includes(pathname)) {
        router.push("/");
      }
    }
    setIsLoggedIn(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // 🧩 Prevent SSR mismatch by skipping render until client ready
  if (!isClient) return null;

  return (
    <>
      <nav className="w-full flex justify-between items-center shadow-md px-4 sm:px-6 md:px-10 lg:px-20 py-3 md:py-4 bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/media/logo.svg"
            alt="LOGO"
            className="h-8 md:h-10 lg:h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-md bg-green-600 p-2.5 text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
              >
                <BsCartCheck className="text-xl" />
              </button>

              <Link href="/user/userprofile">
                <button
                  type="button"
                  className="rounded-md bg-green-600 p-2.5 text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
                  aria-label="Profile"
                >
                  <BsFillPersonFill className="text-xl" />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                type="button"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-green-600 border-2 border-green-600 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-gray-700 hover:text-green-600 transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu className="text-3xl" />
        </button>

        {/* Mobile menu + overlay (same as before) */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`
          fixed top-0 right-0 h-full w-[280px] sm:w-[320px] md:w-[360px]
          bg-white shadow-2xl z-[999]
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMenuOpen(false)}
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
                    onClick={() => setIsMenuOpen(false)}
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
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors duration-200"
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
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
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-600 p-3 text-white shadow-sm hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={() => setIsCartOpen(true)}
                    >
                      <BsCartCheck className="text-xl" />
                      <span className="text-sm font-semibold">Cart</span>
                    </button>
                    <Link href="/user/userprofile">
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
                      handleLogout();
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
      <CartModal isOpenModal={isCartOpen} setIsOpenModal={setIsCartOpen} />
    </>
  );
};

export default Navbar;
