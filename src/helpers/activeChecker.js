module.exports = {
    checkIfActive() {
        const currentHour = new Date().getHours();
        const activeTimes = JSON.parse(process.env.VUE_APP_ACTIVE_HOURS);
        let isActive = false;
        activeTimes.forEach((timespan) => {
            if (currentHour >= timespan[0] && currentHour <= timespan[1]) {
                isActive = true;
            }
        });
        return isActive;
    }
}