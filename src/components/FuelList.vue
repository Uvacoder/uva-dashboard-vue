<!-- Uses Tankerkönig API: https://creativecommons.tankerkoenig.de/ -->
<template>
    <div class="wrapper">
        <v-simple-table v-if="this.fuelList.length > 0">
            <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Entfernung (km)</th>
                    <th class="text-left">Preis (€)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="station in this.fuelList" :key="station.id">
                    <td>{{ station.name }}</td>
                    <td>{{ station.dist }}</td>
                    <td>{{ station.price }}</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script>
const activeCheckerHelper = require("../helpers/activeChecker");

export default {
    mounted () {
        let requestInterval = this.requestInterval || 600000;
        this.getFuelList();
        setInterval(() => {
            if (!activeCheckerHelper.checkIfActive()) {
                return;
            }
            this.getFuelList();
        }, requestInterval);
    },
    data() {
        return {
            fuelList: []
        }
    },
    props: {
        place: Object,
        radius: Number,
        fuelType: String,
        sortBy: String,
        maxStations: Number,
        requestInterval: Number,
    },
    methods: {
        sortFuelList(fuelList, sortBy) {
            return fuelList.sort((left, right) => {
                if(left[sortBy] > right[sortBy]) return 1;
                if(left[sortBy] < right[sortBy]) return -1;
                return 0;
            });
        },

        filterFuelList(fuelList) {
            return fuelList.filter((station) => station.isOpen)
        },
        getFuelList() {
            console.log("Fuellist: request", new Date());
            let sortBy = this.sortBy || "dist";
            let maxStations = this.maxStations || 8;
            this.$http.get(`https://creativecommons.tankerkoenig.de/json/list.php?lat=${this.place.lat}&lng=${this.place.lon}&rad=${this.radius}&sort=price&type=${this.fuelType}&apikey=${process.env.VUE_APP_TANKKOENIG_API_TOKEN}`).then(response => {
                this.fuelList = this.sortFuelList(this.filterFuelList(response.data.stations), sortBy).slice(0, maxStations);
            });
        }
    }
}
</script>