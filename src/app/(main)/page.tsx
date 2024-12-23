import DecorativeBackground from "@/components/counter/AnimatedBackground";
import AnimatedCounterSection from "@/components/counter/AnimatedCounterSection";
import MainLoginSignupSection from "@/components/custom/MainLoginSignupSection/MainLoginSignupSection";
import OurServices from "@/components/custom/OurServices";
import Testimonials from "@/components/custom/Testimonials";
import WhyChooseKredz from "@/components/custom/WhyChooseKredz";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  const isLoggedIn = !!user;
  return (
    <main>
      <MainLoginSignupSection isLoggedIn={isLoggedIn} />
      <OurServices />
      <WhyChooseKredz />
      <DecorativeBackground />
      <div className="relative z-10">
        <AnimatedCounterSection />
      </div>
      <Testimonials />
    </main>
  );
}
