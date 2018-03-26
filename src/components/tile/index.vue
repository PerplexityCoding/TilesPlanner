<template>
    <div class="tileItem">
        <span class="tileCount">{{tile.count}}</span>
        <img class="item" :src="imgHref" v-on:click="click" v-on:dragstart="dragstart" draggable="true" />
    </div>
</template>

<script>
    export default {
        name: 'tile',
        props: ['tile'],
        methods: {
            click() {
                this.$emit('tile-click', {
                    name: this.tile.name
                });
            },
            dragstart(e) {
                e.dataTransfer.setData('tile', JSON.stringify({
                    name: this.tile.name
                }))
            }
        },
        computed: {
            imgHref() {
                return require(`./assets/img/${this.tile.name}.png`);
            }
        }
    };
</script>


<style>
    .item {
        width: 100px;
        height: 100px;
    }
</style>
