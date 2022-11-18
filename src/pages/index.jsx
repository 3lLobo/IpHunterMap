import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'
import { Container } from '@/components/Container'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import MapFull from '../components/IpMap/MapFull'

export default function Home({ articles }) {

  return (
    <>
      <Head>
        <title>IP Hunter - 3lLobo</title>
        <meta
          name="description"
          content="Dashboard to help you hunt down the bad guys quicker."
        />
      </Head>
      <Container className="mt-9">
        <div>
          <MapFull />
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16"></div>
          <div className="space-y-10 lg:pl-16 xl:pl-24"></div>
        </div>
      </Container>
    </>
  )
}
