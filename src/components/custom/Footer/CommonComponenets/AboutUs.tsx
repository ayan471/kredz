import React from 'react'
import Image from 'next/image'

const AboutUs = () => {
  return (
    <div className="flex flex-col">
    <Image src="/global/geranos-logo.png" className="mb-4" width="140" height="80" alt="Gerenos Logo"/>
    <div>Discover Punjab with our tourism website, your guide to its rich heritage and scenic beauty. Explore top attractions like the Golden Temple, Shivalik hills, and more.</div>
    </div>
  )
}

export default AboutUs