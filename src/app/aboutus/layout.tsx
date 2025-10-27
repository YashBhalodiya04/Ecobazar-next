import MasterLayout from "@/components/MasterLyout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and our mission",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout showNavbar={true} showFooter={true} isAuth={false}>
      {children}
    </MasterLayout>
  );
}
