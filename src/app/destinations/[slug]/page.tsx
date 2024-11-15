import React from 'react'


import HeroBanner from './HeroBanner'
import ShortDescription from './ShortDescription'
import DataCards from './DataCards'
import AllItenarySlider from './AllItenarySlider'
import ItinerarySlider from './ItinerarySlider'

export const revalidate = 10;

const Destinations = async({params}:any) => {

  const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/itineraries?acf_format=standard`, { cache: 'no-store' }); 
  const itineraries = await req.json(); 


  

  return (
    <div>
        
        
 

        <HeroBanner slug={params.slug}/>
 
        <ShortDescription/>
        <DataCards/>


          <ItinerarySlider 
          cstmClass="u-tp-cstm"
          itineraries={itineraries} 
          destinationFilterSlug={params.slug}
          offeringFilterSlug="Tour Packages"
          />


          <ItinerarySlider 
          cstmClass="u-wg-cstm"
          itineraries={itineraries} 
          destinationFilterSlug={params.slug}
          offeringFilterSlug="Weekend Getaways"
          />


          <ItinerarySlider 
          cstmClass="u-exp-cstm"
          itineraries={itineraries} 
          destinationFilterSlug={params.slug}
          offeringFilterSlug="Experiences"
          />




    


    </div>
  )
}

export default Destinations