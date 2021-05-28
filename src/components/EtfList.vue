<template>
    <div class="wrapper">
        <v-simple-table v-if="this.priceList.length > 0">
            <thead>
                <tr>
                    <th class="text-left">ISIN</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Development</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="etf in this.priceList" :key="etf.isin">
                    <td>{{ etf.isin }}</td>
                    <td>{{ etf.name }}</td>
                    <td>{{ etf.price }}</td>
                    <td :class="{ 'green--text': priceDiff(etf.price, etf.previousPrice) >= 0, 'red--text': priceDiff(etf.price, etf.previousPrice) < 0 }">
                        {{ priceDiff(etf.price, etf.previousPrice) }}
                        {{ priceDiff(etf.price, etf.previousPrice) >= 0 ? '&#129045;' : '&#129047;' }}
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