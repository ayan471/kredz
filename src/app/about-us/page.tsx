import TextAndImage from "@/components/custom/Content/TextAndImage/TextAndImage";
import DestinationsCards from "@/components/custom/Content/DestinationsCards/DestinationsCards";
import Testimonials from '@/components/custom/Testimonials/Testimonials'
import HeroSlickSlider from '@/components/custom/Global/HeroHomeSlider/HeroHomeSlider'
import ItinerarySlider from '@/app/destinations/[slug]/ItinerarySlider'
import CleanTestmnlSlickSlider from "@/components/custom/Global/CleanTestmnlSlickSlider/CleanTestmnlSlickSlider";
import MainLoginSignupSection from "@/components/custom/MainLoginSignupSection/MainLoginSignupSection";

export default async function Home() {



  const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/itineraries?acf_format=standard&_fields=id,slug,title,acf`, { cache: 'no-store' }); 
  const itineraries = await req.json(); 


  return (
    <main className="flex min-h-screen flex-col">



    <HeroSlickSlider/>

      <div className="min-h-[0px] xl:min-h-[40px] block xl:hidden"></div>







      <div className="mb-12 md:mb-0">


        
          <ItinerarySlider 
          mainTitle=""
          itineraries={itineraries} 
          destinationFilterSlug="home-page"
          offeringFilterSlug="Tour Packages"
          />
          </div>




      <TextAndImage 
      imageLink="/global/collage-20.png"
      imagePostion="right"
      titleText="About Credit Samdhan"
      subHeading="Empowering Communities through Microfinance"
      content="<p>Credit Samdhan is dedicated to providing microfinance solutions that empower individuals and small businesses. We offer tailored financial services, including small loans and savings schemes, to help underserved communities achieve economic independence. Our mission is to bridge financial gaps and support clients in building sustainable futures. Through transparency and a customer-first approach, we strive to make a positive impact and foster financial inclusion across the communities we serve.</p>"
      ctaText="Learn More"
      ctaLink=""
      />

      <TextAndImage 
      imageLink="/global/collage-24.jpg"      
      imagePostion="left"
      titleText="Solutions we offer"
      subHeading="Sustainable Banking for Social Empowerment"  
      content="<p>Credit Samdhan offers microfinance services to foster economic growth. With a focus on sustainable banking. <span style=''>We are committed to empowering women by providing microfinance to help them start and grow businesses</span>, driving self-reliance and community upliftment. We are committed to empowering women by providing microfinance to help them start and grow businesses, driving self-reliance and community upliftment.</p>"
      ctaText="Learn More"
      ctaLink=""    
      />  
      
      <TextAndImage 
      imageLink="/global/collage-22.jpg"      
      imagePostion="right"
      titleText="Why Credit Samdhan?"
      subHeading="We will support you in your financial journey"
      content="<p>At Credit Samdhan, we focus on your financial well-being with personalized solutions tailored to your needs. Our commitment to transparency and customer satisfaction ensures reliable services. We specialize in microfinance for small businesses, particularly assisting women entrepreneurs and promoting sustainable banking practices. Our dedicated team provides the tools and support you need to achieve financial independence. With Credit Samdhan, you’re not just getting a loan; you’re building a brighter, more secure future.</p>"
      ctaText="Learn More"
      ctaLink=""
      />   


   







        <div className="mt-2 md:mt-12 w-full">  
          <CleanTestmnlSlickSlider/>
        </div>





    </main>
  );
}
