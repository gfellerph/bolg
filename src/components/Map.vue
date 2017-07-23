<template>
	<div class="map">
		<div id="google-map"></div>
		<add-tipp
			:lat="lat"
			:lng="lng"
			:country="country"
			v-if="showPopup"
			@tipp-added="resetTipp"
			@tipp-closed="closeTipp"></add-tipp>
	</div>
</template>

<script>
	import Tipp from '@/models/Tipp';
	import AddTipp from '@/components/AddTipp';
	import { database } from '@/config/firebase';
	import mapStyles from '@/config/map-styles.json';
	import { reverseGeocode } from '@/config/constants';

	let map = null;

	export default {
		data() {
			return {
				showPopup: false,
				lat: 0,
				lng: 0,
				country: '',
				markers: [],
			};
		},

		mounted() {
			map = new google.maps.Map(document.getElementById('google-map'), {
				zoom: 2,
				center: new google.maps.LatLng(27, 6),
				// styles: mapStyles,
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.HYBRID,
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
						<h5>${tipp.username}</h5>
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
				this.lat = event.latLng.lat();
				this.lng = event.latLng.lng();
				this.showPopup = true;
			},
			resetTipp(tipp) {
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