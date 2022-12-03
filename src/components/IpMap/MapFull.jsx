// Use this context to select the sace, get the geoData per IP and plot them on the map.
import React, { useState, useEffect, useMemo } from 'react'
// import { CaseDropdown } from '@/components/IpTable/CaseDropdown'
import axios from 'axios'
import CaseDropdown from './CaseDrowpdown'
import { useSyncData } from '@/hooks/useSyncData'
import dynamic from 'next/dynamic'
import MockGeoCase1 from '@/mock/geoCase1.json'
import MockGeoCase2 from '@/mock/geoCase2.json'
import { Wrapper } from '@googlemaps/react-wrapper'
import Map from './IpScatterMap'

// const DynamicMap = dynamic(() => import('@/components/IpMap/IpScatterMap'), {
//   ssr: false,
// })

function MapFull() {
  const [activeCase, setActiveCase] = useState({
    caseId: 2,
    description: 'IpHunter',
  })

  const { tableData, hunterIds, isError } = useSyncData(activeCase)
  const [geoData, setGeoData] = useState()
  useEffect(() => {
    async function callGeo() {
      const data = await getGeoData(
        tableData.map((d) => d.data),
        activeCase.caseId
      )
      // Add the RiskIq score to the geoData
      const dataWithRisk = data.map((d, i) => {
        return { ...d, riskIq: tableData[i]?.riskIq || 100 }
      })

      setGeoData(dataWithRisk)
    }
    if (activeCase && tableData.length > 0) {
      callGeo()
    }
  }, [tableData, activeCase])

  return (
    <div>
      <CaseDropdown activeCase={activeCase} setActiveCase={setActiveCase} />
      {geoData && (
        <Wrapper
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={['visualization']}
        >
          <Map markers={geoData} />
        </Wrapper>
      )}
    </div>
  )
}

// get the geodata for each Ip
async function getGeoData(ipData, caseId) {
  let res
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    if (caseId === 1) {
      res = MockGeoCase1
    } else if (caseId === 2) {
      res = MockGeoCase2
    } else {
      return
    }
  } else {
    if (ipData) {
      res = await axios.all(
        ipData.map((ip) =>
          axios.get('https://api.apilayer.com/ip_to_location/' + ip, {
            headers: {
              apikey: `${process.env.NEXT_PUBLIC_APILAYER_KEY}`,
            },
          })
        )
      )
    }
  }
  // console.log('res', res)
  const data = res.filter((d) => d.status === 200).map((d) => d.data)
  return data
}

export default MapFull
