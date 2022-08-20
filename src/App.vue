<template>
  <v-app class="background">
    <!-- For background animations-->
    <span v-for="n in 20" v-bind:key="n"></span>
    <v-main>
      <v-row class="top panel-group">
        <!--<v-col class="lg-3 panel--h-2"><GitHubPRList :user="''" :repos="[]" /></v-col>-->
        <v-col class="lg-3 panel--h-1"><Clock targetDate="2020-12-24" targetText="Tage bis Heiligabend" differenceIn="days" /></v-col>
        <v-col class="lg-3 panel--h-1"><Shares-list :isins="['IE00BJ0KDQ92', 'LU1737652583']" :coins="['BTC', 'DOGE']" /></v-col>
        <v-col class="lg-3 panel--h-1"><Navigation mapId="max-map" v-bind:zoomLevel="9.5" v-bind:start="{ lon: 9.540422646422513, lat: 48.61532224676564 }" v-bind:destination="{ lon: 9.289805202699322, lat: 48.742102645103 }"/></v-col>
      </v-row>
      <v-row class="bottom panel-group">
        <!--<v-col class="lg-3 panel--h-1">--><!-- if using panel--h-2 in top row, you may need to insert a placeholder for the second row --><!--</v-col>-->
        <v-col class="lg-3 panel--h-1"><Weather :place="{ lon: 9.289805202699322, lat: 48.742102645103 }" /></v-col>
        <v-col class="lg-3 panel--h-1"><FuelList :place="{ lon: 9.289805202699322, lat: 48.742102645103 }" v-bind:radius="10" fuelType="e5" /></v-col>
        <v-col class="lg-3 panel--h-1"><APIImage /></v-col>
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
import Clock from "./components/Clock"
import SharesList from './components/SharesList'
// import GitHubPRList from './components/GitHubPRList.vue'

export default {
  name: 'App',

  components: {
    Navigation,
    FuelList,
    Weather,
    APIImage,
    // List,
    Clock,
    SharesList,
    // GitHubPRList
  },
};
</script>

<style>
html {
  overflow-y: hidden !important;
}

body {
  margin: 0;
  overflow-y: hidden !important;
}
</style>

<!-- background credits go to: https://1stwebdesigner.com/15-css-background-effects/ -->
<style scoped lang="scss">
.panel--h-1 {
  height: 50vh;
  overflow: hidden;
}

.panel--h-2 {
  height: 100vh;
  overflow: hidden;
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
