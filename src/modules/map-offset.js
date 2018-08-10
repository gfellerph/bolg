/* global google */
export default function offsetCenter(latlng, offsetx, offsety, map) {
  // https://stackoverflow.com/questions/10656743/how-to-offset-the-center-point-in-google-maps-api-v3
  // latlng is the apparent centre-point
  // offsetx is the distance you want that point to move to the right, in pixels
  // offsety is the distance you want that point to move upwards, in pixels
  // offset can be negative
  // offsetx and offsety are both optional

  const scale = map.getZoom() ** 2;

  const worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
  const pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0);

  const worldCoordinateNewCenter = new google.maps.Point(
    worldCoordinateCenter.x - pixelOffset.x,
    worldCoordinateCenter.y + pixelOffset.y,
  );

  const newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

  return newCenter;
}
