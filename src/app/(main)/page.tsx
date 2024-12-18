import TextAndImage from "@/components/custom/Content/TextAndImage/TextAndImage";
import DestinationsCards from "@/components/custom/Content/DestinationsCards/DestinationsCards";
import Testimonials from "@/components/custom/Testimonials/Testimonials";
import HeroSlickSlider from "@/components/custom/Global/HeroHomeSlider/HeroHomeSlider";
import ItinerarySlider from "@/app/destinations/[slug]/ItinerarySlider";
import CleanTestmnlSlickSlider from "@/components/custom/Global/CleanTestmnlSlickSlider/CleanTestmnlSlickSlider";
import MainLoginSignupSection from "@/components/custom/MainLoginSignupSection/MainLoginSignupSection";

export default async function Home() {
  return (
    <main>
      <MainLoginSignupSection />
    </main>
  );
}
