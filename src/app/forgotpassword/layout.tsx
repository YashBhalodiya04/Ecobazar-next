import MasterLayout from "@/components/MasterLyout";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MasterLayout showNavbar={false} showFooter={false}>
      {children}
    </MasterLayout>
  );
}
