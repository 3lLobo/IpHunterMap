import { ScatterplotLayer } from '@deck.gl/layers'
import * as d3 from 'd3'
import { DataFilterExtension } from '@deck.gl/extensions'
import { RADIUS } from '@/constants/plotVars'
import { FlyToInterpolator, WebMercatorViewport } from '@deck.gl/core'

let filterMin = 0
const step = 1
let reverseDir = false
const filterSpan = 11
const maxTime = 231
let filterRange = [filterMin, filterMin + filterSpan]
let filterSoftRange = [filterMin * 0.8, filterMin + filterSpan * 0.8]

function getRange() {
  const newMax = filterMin + filterSpan
  if (newMax > maxTime) {
    reverseDir = true
  }
  // if (reverseDir) {
  //   return [newMax, newMax - filterSpan]
  // } else {
  return [filterMin, newMax]
  // }
}

function getSoftRange() {
  const newMax = filterMin + filterSpan
  if (newMax > maxTime) {
    // reverseDir = true
  }
  if (reverseDir) {
    return [filterMin, filterMin + filterSpan * 0.4]
  } else {
    return [filterMin + filterSpan * 0.8, newMax]
  }
}

export function nextFilter() {
  // console.log('nextFilter', filterMin, filterRange, filterSoftRange, reverseDir)
  if (reverseDir) {
    const newFIlterMin = filterMin - step * 1000
    if (newFIlterMin < 0) {
      reverseDir = false
      filterMin = 0
    } else {
      filterMin = newFIlterMin
    }
  } else {
    filterMin += step
  }
  filterSoftRange = getSoftRange()
  filterRange = getRange()
}

export function getIpLayer({ data, setSelectedId, myRad }) {
  // console.log("HIIII")
  // console.log('nextFilter', filterMin, filterRange, filterSoftRange)
  const myLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    pickable: true,
    opacity: 1,
    stroked: true,
    filled: true,
    radiusScale: myRad,
    radiusMinPixels: 1,
    radiusMaxPixels: 10000,
    lineWidthMinPixels: 3,
    getPosition: (d) => [d.longitude, d.latitude],
    getRadius: (d) => d.radius,
    getFillColor: (d) => d.fillColor,
    getLineColor: (d) => d.d3color,
    getFilterValue: (d) => d.fRadius,
    filterRange: filterRange,
    filterSoftRange: filterSoftRange,
    filterTransformSize: true,
    filterTransformColor: true,
    filterEnabled: true,
    gpuAggregation: true,
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    onClick: (info) => {
      console.log(info)
      setSelectedId(info.object.ip)
      // Zoom in on the selected point.
      const viewport = info.viewport
      const [longitude, latitude] = info.coordinate
      const zoom = viewport.zoom + 2
      const newViewState = {
        // ...viewState,
        lng: longitude,
        lat: latitude,
        zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      }
      window.deckRef.props.googleMaps.panTo(newViewState)

      // ({ viewState: newViewState })
    },
    getPolygonOffset: (d) => [0, -d.fRadius],
    // transitions: {
    //   getRadius: {
    //     duration: 500,
    //     easing: d3.easeCubicInOut,
    //     enter: value => [0, value],
    //     exit: value => [value, 0]
    //   }
    // },
    loadOptions: {
      glOptions: {
        webgl2: true,
      },
    },
    // updateTriggers: {
    //   getRadius: [myRad, filterMin, filterRange, filterSoftRange],
    //   filterRange: [filterMin, filterRange],
    //   filterSoftRange: [filterMin, filterSoftRange],
    // }
  })
  return myLayer
}

// TODO: use the RIQ score for color interpolation between white orange and red.
export function moreMarkers(markers, rad) {
  if (markers) {
    const newMarkers = markers.map((marker) => {
      const newMarker = {}
      newMarker.ip = marker.ip
      newMarker.country_name = marker.country_name
      newMarker.longitude = marker.longitude
      newMarker.latitude = marker.latitude
      newMarker.riskIq = marker.riskIq
      newMarker.offset = Number.parseInt(marker.ip[0])
      // console.log("OFFFSETTT", newMarker.offset)
      newMarker.radius = rad + newMarker.offset
      newMarker.fRadius = newMarker.radius * 0.9
      const mColor = rgbStringToArray(
        d3.interpolateRdYlGn(1 - (marker.riskIq / 100) ** (1 / 9))
      )
      newMarker.d3color = mColor
      newMarker.fillColor = [...mColor, 80]
      return newMarker
    })
    return newMarkers
  }
}

// Convert an rgb(a) string to an array of numbers  [r, g, b, a].
function rgbStringToArray(rgbString) {
  const rgbArray = rgbString
    .replace('rgb(', '')
    .replace('rgba(', '')
    .replace(')', '')
    .split(',')
    .map((val) => Number(val))
  return rgbArray
}
