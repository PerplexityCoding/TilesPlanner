<template>
    <li :style="style"
        v-on:dblclick="dblclick"
        v-on:drop="drop"
        v-on:dragover="dragover"
    >
        <tile v-if="gridTile.tile" :tile="gridTile.tile"></tile>
    </li>
</template>

<script>
    import Tile from '../tile';

    export default {
        name: 'grid-tile',
        props: ['gridTile'],
        components: {
            Tile
        },
        methods: {
            dblclick() {
                this.$emit('grid-tile-dblclick', this.gridTile);
            },
            drop(e) {
                const tile = JSON.parse(e.dataTransfer.getData('tile'));
                this.$emit('tile-drop-on-grid-tile', this.gridTile, tile);
            },
            dragover(e) {
                e.preventDefault();
            }
        },
        computed: {
            style() {
                return {
                    "grid-column": this.gridTile.column,
                    "grid-row": this.gridTile.row
                };
            }
        }
    };
</script>

