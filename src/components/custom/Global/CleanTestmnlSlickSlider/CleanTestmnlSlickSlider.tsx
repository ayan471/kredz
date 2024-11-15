

'use client'

import { useEffect } from 'react';
import React, { useState } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Testimonials from '../../../../../public/data/Testimonials.json'

import Image from 'next/image'



import SingleTestmnlSlickCard from "./SingleTestmnlSlickCard"

const CleanTestmnlSlickSlider = (props:any) => {

  const [fullVisibility, setFullVisibility] = useState("");
  const [btnVisibility, setBtnVisibility] = useState("hidden");
  let counter=0;



  useEffect(() => {
    return () => {
      
   
      console.log(props.itineraries)

    };
  }, []);



    var test = {
        dots: true,
        buttons:true,
        infinite: false,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay:false,
        pauseOnHover: false,
        waitForAnimate: false,
        adaptiveHeight: true,
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
        <div className={`px-[16px] md:p-8 ${fullVisibility} ${props.cstmClass} max-w-[1600px] mx-auto`}>

      <p className=" text-3xl md:text-5xl font-bold text-slate-800 text-center mb-6 md:mb-8">Testimonials</p>

    <Slider {...test}>


    {Testimonials && Testimonials.map((Testimonial:any) => (

      


        <div key={Testimonial.id} className="p-0 md:p-4">
          <div className=" p-0 md:p-4  ">

          <SingleTestmnlSlickCard
          key=""

          name={Testimonial.name}
          personImage={Testimonial.personImage}          
          testimonial={Testimonial.testimonial}
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




export default CleanTestmnlSlickSlider





