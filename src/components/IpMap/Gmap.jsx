// GoogleMaps component use the

import React, { useState, useEffect, usemapRef } from 'react'
import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'

const GMap = ({
  mapRef,
  onMapLoad,
  setIsMapReady,
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  // [START maps_react_map_component_add_map_hooks]
  // const mapRef = React.useRef(null);
  const [map, setMap] = React.useState()
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    setIsDarkMode((prev) => {
      if (prev !== (localStorage.getItem('darkMode') === 'true')) {
        return localStorage.getItem('darkMode') === 'true'
      }
      return prev
    })
  }, [])

  React.useEffect(() => {
    if (mapRef?.current && !map) {
      setMap(
        new window.google.maps.Map(mapRef.current, {
          mapId: '165666623396befc',
          styles: 'perfectStyle',
          // styles: !isDarkMode ? 'sinCityStyle' : 'perfectStyle',
        })
      )
      console.log('GMap mapRef', mapRef)
    }
  }, [mapRef, map, isDarkMode])
  // [END maps_react_map_component_add_map_hooks]
  // [START maps_react_map_component_options_hook]
  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options)
      onMapLoad(map)
      setIsMapReady(true)
      console.log('Map is ready', map)
    }
    return () => {
      setIsMapReady(false)
    }
  }, [map])
  // [END maps_react_map_component_options_hook]
  // [START maps_react_map_component_event_hooks]
  React.useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      )
      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])
  // [END maps_react_map_component_event_hooks]
  // [START maps_react_map_component_return]
  return (
    <>
      <div
        className="h-full w-full bg-gray-200"
        // ref={mapRef}
        style={style}
      />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
  // [END maps_react_map_component_return]
}

// // [START maps_react_map_marker_component]
// const Marker = (options) => {
//   const [marker, setMarker] = React.useState();

//   React.useEffect(() => {
//     if (!marker) {
//       setMarker(new google.maps.Marker());
//     }

//     // remove marker from map on unmount
//     return () => {
//       if (marker) {
//         marker.setMap(null);
//       }
//     };
//   }, [marker]);
//   React.useEffect(() => {
//     if (marker) {
//       marker.setOptions(options);
//     }
//   }, [marker, options]);
//   return null;
// };

// [END maps_react_map_marker_component]
const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
  }
  // TODO extend to other types
  // use fast-equals for other objects
  return deepEqual(a, b)
})

function useDeepCompareMemoize(value) {
  const mapRef = React.useRef()

  if (!deepCompareEqualsForMaps(value, mapRef.current)) {
    mapRef.current = value
  }
  return mapRef.current
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

export default GMap
