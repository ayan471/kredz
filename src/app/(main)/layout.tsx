import Header from "@/components/custom/Header/Header";

import ClientLayout from "@/components/ClientLayout";
import PaymentStatusListener from "../../components/payment-status-listener";
import { Footer } from "@/components/custom/HomePage/footer";

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
