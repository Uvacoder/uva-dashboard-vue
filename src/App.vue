<template>
  <v-app>
    <v-main>
      <v-row class="top panel-group">
        <v-col class="lg-3 panel"><Navigation mapId="max-map" v-bind:zoomLevel="9.5" v-bind:start="{ lon: 9.387584, lat: 48.720639 }" v-bind:destination="{ lon: 8.967762, lat: 48.679740 }"/></v-col>
        <v-col class="lg-3 panel"><Navigation mapId="alex-map" v-bind:zoomLevel="10.75" v-bind:start="{ lon: 9.387584, lat: 48.720639 }" v-bind:destination="{ lon: 9.448506, lat: 48.651287 }"/></v-col>
        <v-col class="lg-3 panel"><FuelList v-bind:place="{ lon: 9.387584, lat: 48.720639 }" v-bind:radius="10" fuelType="e5" /></v-col>
      </v-row>
      <v-row class="bottom panel-group">
        <v-col class="lg-3 panel"></v-col>
        <v-col class="lg-3 panel"></v-col>
        <v-col class="lg-3 panel"></v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
import FuelList from "./components/FuelList";

export default {
  name: 'App',

  components: {
    Navigation,
    FuelList
  },
};
</script>

<style scoped lang="scss">
.top {
  background: red;
  height: 50%;
}

.bottom {
  background: blue;
  height: 50%;
}

.panel-group {
  padding: 0 10px;
}
</style>
