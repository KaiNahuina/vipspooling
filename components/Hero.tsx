import React from 'react'
import Image from 'next/image'
import lightbg from '../public/vipbg.jpeg'

const Hero = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Image 
        src={lightbg} 
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  )
}

export default Hero