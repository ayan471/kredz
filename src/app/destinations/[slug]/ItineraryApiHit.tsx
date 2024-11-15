
import React from 'react'

const ItineraryApiHit = async() => {


    const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/pages?acf_format=standard&_fields=id,slug,title,content,acf`); 
    const pages = await req.json(); 

  return (
    <div>ItineraryApiHit</div>
  )
}

export default ItineraryApiHit