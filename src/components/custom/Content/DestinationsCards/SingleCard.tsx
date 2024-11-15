import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from 'next/image'
import Link from 'next/link'

const SingleCard = (props:any) => {



  return (


    <CarouselItem  key={props.indexId} className=" md:basis-1/2 lg:basis-1/4">
    <div className="p-1 ">
    <Link href={`${props.mainSlugValue}/${props.destinationSlug}`}>
      <Card className={`rounded-3xl transition duration-500 border-b-8 border-t-0 border-r-0 border-l-0 hover:border-[#FFE818] border-white bg-slate-50 bg-cover`} >

        <div className="w-full height-full ">

        <CardContent className=" flex flex-col align-bottom justify-end aspect-square p-0">

        <Image className="rounded-2xl w-full" src={props.thumbnailImage} alt="test" width="1000" height="1000"/>


        { (props.cardImageTitle || props.cardImageSubTitle) && 
            <div className=" flex flex-col gap-4 p-4">
              <div className="text-slate-800 text-xl font-bold  w-full tracking-widest uppercase">{props.cardImageTitle}</div>
              <div className="  w-full text-md ">{props.cardImageSubTitle}</div>
            </div>
        }



    </CardContent>

    </div>

              </Card>
              </Link>
           
              <p className="mt-6 font-semibold">{props.cardTitleMedium}</p>
              <p className="mt-2">{props.cardTitleLarge}</p>
              <p className="mt-2 text-sm">{props.cardTitleSmall}</p>
            </div>
          </CarouselItem>
          

  )
}

export default SingleCard