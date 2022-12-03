// Plot a map with deck.gl and google maps. Use the deck.gl Scatterplot to render circles on the map based on the input coordinates.

import React, { useState, useEffect, useMemo } from 'react'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import GMap from './Gmap'
import * as d3 from 'd3'
import { getIpLayer, moreMarkers, nextFilter } from './deckFunctions'
import { defang } from 'fanger'
import Image from 'next/image'
import { RADIUS } from '@/constants/plotVars'

const center = {
  lat: 19.076,
  lng: 72.8777,
}

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  center: center,
  zoom: 1,
  mapId: '165666623396befc',
  // disableDefaultUI: true,
  // gestureHandling: 'greedy',
  zoomControl: true,
  fullscreenControl: true,
  // mapTypeControl: true,
  streetViewControl: true,
  navigationControl: true,
  rotateControl: true,
  tilt: 0,
}

const Map = ({ markers }) => {
  // const { user } = useAuth();
  const user = { id: 1 }
  const [selected, setSelected] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  useEffect(() => {
    if (selectedId) {
      console.log(selectedId)
      setSelected(markers.find((m) => m.ip === selectedId))
    }
  }, [selectedId, markers])

  const mapRef = React.useRef(null)
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    console.log(map)
    setTimeout(() => {
      setMapLoaded(true)
      console.log('map loaded', map)
    }, 10)
  }, [])

  const [myRad, setMyRad] = useState(100)

  const memoData = useMemo(() => {
    let data = []
    if (markers) {
      for (let i = 1; i < RADIUS; i += 1) {
        data = [...data, ...moreMarkers(markers, i)]
      }
    }
    return data
  }, [markers])

  const [isGmapReady, setIsGmapReady] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const deckRef = React.useRef()

  // While break is false loop over requestAnimationFrame and reset the layer.
  useEffect(() => {
    function render() {
      nextFilter()
      const layer = getIpLayer({
        data: memoData,
        setSelectedId: setSelectedId,
        myRad: 2000,
      })
      deckRef.current.setProps({ layers: [layer] })
    }

    const loop = d3.timer(() => {
      if (isMapReady) {
        console.log('loop')
        render()
      }
    })
    return () => {
      console.log('cleanup')
      loop.stop()
    }
  }, [isMapReady, myRad, memoData])

  function getTooltip(object) {
    if (object.object) {
      const { ip, country_name, riskIq } = object.object
      return `${ip} \n ${country_name} \n RIQscore: ${riskIq}`
    }
    return null
  }

  useEffect(() => {
    if (isGmapReady && !isMapReady) {
      const overlay = new GoogleMapsOverlay({
        googleMaps: mapRef.current,
        // layers: layers(),
      })
      setTimeout(() => {
        overlay.setMap(mapRef.current)
        overlay.setProps({
          getTooltip,
        })
        deckRef.current = overlay
        setIsMapReady(true)
        window.deckRef = overlay
      }, 5)
    }
    return () => {
      try {
        console.log('unmount')
        // deckRef.current.setProps({ layers: [] })
      } catch (error) {
        console.log(error)
      }
    }
  }, [mapRef, isMapReady, mapLoaded])

  // Once gMap is loaded, pan towards the coordinates of the first marker with a zoom of 3.
  useEffect(() => {
    if (isGmapReady && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds()
      markers.forEach((marker) => {
        bounds.extend(
          new window.google.maps.LatLng(marker.latitude, marker.longitude)
        )
      })
      mapRef.current.fitBounds(bounds, 2)
    }
  }, [isGmapReady, mapRef, markers])

  const gMapRef = React.useRef(null)

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div
          ref={gMapRef}
          className="mb-4 h-96 w-full rounded-lg p-4 shadow-lg md:col-span-2"
        >
          <GMap
            setIsMapReady={setIsGmapReady}
            options={options}
            onMapLoad={onMapLoad}
            mapRef={gMapRef}
          ></GMap>
        </div>
        <div
          // variant="h4" gutterBottom
          className="sr-only"
        >
          {'map'}
        </div>
        <div
          className="sr-only"
          // variant="body1" gutterBottom
        >
          {'mapDescription'}
        </div>
        {selected && (
          <div>
            <div
              // In tailwind render a speachbubble with the name in bold and bleow the description.
              className="bg-snow z-0 mb-4 rounded-lg p-4 font-semibold shadow-lg dark:border dark:border-slate-900 dark:bg-transparent dark:text-slate-300 "
              // variant="h6" gutterBottom
            >
              <div className=" text-center font-bold text-teal-500 dark:text-teal-400">
                {defang(selected.ip)}
              </div>
              <div
                // This is the description of the marker.
                className="mb-1 flex items-center justify-between gap-2 rounded-lg p-4 shadow-lg"
                // variant="body1" gutterBottom
              >
                <div>
                  {selected.country_name} <br /> {selected.city}
                </div>
                <Image
                  src={`https://flagcdn.com/h160/${selected.country_code.toLowerCase()}.png`}
                  width={30}
                  height={20}
                  alt={selected.ip}
                  sizes={'4rem'}
                  className="h-16 w-24 rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
                  priority
                />
              </div>
              <div className=" text-center text-xs font-bold text-teal-500 dark:text-teal-400">
                RIQ score: {selected.riskIq}
              </div>
            </div>
            {/* {user && user.id === selected.userId && (
              <button
                // tailwing a colorful button to edit the map with darkmode
                className="mb-4 rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-800"
              // variant="contained"
              // color="secondary"
              // href={`/map/${selected.id}`}
              >
                {'edit'}
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Map
