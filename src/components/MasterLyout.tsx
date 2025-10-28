"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { getCookieValue } from "@/helper/CommonUtils";
import { JWtUserInterface } from "@/interfaces/commonInterace";
import { SignInResponseData } from "@/interfaces/SignInInterface";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = getCookieValue("user");
  const userData: SignInResponseData = JSON.parse(user || "{}");
  if (userData && userData?.isAdmin === true && isShowSidebar) {
    return (
      <div className="flex h-screen bg-black text-white overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white truncate">
                {masterName}
              </h1>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950 p-4 md:p-6">
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Layout without sidebar
  return (
    <div className="flex flex-col min-h-screen  text-white">
      {showNavbar && <Navbar />}
      <main className="flex-1 md:p-6">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
