<template>
    <div class="tileItem">
        <span class="tileCount">{{tile.count}}</span>
        <img class="item" :src="imgHref" v-on:click="click" v-on:dragstart="dragstart" draggable="true"/>
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


<style scoped>
    .item {
        width: 100px;
        height: 100px;
    }

    .tileCount {
        position: absolute;
        z-index: 21;
        height: 1rem;
        width: 1rem;
        text-align: center;
        background: #ffd04e;
        line-height: 1rem;
        border-radius: 25px;
        top: 0.2rem;
        right: 0.2rem;
        display: none;
    }
</style>

<style>
    .designerMod .tileCount {
        display: block;
    }
</style>
