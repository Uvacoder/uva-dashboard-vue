<template>
    <div>
        <v-row class="weather current">
            <v-col class="lg-6 basic">
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
        </v-row>   
    </div>
</template>
<script>
export default {
    mounted: function() {
        let exclude = this.exclude || ["minutely"];
        this.$http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.place.lat}&lon=${this.place.lon}&exclude=${exclude.join(",")}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_API_TOKEN}`).then(response => {
            console.log(response.data);
            let current = response.data.current;
            //let hourlyForecast = response.data.hourly;

            this.description = current.weather[0].description;
            this.currentTemp = current.temp.toFixed(1);
            this.feltTemp = current.feels_like.toFixed(1);
            this.humidity = current.humidity;
            this.pressure = current.pressure;
            let sunrise = new Date(current.sunrise * 1000);
            this.sunrise = `${sunrise.getHours()}:${sunrise.getMinutes()}`; 
            let sunset = new Date(current.sunset * 1000);
            this.sunset = `${sunset.getHours()}:${sunset.getMinutes()}`; 
            this.windSpeed = current.wind_speed;

        });
    },
    props: {
        place: Object,
        exclude: Array,
    },
    data() {
        return {
            currentTemp: 0,
            feltTemp: 0,
            humidity: 0,
            pressure: 0,
            sunrise: "",
            sunset: "",
            windSpeed: 0,
            description: ""
        }
    }
}
</script>

<style lang="scss" scoped>
.current {
    .detailed {
        padding: 20% 0;

        .detailed-info {
            margin-top: -5%;
            color: white;
        }
    }
    .temp {
        text-align: center;
        padding: 50% 0 0 0;
        font-size: xxx-large;
        color: yellow;
    }
    .cover {
        text-align: center;
        color: white;
    }
}
</style>