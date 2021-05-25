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
                    <td>{{ etf.previousPrice !== false ? ((etf.price / etf.previousPrice) - 1) * 100 : 0 }}</td>
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
    methods: {
        fetchData () {
            if (this.isins.length < 1) {
                return
            }

            this.isins.forEach(isin => {
                fetch('http://localhost:3000/isin?isin=' + isin).then(
                    async (res) => {
                        const responseJson = await res.json()
                        this.priceList.push(responseJson)
                    }
                )
            })

            console.log(this.priceList)
        }
    }
}
</script>