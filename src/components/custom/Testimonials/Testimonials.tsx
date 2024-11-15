

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import TestimonialCard from "./TestimonialCard"

export default async function CarouselDemo() {

  const res = await fetch('https://dashboard.geranosgetaways.com/wp-json/wp/v2/testimonials?acf_format=standard');
  const testimonials = await res.json();


  return (

    <div className="cstmClsTestiminial">

    <h2 className=" text-3xl md:text-5xl font-bold text-slate-800 font-EduVICWANTBeginner text-center mb-8">Testimonials</h2>

    <div className="max-w-[1800px] px-[16px] md:px-[64px] flex m-auto w-full">




    <Carousel
    
    opts={{
      align: "start",
    }}
    className="w-full"    
    
    >
      <CarouselContent>
        {testimonials && testimonials.map((testimonial:any) => (

          <CarouselItem key={testimonial.id} className=" md:basis-1/2 xl:basis-1/3">
            <div className="p-1 h-full">
              <Card className="rounded-none h-full">
                <CardContent className="flex items-center justify-center p-6 ">
                  <TestimonialCard 
                    testimnlName={testimonial.title.rendered}
                    testimnlDesignation={testimonial.acf.designation}
                    testimnlTestimonial={testimonial.acf.testimonial}
                    testimnlPersonImage={testimonial.acf.personimage}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext />
    </Carousel>

    </div>


    </div>
  )
}
