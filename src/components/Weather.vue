<template>
    <div>
        <v-container class="wrapper">
            <v-row class="weather current">
                <v-col class="lg-6 basic">
                    <div class="hour"><small>{{this.currentHour}} Uhr {{this.placeName && `in ${this.placeName}`}}</small></div>
                    <div class="temp">{{this.currentTemp}}°C</div>
                    <div class="cover"><b>{{this.description}}</b></div>
                </v-col>
                <v-col class="lg-6 detailed">
                    <v-row class="detailed-info">
                        <v-col>Gefühlt wie:</v-col><v-col>{{this.feltTemp}}°C</v-col>
                    </v-row>
                    <v-row class="detailed-info">
                        <v-col>Luftfeuchtigkeit:</v-col><v-col>{{this.humidity}}%</v-col>
                    </v-row>
                    <v-row class="detailed-info">
                        <v-col>Luftdruck:</v-col><v-col>{{this.pressure}} hPa</v-col>
                    </v-row>
                    <v-row class="detailed-info">
                        <v-col>Sonnenaufgang:</v-col><v-col>{{this.sunrise}} Uhr</v-col>
                    </v-row>
                    <v-row class="detailed-info">
                        <v-col>Sonnenuntergang:</v-col><v-col>{{this.sunset}} Uhr</v-col>
                    </v-row>
                    <v-row class="detailed-info">
                        <v-col>Windgeschwindgkeit:</v-col><v-col>{{this.windSpeed}} m/s</v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="weather forecast">
                <div class="hourly-forecast" v-for="forecast in this.forecasts" v-bind:key="forecast.dt">
                    <div class="hourly-forecast-hour"><small>{{new Date(forecast.dt * 1000).getHours()}} Uhr</small></div>
                    <div class="hourly-forecast-data">{{forecast.temp.toFixed(1)}}°C</div>
                    <div class="hourly-forecast-data">{{forecast.weather[0].description}}</div>
                </div>
            </v-row>   
        </v-container>
    </div>
</template>
<script>
const activeCheckerHelper = require("../helpers/activeChecker");

export default {
    mounted: function() {
        let requestInterval = this.requestInterval || 3600000;
        this.getPlaceName();
        this.getWeather();
        setInterval(() => {
            if (!activeCheckerHelper.checkIfActive()) {
                return;
            }
            this.getPlaceName();
            this.getWeather();
        }, requestInterval);
    },
    props: {
        place: Object,
        exclude: Array,
        hourInterval: Number,
        requestInterval: Number,
    },
    data() {
        return {
            currentHour: 0,
            currentTemp: 0,
            feltTemp: 0,
            humidity: 0,
            pressure: 0,
            sunrise: "",
            sunset: "",
            windSpeed: 0,
            description: "",
            forecasts: [],
            placeName: ""
        }
    },
    methods: {
        filterHourly: function(forecast, hourInterval) {
            // How many elements are important for the forecast? Maximum of 6 elements will be displayed.
            let newForecastLength = 6 * hourInterval;
            let slicedHourly = forecast.slice(0, newForecastLength);
            // Start at the next hour. Then get in given interval.
            return slicedHourly.filter((element, index) => index % hourInterval === hourInterval - 1);
        },
        getPlaceName() {
            const that = this;
            that.$http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${that.place.lon},${that.place.lat}.json?access_token=${process.env.VUE_APP_MAPBOX_API_TOKEN}`).then(response => {
                that.placeName = response.data.features.filter(f => f.place_type.includes('place'))[0].text;
            });
        },
        getWeather() {
            console.log("Weather: request", new Date());
            let exclude = this.exclude || ["minutely"];
            this.$http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.place.lat}&lon=${this.place.lon}&exclude=${exclude.join(",")}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_API_TOKEN}`).then(response => {
                let current = response.data.current;
                let hourInterval = this.hourInterval || 2;
                //let hourlyForecast = response.data.hourly;
                // Find out values for  6, 9, 12, 15, 18, 21
                this.forecasts = this.filterHourly(response.data.hourly, hourInterval);

                this.currentHour = new Date(current.dt * 1000).getHours();
                this.description = current.weather[0].description;
                this.currentTemp = current.temp.toFixed(1);
                this.feltTemp = current.feels_like.toFixed(1);
                this.humidity = current.humidity;
                this.pressure = current.pressure;
                let sunrise = new Date(current.sunrise * 1000);
                this.sunrise = `${sunrise.getHours()}:${sunrise.getMinutes() > 9 ? sunrise.getMinutes() : "0" +  sunrise.getMinutes()}`; 
                let sunset = new Date(current.sunset * 1000);
                this.sunset = `${sunset.getHours()}:${sunset.getMinutes() > 9 ? sunset.getMinutes() : "0" + sunset.getMinutes()}`; 
                this.windSpeed = current.wind_speed;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.current {
    .detailed {
        .detailed-info {
            margin-top: -5%;
            color: white;
        }
    }
    .hour {
        text-align: center;
        color: white;
    }
    .temp {
        text-align: center;
        font-size: xxx-large;
        color: yellow;
    }
    .cover {
        text-align: center;
        color: white;
    }
}

.forecast {
    .hourly-forecast {
        flex-basis: 33.33%;
        margin: 15px 0px;
        text-align: center;
        font-size: large;
        .hourly-forecast-hour {
            color: white;
        }
        .hourly-forecast-data {
            color: lightgray;
        }
    }
}
</style>
