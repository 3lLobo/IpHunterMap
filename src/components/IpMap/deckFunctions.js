
import { ScatterplotLayer } from '@deck.gl/layers'
import * as d3 from 'd3'
import { DataFilterExtension } from '@deck.gl/extensions'

let isPlaying = true;
let filterMin = 0;
const filterSpan = 21;
const maxTime = 111

// const deckgl = new Deck({
//   views: new OrthographicView(),
//   initialViewState: {
//     target: [0, 0, 0],
//     zoom: 1,
//     minZoom: 0
//   },
//   controller: true,
//   onClick: () => {
//     isPlaying = !isPlaying;
//     isPlaying && redraw();
//   }
// });


export function getIpLayer(data, setSelected) {

  if (filterMin < maxTime) {
    filterMin += 1;
  } else {
    filterMin = 0;
  }
  const myLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 3000,
    radiusMinPixels: 1,
    radiusMaxPixels: 1000,
    lineWidthMinPixels: 3,
    getPosition: (d) => [d.longitude, d.latitude],
    getRadius: (d) => d.radius,
    getFillColor: (d) => [255, 0, 111, 10],
    getLineColor: (d) => [255, 0, 111, 70],
    getFilterValue: (d) => d.radius,
    filterRange: [filterMin, filterMin + filterSpan],
    filterSoftRange: [filterMin + filterSpan * 0.8, filterMin + filterSpan],
    filterTransformSize: true,
    filterTransformColor: true,
    filterTransformSize: true,
    filterTransformColor: true,
    filterEnabled: true,
    gpuAggregation: true,
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    onClick: (info) => {
      console.log(info)
      setSelected(info.object.ip)
    },
    // transitions: {
    //   getRadius: {
    //     duration: 1000,
    //     easing: d3.easeCubic,
    //   },
    // },

    // Make the mouse a pointer on hover
    onHover: ({ object, x, y }) => {
      // const el = document.getElementById('tooltip')
      // console.log('object', el)
      // if (object) {
      //   const { name, address } = object
      //   el.style.cursor = object ? 'pointer' : '';
      //   el.innerHTML = `<div><h3>${name}</h3><p>${address}</p></div>`
      //   el.style.display = 'block'
      //   el.style.opacity = 0.9
      //   el.style.left = x + 'px'
      //   el.style.top = y + 'px'
      // } else {
      //   el.style.opacity = 0
      // }
    },
  })
  return myLayer
}


export function moreMarkers(markers, rad) {
  if (markers) {

    const newMarkers = markers.map((marker) => {
      const newMarker = {}
      newMarker.ip = marker.ip
      newMarker.longitude = marker.longitude
      newMarker.latitude = marker.latitude
      newMarker.radius = rad
      return newMarker
    })
    return newMarkers
  }
}