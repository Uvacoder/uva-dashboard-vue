<template>
    <div class="animal-container">
        <img :src="this.image"/>
        <div class="fact">{{this.fact}}</div>
    </div>
</template>

<script>
const activeCheckerHelper = require("../helpers/activeChecker");

export default {
    mounted: function() {
        let requestInterval = this.requestInterval || 60000;
        this.getImage();
        setInterval(() => {
            if (!activeCheckerHelper.checkIfActive()) {
                return;
            }
            this.getImage();
        }, requestInterval);
    },
    data() {
        return {
            image: "",
            fact: "",
        }
    },
    props: {
        requestInterval: Number,
    },
    methods: {
        getImage() {
            console.log("Image: request", new Date());
            let that = this;
            that.$http.get("https://randomfox.ca/floof/").then(response => {
                that.image = response.data.image;
            });
            that.$http.get("https://cat-fact.herokuapp.com/facts/random").then(response => {
                that.fact = response.data.text;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.animal-container {
    height: 100%;
    img {
        max-width: 100%;
        max-height: 90%;
        margin-right: auto;
        margin-left: auto;
        display: block;
    }
    .fact {
        margin-top: 10px;
        text-align: center;
        color: white;
        font-size: medium;
    }
}
</style>