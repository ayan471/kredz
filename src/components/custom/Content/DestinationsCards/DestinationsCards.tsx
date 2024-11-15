/*

              <div className="">
                  <AlgoliaBlueButton  ctaText="All Offerings" ctaLink="/"/>
              </div>

*/ 

import React from 'react'
import Heading from './Heading'
import AlgoliaBlueButton from "@/components/animata/text/button/algolia-blue-button";
import DestinationSlider from './DestinationSlider'

const DestinationsCards = (props:any) => {
  return (
    <div className="max-w-[1800px] px-[48px] flex m-auto w-full mt-2">
        <div className="flex gap-4 flex-col justify-between w-full xl:flex-row p-4">
            <div className="w-full flex flex-col align-middle justify-center gap-2">

              <div className="mb-2 text-center flex flex-col gap-4">
                <h2 className="text-2xl md:text-4xl font-bold text-[#246BEB] text-center mt-8">{props.cardTitle}</h2>
                <h3 className="text-xl md:text-2xl text-slate-700 font-medium">Authentic Experiences</h3>

              </div>

                <DestinationSlider acfPostTypeSlug={props.acfPostTypeSlug} />
                
            </div>
        </div>
    </div>
  )
}

export default DestinationsCards