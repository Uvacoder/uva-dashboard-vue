<template>
    <div>
        <v-container class="clock-container">
            <v-row class="clock-row"><p class="time-text date">{{ this.nowDate }}</p></v-row>
            <v-row class="clock-row"><p class="time-text time">{{ this.nowTime }}</p></v-row>
            <br />
            <v-row v-if="this.untilTargetDate" class="clock-row"><p class="time-text untiltarget">{{ this.untilTargetDate }} {{ this.targetText }}</p></v-row>
        </v-container>
    </div>
</template>

<script>
const dateFormat = require("dateformat");

export default {
    mounted() {
        if (this.targetDate) {
            let difference = new Date(this.targetDate) - new Date();
            if (difference > 0) {
                let refreshInterval = 0;
                switch(this.differenceIn) {
                    case "days": refreshInterval = 1000 * 60 * 60 * 24; break;
                    case "hours": refreshInterval = 1000 * 60 * 60; break;
                    case "minutes": refreshInterval = 1000 * 60; break;
                    case "seconds": refreshInterval = 1000; break;
                    default: refreshInterval = 1000 * 60 * 60 * 24; break;
                }
                this.calcDifferenceToTargetDate(refreshInterval);
                setInterval(this.calcDifferenceToTargetDate.bind(this, refreshInterval), refreshInterval)
            }
        }
        setInterval(() => {
            this.nowTime = dateFormat(new Date(), this.timeFormat);
            this.nowDate = dateFormat(new Date(), this.dateFormat);

        }, this.refreshEachMs);
    },
    methods: {
        calcDifferenceToTargetDate(refreshInterval) {
            let difference = new Date(this.targetDate) - new Date();
            this.untilTargetDate = (difference / refreshInterval).toFixed(0);
        }
    },
    data() {
        return {
            timeFormat: "HH:MM:ss",
            dateFormat: "dd.mm.yyyy",
            nowTime: null,
            nowDate: null,
            refreshEachMs: 1000,
            untilTargetDate: 0
        }
    },
    props: {
        targetDate: String,
        targetText: String,
        differenceIn: String
    }
}
</script>

<style lang="scss" scoped>
.clock-container {
    margin-top: 20%;
    .clock-row {
        .time-text {
            width: 100%;
            text-align: center;
            color: yellow;
        }
        .date {
            font-size: x-large;
        }
        .time {
            font-size: xxx-large;
        }
    }
}
</style>