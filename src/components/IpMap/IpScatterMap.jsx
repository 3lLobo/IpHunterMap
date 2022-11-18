// Plot a map with deck.gl and google maps. Use the deck.gl Scatterplot to render circles on the map based on the input coordinates.

import React, { useState, useEffect, useMemo } from 'react'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
// TODO: Change mapstyle on darkmode
import { useLoadScript, GoogleMap } from '@react-google-maps/api'
import { mapDark, mapLight } from './mapStyleDark'
import * as d3 from 'd3'
import { DataFilterExtension } from '@deck.gl/extensions'
import { getIpLayer, moreMarkers } from './deckFunctions'
import { defang } from 'fanger'
import Image from 'next/image'


const libraries = ['places']
const mapContainerStyle = {
  width: '100%',
  height: '100%',
}
const center = {
  lat: 19.076,
  lng: 72.8777,
}
const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapDark,
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

  const [viewport, setViewport] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
    zoom: 3,
  });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const mapRef = React.useRef()
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    console.log('map loaded')
    setMapLoaded(true)
  }, [])

  const memoData = useMemo(() => {
    let data = []
    if (markers) {
      for (let i = 1; i < 111; i += 1) {
        data = [...data, ...moreMarkers(markers, i)]
      }
    }
    return data
  }, [markers])

  const [isMapReady, setIsMapReady] = useState(false)
  const [deckRef, setDeckRef] = useState(null)

  useEffect(() => {
    function redraw() {
      console.log('redraw')
      const layers = [getIpLayer(memoData, setSelectedId)]
      deckRef.setProps({ layers })

      if (isMapReady) {
        setTimeout(() => {
          requestAnimationFrame(redraw);
        }, 20);
      }
    }
    if (isMapReady) {
      requestAnimationFrame(redraw);
    }
    return () => {
      deckRef?.setProps({ layers: [] })
    }
  }, [isMapReady, deckRef, memoData])

  useEffect(() => {
    console.log('mapRef.current', mapRef)
    if (mapLoaded && !isMapReady) {
      const overlay = new GoogleMapsOverlay({
        googleMaps: mapRef,
      })
      setTimeout(() => {
        overlay.setMap(mapRef.current)
        setDeckRef(overlay)
        setIsMapReady(true)
      }, 5)
    }
    // return () => {
    //   deckRef?.setMap(null)
    //   setIsMapReady(false)
    // }
  }, [mapRef, isMapReady, mapLoaded])

  if (loadError) return 'Error'
  if (!isLoaded) return 'Loading...'

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-4 h-96 w-full rounded-lg p-4 shadow-lg md:col-span-2">
          {/* <DeckGL
            // layers={layers}
            initialViewState={viewport}
            controller={false}
          > */}
          <GoogleMap
            key={"map"}
            ref={mapRef}
            mapContainerStyle={mapContainerStyle}
            zoom={1}
            center={center}
            options={options}
            onLoad={onMapLoad}
          ></GoogleMap>
          {/* </DeckGL> */}
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
              className="z-0 mb-4 rounded-lg bg-gray-200 dark:bg-transparent p-4 shadow-lg dark:border dark:border-slate-900 font-semibold dark:text-slate-300 "
            // variant="h6" gutterBottom
            >
              <div
                className=" text-center font-bold text-teal-600 dark:text-teal-400"
              >
                {defang(selected.ip)}
              </div>
              <div
                // This is the description of the marker.
                className="mb-4 rounded-lg p-4 shadow-lg flex items-center justify-between gap-2"
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
                  className='rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800 h-16 w-24'
                  priority
                />
              </div>
            </div>
            {user && user.id === selected.userId && (
              <button
                // tailwing a colorful button to edit the map with darkmode
                className="mb-4 rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-800"
              // variant="contained"
              // color="secondary"
              // href={`/map/${selected.id}`}
              >
                {'edit'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Map
