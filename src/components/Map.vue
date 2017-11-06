<template>
	<div class="map" :class="{grayscale: showPopup}">
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
	import axios from 'axios';
	import Tipp from '@/models/Tipp';
	import AddTipp from '@/components/AddTipp';
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
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				fullscreenControl: true,
				draggableCursor: null,
				draggingCursor: null,
			});

			if (window.outerWidth >= 768)	map.addListener('click', this.addTipp);

			axios.get('/api/tipps')
				.then((res) => {
					const tipps = res.data;

					this.markers = tipps.map((tipp) => {
						const marker = new google.maps.Marker({
							position: new google.maps.LatLng(tipp.lat, tipp.lng),
							map: map,
							title: `${tipp.user.displayName}s Tipp: ${tipp.text.substring(0, 22)}${tipp.text.length > 22 ? '...' : ''}`,
							icon: {
								url: '/img/inuksuk.png',
								size: new google.maps.Size(36, 34),
								origin: new google.maps.Point(0,0),
								anchor: new google.maps.Point(18, 17),
							},
						});
						const infowindow = new google.maps.InfoWindow({
							content: `
								<h5>${tipp.user.displayName}</h5>
								<p>${tipp.text}</p>
							`,
						});
						marker.addListener('click', () => {
							infowindow.open(map, marker);
						});

						return marker;
					});
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

<style lang="scss">
	.map {
		overflow: hidden;

		#google-map {
			transition: filter 300ms, opacity 300ms;
		}

		&.grayscale #google-map{
			filter: blur(3px);
		}
	}

	.gm-style {
		font: inherit !important;
	}

	.gm-style-iw {
		> div > div {
			h5 {
				font-size: 1.5em;
				margin-top: 1em;
			}

			p {
				font-size: inherit !important;
				margin-bottom: 1em;
			}
		}
	}
</style>