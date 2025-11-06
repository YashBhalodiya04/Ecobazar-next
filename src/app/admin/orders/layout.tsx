import MasterLayout from "@/components/MasterLyout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders management",
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
      masterName="Orders"
    />
  );
}
