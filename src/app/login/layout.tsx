import MasterLayout from "@/components/MasterLyout";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to access your account",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout showNavbar={true} showFooter={true}>
      {children}
    </MasterLayout>
  );
}
