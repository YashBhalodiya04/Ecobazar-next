"use client";

import React, { useEffect } from "react";
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

interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SideBarProps) => {
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

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static inset-y-0 left-0 z-50",
          "h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white",
          "flex flex-col transition-all duration-300 shadow-lg",
          // Mobile: slide in/out completely
          "md:translate-x-0",
          // Desktop: show icons only when closed, full width when open
          isSidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2
            className={clsx(
              "text-xl font-semibold transition-all duration-200 whitespace-nowrap",
              isSidebarOpen ? "opacity-100" : "opacity-0 md:hidden"
            )}
          >
            Admin Panel
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white transition-all"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} className="md:ml-0" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.id} href={item.href} onClick={handleLinkClick}>
                <div
                  className={clsx(
                    "flex items-center px-4 py-3 mx-3 rounded-lg cursor-pointer transition-all duration-200 group relative",
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  )}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <div className="min-w-[24px] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span
                    className={clsx(
                      "text-sm font-medium transition-all duration-200 whitespace-nowrap ml-3",
                      isSidebarOpen
                        ? "opacity-100 block"
                        : "opacity-0 w-0 hidden md:hidden"
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && isSidebarOpen && (
                    <FaChevronRight
                      size={14}
                      className="ml-auto text-gray-400 transition-transform group-hover:translate-x-1"
                    />
                  )}

                  {/* Tooltip for collapsed desktop view */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-700"></div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="px-4 py-3 border-t border-slate-700">
          <button
            className="flex items-center w-full text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-3 rounded-lg transition-all group relative"
            onClick={handleLogout}
            title={!isSidebarOpen ? "Logout" : undefined}
          >
            <div className="min-w-[24px] flex items-center justify-center">
              <FaSignOutAlt size={18} />
            </div>
            <span
              className={clsx(
                "ml-3 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                isSidebarOpen
                  ? "opacity-100 block"
                  : "opacity-0 w-0 hidden md:hidden"
              )}
            >
              Logout
            </span>

            {/* Tooltip for collapsed desktop view */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-700"></div>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;






// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   FaHome,
//   FaImages,
//   FaCog,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaChevronRight,
// } from "react-icons/fa";
// import clsx from "clsx";
// import { MdCategory } from "react-icons/md";
// import { AiFillProduct } from "react-icons/ai";
// import { FaUser } from "react-icons/fa6";

// interface SideBarProps {
//   isSidebarOpen: boolean;
//   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SideBarProps) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const menuItems = [
//     {
//       name: "Profile",
//       icon: <FaUser size={18} />,
//       href: "/admin/profile",
//       id: 1,
//     },
//     {
//       name: "Category",
//       icon: <MdCategory size={18} />,
//       href: "/admin/category",
//       id: 2,
//     },
//     {
//       name: "Product",
//       icon: <AiFillProduct size={18} />,
//       href: "/admin/product",
//       id: 3,
//     },
//     {
//       name: "Slider",
//       icon: <FaImages size={18} />,
//       href: "/admin/slider",
//       id: 4,
//     },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     router.push("/login");
//   };

//   return (
//     <div
//       className={clsx(
//         "h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-lg",
//         isSidebarOpen ? "w-64" : "w-20"
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
//         <h2
//           className={clsx(
//             "text-xl font-semibold transition-all duration-200",
//             isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
//           )}
//         >
//           Admin Panel
//         </h2>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="text-gray-300 hover:text-white transition-all"
//         >
//           {isSidebarOpen ? (
//             <FaTimes size={20} />
//           ) : (
//             <FaBars size={20} className="ms-3" />
//           )}
//         </button>
//       </div>

//       {/* Menu Items */}
//       <div className="flex-1 py-4 space-y-1">
//         {menuItems.map((item) => {
//           const isActive = pathname.startsWith(item.href);
//           return (
//             <Link key={item.id} href={item.href}>
//               <div
//                 className={clsx(
//                   "flex items-center px-4 py-2 mx-3 rounded-lg cursor-pointer transition-all duration-200 group",
//                   isActive
//                     ? "bg-slate-700 text-white"
//                     : "text-gray-300 hover:bg-slate-700 hover:text-white"
//                 )}
//               >
//                 <div className="mr-3">{item.icon}</div>
//                 <span
//                   className={clsx(
//                     "text-sm font-medium transition-all duration-200",
//                     isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
//                   )}
//                 >
//                   {item.name}
//                 </span>
//                 {isActive && isSidebarOpen && (
//                   <FaChevronRight
//                     size={14}
//                     className="ml-auto text-gray-400 transition-transform group-hover:translate-x-1"
//                   />
//                 )}
//               </div>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Footer / Logout */}
//       <div className="px-4 py-3 border-t border-slate-700">
//         <button
//           className="flex items-center w-full text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-all"
//           onClick={handleLogout}
//         >
//           <FaSignOutAlt size={18} className="mr-2" />
//           <span className={clsx(isSidebarOpen ? "block" : "hidden")}>
//             Logout
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
