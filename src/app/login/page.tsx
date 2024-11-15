import React from 'react'
import ErrorImage from '@/app/404.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Login = () => {
  return (
    <div className="min-h-80">

    <div className="min-h-[440px] flex flex-col text-center align-center justify-center">
      <Image className="m-auto" src={ErrorImage} alt="404 Error Image" width="300" height="400"/>
      <p className="mb-4">Or you can</p>
      <Link href="/sign-up"><Button className="max-w-min m-auto">Sign Up</Button></Link>
    </div>

    </div>
  )
}

export default Login