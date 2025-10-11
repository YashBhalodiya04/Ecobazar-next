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
    <MasterLayout showNavbar={false} showFooter={false} isAuth={false}>
      {children}
    </MasterLayout>
  );
}
