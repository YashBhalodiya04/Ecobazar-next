import MasterLayout from "@/components/MasterLyout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Common Master",
  description: "Common Master management",
};


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout
      showNavbar={false}
      showFooter={false}
      isShowSidebar={true}
      children={children}
      masterName="Common Master"
    />
  );
}
