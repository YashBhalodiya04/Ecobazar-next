"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "./Navbar";

interface MasterLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  isAuth?: boolean;
}

export default function MasterLayout({
  children,
  showNavbar = true,
  showFooter = true,
  isAuth = false,
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* {showNavbar && <Navbar />} */}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
