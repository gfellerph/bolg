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
			});

			map.addListener('click', this.addTipp);

			const tippsRef = database.ref('/tipps')
			tippsRef.on('child_added', snapshot => {
				const tipp = snapshot.val();
				this.markers.push(new google.maps.Marker({
					position: new google.maps.LatLng(tipp.lat, tipp.lng),
					map: map,
					title: `${tipp.user.displayName.split(' ')[0]}s Tipp: ${tipp.text.substring(0, 22)}${tipp.text.length > 22 ? '...' : ''}`,
				}));
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