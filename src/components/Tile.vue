<template>
    <div class="tileItem">
        <span class="tileCount">{{tile.count}}</span>
        <img class="item" :src="imgHref" v-on:click="click" v-on:dragstart="dragstart" draggable="true"></img>
    </div>
</template>

<script>
    module.exports = {
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
                return `img/${this.tile.name}.png`;
            }
        }
    };
</script>
