<template>
	<div class="map">
		<div id="map"></div>
		<div class="popup" v-if="showPopup">
			<add-tipp :tipp="newTipp" @tipp-added="resetTipp" @tipp-closed="closeTipp"></add-tipp>
		</div>
	</div>
</template>

<script>
	import Tipp from '@/Models/Tipp';
	import AddTipp from '@/components/AddTipp';
	import { database } from '@/config/firebase';
	import mapStyles from '@/config/map-styles.json';

	let map = null;

	export default {
		data() {
			return {
				showPopup: false,
				newTipp: new Tipp(),
				markers: [],
			};
		},

		firebase: {
			tipps: database.ref('/tipps'),
		},

		mounted() {
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 4,
				center: new google.maps.LatLng(-34.397, 150.644),
				styles: mapStyles
			});

			map.addListener('click', this.addTipp);

			database.ref('/tipps').on('child_added', snapshot => {
				const tipp = snapshot.val();
				const marker = new google.maps.Marker({
					position: new google.maps.LatLng(tipp.lat, tipp.lng),
					map: map,
					title: `${tipp.user.displayName.split(' ')[0]}s Tipp: ${tipp.text.substring(0, 22)}${tipp.text.length > 22 ? '...' : ''}`,
				});
				const infowindow = new google.maps.InfoWindow({
					content: `
						<img src="${tipp.user.photoURL}" alt="${tipp.user.displayName}" />
						<h5>${tipp.user.displayName}</h5>
						<p>${tipp.text}</p>
					`,
				});
				marker.addListener('click', () => {
					infowindow.open(map, marker);
				});
				this.markers.push(marker);
			});
		},

		methods: {
			addTipp(event) {
				this.newTipp.lat = event.latLng.lat();
				this.newTipp.lng = event.latLng.lng();
				this.showPopup = true;
			},
			resetTipp(tipp) {
				this.newTipp = new Tipp();
				this.showPopup = false;
			},
			closeTipp() {
				this.showPopup = false;
			},
		},

		components: {
			AddTipp,
		},
	};
</script>

<style lang="scss">
	.map {
		position: relative;
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