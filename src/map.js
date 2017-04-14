/* global google, document, window */
window.addEventListener('load', function () {
  window.initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
    });
  };
});
