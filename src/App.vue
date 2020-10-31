<template>
  <v-app class="background">
    <!-- For background animations-->
    <span v-for="n in 20" v-bind:key="n"></span>
    <v-main>
      <v-row class="top panel-group">
        <v-col class="lg-3 panel"><Navigation mapId="max-map" v-bind:zoomLevel="9.5" v-bind:start="{ lon: 9.387584, lat: 48.720639 }" v-bind:destination="{ lon: 8.967762, lat: 48.679740 }"/></v-col>
        <v-col class="lg-3 panel"><Navigation mapId="alex-map" v-bind:zoomLevel="10.75" v-bind:start="{ lon: 9.387584, lat: 48.720639 }" v-bind:destination="{ lon: 9.448506, lat: 48.651287 }"/></v-col>
        <v-col class="lg-3 panel"><FuelList v-bind:place="{ lon: 9.387584, lat: 48.720639 }" v-bind:radius="10" fuelType="e5" /></v-col>
      </v-row>
      <v-row class="bottom panel-group">
        <v-col class="lg-3 panel"><Weather v-bind:place="{ lon: 9.387584, lat: 48.720639 }" /></v-col>
        <v-col class="lg-3 panel"><APIImage /></v-col>
        <v-col class="lg-3 panel"><!--<List v-bind:showInput="true" />--></v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
import FuelList from "./components/FuelList";
import Weather from "./components/Weather";
import APIImage from "./components/Image";
// import List from "./components/List";

export default {
  name: 'App',

  components: {
    Navigation,
    FuelList,
    Weather,
    APIImage,
    // List,
  },
};
</script>

<!-- background credits go to: https://1stwebdesigner.com/15-css-background-effects/ -->
<style scoped lang="scss">
body {
  margin: 0;
  overflow: hidden;
}

.panel {
  height: 50vh;
}

.background {
  width: 100vw;
  height: 100vh;
  background: #3E1E68 !important;
  overflow: hidden;
}

$particleSize: 20vmin;
$animationDuration: 6s;
$amount: 20;
.background span {
  width: $particleSize;
  height: $particleSize;
  border-radius: $particleSize;
  backface-visibility: hidden;
  position: absolute;
  animation-name: move;
  animation-duration: $animationDuration;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  $colors: (
    #583C87,
    #E45A84,
    #FFACAC
  );
  @for $i from 1 through $amount {
    &:nth-child(#{$i}) {
      color: nth($colors, random(length($colors)));
      top: random(100) * 1%;
      left: random(100) * 1%;
      animation-duration: (random($animationDuration * 10) / 10) * 1s + 10s;
      animation-delay: random(($animationDuration + 10s) * 10) / 10 * -1s;
      transform-origin: (random(50) - 25) * 1vw (random(50) - 25) * 1vh;
      $blurRadius: (random() + 0.5) * $particleSize * 0.5;
      $x: if(random() > 0.5, -1, 1);
      box-shadow: ($particleSize * 2 * $x) 0 $blurRadius currentColor;
    }
  }
}

@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}
.top {
  height: 50vh;
}

.bottom {
  height: 50vh;
}

.panel-group {
  padding: 0 10px;
}
</style>
