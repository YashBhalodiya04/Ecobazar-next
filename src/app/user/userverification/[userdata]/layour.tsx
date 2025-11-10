import MasterLayout from "@/components/MasterLyout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "User Verification",
  description: "User Verification",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout showNavbar={false} showFooter={false} isAuth={true}>
      {children}
    </MasterLayout>
  );
}
