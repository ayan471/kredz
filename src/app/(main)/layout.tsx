import Header from "@/components/custom/Header/Header";
import ClientLayout from "@/components/ClientLayout";
import PaymentStatusListener from "../../components/payment-status-listener";
import { Footer } from "@/components/custom/HomePage/footer";
import Script from "next/script"; // Import the Script component

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1169676705373473');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1169676705373473&ev=PageView&noscript=1"
        />
      </noscript>

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
