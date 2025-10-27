import MasterLayout from "@/components/MasterLyout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up to access your account",
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
