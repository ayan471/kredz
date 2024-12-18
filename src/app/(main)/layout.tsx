import Header from "@/components/custom/Header/Header";
import Footer from "@/components/custom/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mt-20">{children}</div>
      <Footer />
    </>
  );
}
