<template>
	<div class="map">
		<div id="google-map"></div>
		<map-search
			ref="mapSearch"
			:map="map"
			:test="'test'"
		></map-search>
	</div>
</template>

<script>
	import axios from 'axios';
	import bus from '@/config/bus';
	import Tipp from '@/models/Tipp';
	import AddTipp from '@/components/AddTipp';
	import MapSearch from '@/components/MapSearch';

	export default {
		data() {
			return {
				markers: [],
				map: null,
			};
		},

		mounted() {
			this.map = new google.maps.Map(document.getElementById('google-map'), {
				zoom: 2,
				center: new google.maps.LatLng(27, 6),
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				fullscreenControl: true,
				draggableCursor: null,
				draggingCursor: null,
			});

			this.$refs.mapSearch.init(this.map);

			if (window.outerWidth >= 768)	this.map.addListener('click', this.addTipp);

			axios.get('/api/tipps')
				.then((res) => {
					const tipps = res.data;

					this.markers = tipps.map((tipp) => {
						const marker = new google.maps.Marker({
							position: new google.maps.LatLng(tipp.lat, tipp.lng),
							map: this.map,
							title: `${tipp.user.displayName}s Tipp: ${tipp.text.substring(0, 22)}${tipp.text.length > 22 ? '...' : ''}`,
							icon: {
								url: '/img/inuksuk-map.svg',
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
							infowindow.open(this.map, marker);
						});

						return marker;
					});
				});
		},

		methods: {
			addTipp(event) {
				bus.$emit('map-click', event.latLng);
			},
		},

		components: {
			AddTipp,
			MapSearch,
		},
	};
</script>

<style lang="scss">
	.map {
		overflow: hidden;
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