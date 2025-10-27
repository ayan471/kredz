import DecorativeBackground from "@/components/counter/AnimatedBackground";
import AnimatedCounterSection from "@/components/counter/AnimatedCounterSection";
import { CTABanner } from "@/components/custom/HomePage/cta-banner";
import { FAQ } from "@/components/custom/HomePage/faq";
import { Features } from "@/components/custom/HomePage/features";
import { RatesSection } from "@/components/custom/HomePage/rates-section";
import { Testimonials } from "@/components/custom/HomePage/testimonials";
import { Hero } from "@/components/custom/MainLoginSignupSection/MainLoginSignupSection";

import OurServices from "@/components/custom/OurServices";

import WhyChooseKredz from "@/components/custom/WhyChooseKredz";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  const isLoggedIn = !!user;
  return (
    <main>
      <Hero />
      {/* <OurServices /> */}
      <Features />
      <RatesSection />
      {/* <WhyChooseKredz /> */}

      {/* <AnimatedCounterSection /> */}

      {/* <Testimonials /> */}
      <Testimonials />
      {/* <FAQ /> */}
      <CTABanner />
    </main>
  );
}
