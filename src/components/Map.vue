<template>
	<div id="map"></div>
</template>

<script>
	export default {
		data() {
			return {

			};
		},

		mounted() {
			const map = new google.maps.Map(document.getElementById('map'), {
				zoom: 4,
				center: new google.maps.LatLng(-34.397, 150.644),
			});
		},
	};
</script>

<style lang="scss">
	#map {
		height: 80vh;
		width: 100%;

		* {
			overflow:visible;
		}
	}
</style>