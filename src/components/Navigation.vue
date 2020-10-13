<!-- TODO: Add internationalization. -->
<template>
    <div class="wrapper">
        <div :id="this.mapId" class="basemap"></div>
        <v-row>
            <v-col class="lg-6">
                <v-alert border="right" color="blue-grey" dark>Dauer der Route: {{this.duration.toFixed(2)}} Minuten</v-alert>
            </v-col>
            <v-col class="lg-6">
                <v-alert border="right" color="blue-grey" dark>Länge der Route: {{this.distance.toFixed(3)}}km</v-alert>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
    mounted () {
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API_TOKEN;
        let that = this;
        let middlePoint = that.middlePoint(that.start.lat, that.start.lon, that.destination.lat, that.destination.lon);

        let map = new mapboxgl.Map({
            container: that.mapId,
            style: "mapbox://styles/mapbox/streets-v11",
            center: middlePoint,
            zoom: that.zoomLevel
        });
        map.on("load", function() {
            that.$http.get(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${that.start.lon},${that.start.lat};${that.destination.lon},${that.destination.lat}?geometries=geojson&access_token=${process.env.VUE_APP_MAPBOX_API_TOKEN}`).then(response => {
                const geoJson = response.data.routes[0].geometry.coordinates;
                that.duration = response.data.routes[0].duration / 60;
                that.distance = response.data.routes[0].distance / 1000;
                console.log(response.data.routes);
                map.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': geoJson
                        }
                    }
                });

                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                });
            });
        });
    },
    data() {
        return {
            duration: 0,
            distance: 0
        }
    },
    // TODO: start and destination should be in an object. zoomLevel should be calculated automaticalle by the middle points and the 4 outmost points.
    props: {
        start: Object,
        destination: Object,
        mapId: String,
        zoomLevel: Number
    },
    methods: {
        /**
         * Calculates the middle point between two latlng coordinates.
         * TODO: This function should be in a helper or in a latlng object!
         */
        middlePoint(lat1, lng1, lat2, lng2) {
            let dLng = (lng2 - lng1) * Math.PI / 180;

            lat1 = lat1 * Math.PI / 180;
            lat2 = lat2 * Math.PI / 180;
            lng1 = lng1 * Math.PI / 180;

            let bX = Math.cos(lat2) * Math.cos(dLng);
            let bY = Math.cos(lat2) * Math.sin(dLng);
            let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
            let lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);
            return [lng3 * (180 / Math.PI), lat3 * (180 / Math.PI)];
        }
    },
}
</script>

<style lang="scss" scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");

.wrapper {
    height: 100%;
}


.basemap {
    height: 85%;
}
</style>