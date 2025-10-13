"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface MasterLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  isAuth?: boolean;
  isShowSidebar?: boolean;
  masterName?: string;
}

export default function MasterLayout({
  children,
  showNavbar = true,
  showFooter = true,
  isAuth = false,
  isShowSidebar = false,
  masterName = "",
}: MasterLayoutProps) {
  const router = useRouter();

  //   useEffect(() => {
  //     if (isAuth) {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         router.push("/"); // redirect if not logged in
  //       }
  //     }
  //   }, [isAuth, router]);

  if (isShowSidebar) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          {/* ✅ Top Navbar */}
          <header className="sticky top-0 z-20 flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-6 py-3 shadow-sm">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              {masterName}
            </h1>
          </header>

          {/* ✅ Page Content */}
          <main className="flex-1 p-6 overflow-y-auto ">{children}</main>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
