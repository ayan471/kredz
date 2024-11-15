import React from 'react'
import ErrorImage from '@/app/404.svg'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PageNotFound from '@/components/custom/Global/PageNotFound'


const NotFound = () => {
  return (
    <PageNotFound/>
  )
}

export default NotFound