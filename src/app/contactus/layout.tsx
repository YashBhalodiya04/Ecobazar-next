import MasterLayout from "@/components/MasterLyout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for any inquiries or feedback",
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
