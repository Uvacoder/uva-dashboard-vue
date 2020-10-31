<template>
    <div id="list-widget">
        <v-container>
            <v-text-field
                v-if="this.showInput"
                v-model="item"
                label="Zur Liste hinzufügen"
                @keydown.enter="create"
                append-icon="mdi-basket-plus"
                @click:append="create"
            >
            </v-text-field>
        
            <h2 class="heading display-1 pl-4">
                {{this.heading || "Items"}}:&nbsp;
                <v-fade-transition leave-absolute>
                    <span :key="`items-${items.length}`">
                        {{ items.length }}
                    </span>
                </v-fade-transition>
            </h2>
        
            <v-divider class="mt-4"></v-divider>
        
            <v-row class="my-1" align="center">
                <strong class="mx-4 info--text text--darken-2">
                Übrig: {{ remainingItems }}
                </strong>
        
                <v-divider vertical></v-divider>
        
                <strong class="mx-4 success--text text--darken-2">
                Fertig: {{ completedItems }}
                </strong>
        
                <v-spacer></v-spacer>
        
                <v-progress-circular :value="progress" class="mr-2"></v-progress-circular>
            </v-row>
        
            <v-divider class="mb-4"></v-divider>
        
            <v-card v-if="items.length > 0">
                <v-slide-y-transition class="py-0" group tag="v-list">
                    <template v-for="(item, i) in items">
                        <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                        <v-list-item :key="`${i}-${item.text}`">
                            <v-list-item-action>
                                <v-checkbox v-model="item.done" :color="item.done && 'grey' || 'primary'">
                                    <template v-slot:label>
                                        <div
                                        :class="item.done && 'grey--text' || 'primary--text'"
                                        class="ml-4"
                                        v-text="item.text"
                                        ></div>
                                    </template>
                                </v-checkbox>
                            </v-list-item-action>
                
                            <v-spacer></v-spacer>
                
                            <v-scroll-x-transition>
                                <v-icon v-if="item.done" color="success">mdi-check</v-icon>
                            </v-scroll-x-transition>
                        </v-list-item>
                    </template>
                </v-slide-y-transition>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import taskList from "../../resources/itemList.json";

export default {
    mounted() {
        console.log(taskList)
        this.items = taskList;
    },
    props: {
        showInput: Boolean,
        heading: String,
        filePath: String
    },
    data() {
        return {
            items: [],
            item: null,
        }
    },

    computed: {
        completedItems () {
            return this.items.filter(item => item.done).length
        },
        progress () {
            return this.completedItems / this.items.length * 100
        },
        remainingItems () {
            return this.items.length - this.completedItems
        },
    },

    methods: {
        create () {
            this.items.push({
                done: false,
                text: this.item,
            });

            this.item = null
            this.saveToFile(this.items, "../../resources/itemList.json");
        }
    },
}
</script>

<style lang="scss" scoped>
#list-widget {
    background: white;
    height: 100%;

    .heading {
        margin-left: -12px;
    }
}
</style>