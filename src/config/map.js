/* global google */
export const mapConfig = {
  zoom: 4,
  center: new google.maps.LatLng(27.895005435034555, 105.63281035423279),
  streetViewControl: false,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false,
  fullscreenControl: false,
  draggableCursor: null,
  draggingCursor: null,
}

export const markerConfig = {

}

export const polylineConfig = {
  // geodesic: true,
  strokeColor: '#DC143C',
  strokeOpacity: 1.0,
  strokeWeight: 1.5,
}

export const lineMarkerConfig = {
  icon: {
    url: '/img/dot.svg',
    size: new google.maps.Size(11, 11),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(5.5, 5.5),
  },
}
