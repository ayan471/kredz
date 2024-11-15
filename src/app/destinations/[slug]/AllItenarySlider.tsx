import React from 'react'
import ItinerarySlider from "./ItinerarySlider"

const AllItenarySlider = (props:any) => {




  return (
    <div className="">
        <p>{props.StateFilterID}</p>
        <p>{props.OfferingFilterID}</p>
     
        <ItinerarySlider itineraries={props.itineraries} slug={props.slug} StateFilterID={props.StateFilterID} OfferingFilterID={props.OfferingFilterID}/>


    </div>
  )
}

export default AllItenarySlider