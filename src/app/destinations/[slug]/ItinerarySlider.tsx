

'use client'

import { useEffect } from 'react';
import React, { useState } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HomeSliderCards from '../../../../public/data/HomeSliderCards.json'

import Image from 'next/image'



import SingleCard2 from "./SingleCard2"

const MainContactUsFields = (props:any) => {

  const [fullVisibility, setFullVisibility] = useState("");
  const [btnVisibility, setBtnVisibility] = useState("hidden");
  let counter=0;



  useEffect(() => {
    return () => {
      
   
      console.log(props.itineraries)

     props.itineraries.map((itinerary:any) => {




      if((itinerary.acf.offerings === props.offeringFilterSlug) && (itinerary.acf.destination.post_name === props.destinationFilterSlug)) {
        setFullVisibility("");
        counter++;
        if(counter>4) {
          setBtnVisibility("");
          console.log("yes");
        }

      }
      
 
      



    });
        

 

    };
  }, []);



    var test = {
        dots: true,
        buttons:true,
        infinite: false,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay:false,
        pauseOnHover: false,
        waitForAnimate: false,
        nextArrow: <ChevronRightIcon btnVisibility={btnVisibility}/>,
        prevArrow: <ChevronLeftIcon  btnVisibility={btnVisibility}/>,
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
      };



      

  return (
    <>
        <div className={`px-[16px] md:p-8 ${fullVisibility} ${props.cstmClass}`}>

      <p className=" text-3xl md:text-5xl font-bold text-slate-800  text-center mb-8">{props.mainTitle}</p>

    <Slider {...test}>


    {HomeSliderCards && HomeSliderCards.map((HomeSliderCard:any) => (

      


        <div key={HomeSliderCard.id} className="p-0 md:p-4">
          <div className="bg-slate-50 p-0 md:p-4  md:hover:shadow-md">

          <SingleCard2
          key=""
          mainSlugValue=""
          thumbnailImage={HomeSliderCard.backgroundImg}
          cardImageTitle={HomeSliderCard.title}
          cardImageSubTitle={HomeSliderCard.subTitle}
          />
          
          </div>
        </div>
       
        

    ))}
  

  


    </Slider>

    </div>

    </>
  )
}


function ChevronLeftIcon(props:any) {
  return (
      <Image {...props} className={`${props.btnVisibility} bg-[#2F6BEB] max-w-[60px] shadow rounded-xl absolute top-[47%]  left-[0px] z-10`} src="/global/banners/left.png" width="160" height="160" alt="Left Slide Icon"/>
  )
}


function ChevronRightIcon(props:any) {
  return (
        <Image  {...props}  className={` bg-[#2F6BEB] max-w-[60px] shadow rounded-xl absolute top-[47%]  right-[0px] z-10`} src="/global/banners/right.png" width="160" height="160" alt="Right Slide Icon"/>
  )
}




export default MainContactUsFields