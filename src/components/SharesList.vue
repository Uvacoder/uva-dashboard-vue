<template>
    <div class="wrapper">
        <v-simple-table v-if="this.priceList.length > 0">
            <thead>
                <tr>
                    <th class="text-left">ISIN</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Development (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="share in this.priceList" :key="share.isin">
                    <td>{{ share.isin || '-'}}</td>
                    <td>{{ share.name }}</td>
                    <td>{{ share.price }} {{ share.toCurrency ? `(${share.toCurrency})` : '(EUR)' }}</td>
                    <td :class="{ 'green--text': priceDiff(share.price, share.previousPrice) >= 0, 'red--text': priceDiff(share.price, share.previousPrice) < 0 }">
                        {{ priceDiff(share.price, share.previousPrice) }}
                        {{ priceDiff(share.price, share.previousPrice) >= 0 ? '&#129045;' : '&#129047;' }}
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script>
export default {
    mounted () {
        this.fetchData()
    },
    props: {
        isins: {
            type: Array,
            default () {
                return []
            }
        },
        coins: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            priceList: []
        }
    },
    computed: {
        priceDiff () {
            return (price, previousPrice) => (previousPrice !== false ? (((price / previousPrice)) * 100) - 100 : 0).toFixed(2)
        }
    },
    methods: {
        fetchData () {
            if (this.isins.length < 1) {
                return
            }

            this.isins.forEach(isin => {
                fetch('http://localhost:3000/etf?isin=' + isin).then(
                    async (res) => {
                        const responseJson = await res.json()
                        this.priceList.push(responseJson)
                    }
                )
            })

            this.coins.forEach(name => {
                fetch('http://localhost:3000/crypto?name=' + name).then(
                    async (res) => {
                        const responseJson = await res.json()
                        this.priceList.push(responseJson)
                    }
                )
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.green {
    color: green;
}

.red {
    color: red;
}
</style>