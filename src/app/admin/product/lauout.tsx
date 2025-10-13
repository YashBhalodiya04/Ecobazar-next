import MasterLayout from "@/components/MasterLyout";

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
      masterName="Product"
    />
  );
}
