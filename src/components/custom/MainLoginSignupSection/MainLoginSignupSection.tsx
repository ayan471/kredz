import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'

const MainLoginSignupSection = async() => {


    const user = await currentUser()

  return (
    <div className="flex flex-row py-4">

        <div className="flex-1 my-auto">
            <div className="max-w-[700px] mx-auto my-auto flex flex-col gap-6">
                <h1 className="capitalize text-6xl font-bold">Sabse best financial consultation & service</h1>
                <p className="text-2xl">Optimize and streamline your finanaces with beneficial subscription plans.</p>
                <Button className="text-2xl max-w-min p-6">Apply Now</Button>
            </div>
        </div>


        <div className="flex-1 flex align-middle justify-center">

            {
            user?<Image className="max-w-[720px]" src="/global/collage-24.jpg" height="1920" width="1920" alt="Hero Image"/>:<div className="py-16"><SignIn /></div>
            }

            
        </div>        




    </div>
  )
}

export default MainLoginSignupSection