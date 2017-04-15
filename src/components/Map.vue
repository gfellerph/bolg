<template>
	<div class="map">
		<div id="map"></div>
		<ul>
			<li v-for="tipp in tipps">{{tipp.text}} - {{tipp.user.displayName}}</li>
		</ul>
		<div class="popup" v-if="showPopup">
			<add-tipp :tipp="tipp"></add-tipp>
		</div>
	</div>
</template>

<script>
	import Tipp from '@/Models/Tipp';
	import AddTipp from '@/components/AddTipp';
	import { database } from '@/config/firebase';

	let map = null;

	export default {
		data() {
			return {
				showPopup: false,
				tipp: new Tipp(),
			};
		},

		firebase: {
			tipps: database.ref('/tipps'),
		},

		mounted() {
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 4,
				center: new google.maps.LatLng(-34.397, 150.644),
			});

			map.addListener('click', this.addTipp);
		},

		methods: {
			addTipp(event) {
				this.tipp.lat = event.latLng.lat();
				this.tipp.lng = event.latLng.lng();
				this.showPopup = true;
				console.log(event.latLng.lat(), event.latLng.lng());
			},
		},

		components: {
			AddTipp,
		},
	};
</script>

<style lang="scss">
	.map {
		width: 100%;
	}

	#map {
		height: calc(80vh - 80px);
		width: 100%;

		* {
			overflow:visible;
		}
	}
</style>