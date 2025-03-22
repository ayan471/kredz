import Header from "@/components/custom/Header/Header";
import Footer from "@/components/custom/Footer/Footer";
import ClientLayout from "@/components/ClientLayout";
import PaymentStatusListener from "../../components/payment-status-listener";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mt-20">
        <ClientLayout>
          <PaymentStatusListener />
          {children}
        </ClientLayout>
      </div>
      <Footer />
    </>
  );
}
