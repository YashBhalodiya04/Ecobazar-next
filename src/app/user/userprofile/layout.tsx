import MasterLayout from "@/components/MasterLyout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "User Profile",
  description: "User Profile",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout showNavbar={true} showFooter={true} isAuth={true}>
      {children}
    </MasterLayout>
  );
}
