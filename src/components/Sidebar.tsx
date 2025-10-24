"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import clsx from "clsx";
import { MdCategory } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = [
    {
      name: "Profile",
      icon: <FaUser size={18} />,
      href: "/admin/profile",
      id: 1,
    },
    {
      name: "Category",
      icon: <MdCategory size={18} />,
      href: "/admin/category",
      id: 2,
    },
    {
      name: "Product",
      icon: <AiFillProduct size={18} />,
      href: "/admin/product",
      id: 3,
    },
    {
      name: "Slider",
      icon: <FaImages size={18} />,
      href: "/admin/slider",
      id: 4,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div
      className={clsx(
        "h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-lg",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        <h2
          className={clsx(
            "text-xl font-semibold transition-all duration-200",
            open ? "opacity-100" : "opacity-0 hidden"
          )}
        >
          Admin Panel
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-300 hover:text-white transition-all"
        >
          {open ? <FaTimes size={20} /> : <FaBars size={20} className="ms-3" />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.id} href={item.href}>
              <div
                className={clsx(
                  "flex items-center px-4 py-2 mx-3 rounded-lg cursor-pointer transition-all duration-200 group",
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <div className="mr-3">{item.icon}</div>
                <span
                  className={clsx(
                    "text-sm font-medium transition-all duration-200",
                    open ? "opacity-100" : "opacity-0 hidden"
                  )}
                >
                  {item.name}
                </span>
                {isActive && open && (
                  <FaChevronRight
                    size={14}
                    className="ml-auto text-gray-400 transition-transform group-hover:translate-x-1"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="px-4 py-3 border-t border-slate-700">
        <button
          className="flex items-center w-full text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-all"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={18} className="mr-2" />
          <span className={clsx(open ? "block" : "hidden")}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
