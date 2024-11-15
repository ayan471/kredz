'use client'

import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './SlickSlider.css'
import Image from 'next/image'


const MainContactUsFields = () => {


    var settings = {
        dots: false,
        buttons:true,
        fade: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        pauseOnHover: false,
        waitForAnimate: false,
        nextArrow: <ChevronRightIcon />,
        prevArrow: <ChevronLeftIcon />
      };


  return (
    <>

    <Slider 

    {...settings}>


      <p>test1</p>

      <p>test2</p>





    </Slider>



    </>
  )
}




function ChevronLeftIcon(props:any) {
    return (
        <Image {...props} src="/global/banners/left.png" width="160" height="160" alt="Left Slide Icon"/>
    )
  }
  
  
  function ChevronRightIcon(props:any) {
    return (
        <Image {...props} src="/global/banners/right.png" width="160" height="160" alt="Right Slide Icon"/>
    )
  }

export default MainContactUsFields