import { Vue } from 'vue';
const TileComponent = require('./components/Tile.vue');

console.log(Vue);

Vue.component('gridTile', {
    props: ['gridTile'],
    template: `<li :style="style"
                    v-on:dblclick="dblclick"
                    v-on:drop="drop"
                    v-on:dragover="dragover"
                >
                   <tile v-if="gridTile.tile" :tile="gridTile.tile"></tile>
               </li>`,
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
});

new Vue({
    el: '#app',
    created() {
        this.load();
        if (!this.board.gridTiles) {
            this.initGridTiles();
        }
        this.loadWorkspaces();
    },
    methods: {
        getWorkspaceIdFromHash(create) {
            let hash = location.hash;
            if (hash && hash.length > 1) {
                hash = hash.split('#')[1];
                return hash;
            } else if (create) {
                return this.guid();
            }
            return null;
        },
        save() {
            let workspaceId = this.getWorkspaceIdFromHash(true);
            this.selectWorkspaceId(workspaceId);
            localStorage.setItem('workspace-' + workspaceId, JSON.stringify({
                gridTiles: this.board.gridTiles.map((gridTile) => {
                    return {
                        tile: gridTile.tile,
                        column: gridTile.column,
                        row: gridTile.row
                    };
                })
            }));
        },
        resetBoard() {
            this.board = {
                gridTiles: []
            };
        },
        load() {
            let workspaceId = this.getWorkspaceIdFromHash();
            if (workspaceId) {
                let workspace = localStorage.getItem('workspace-' + workspaceId);
                if (workspace) {
                    this.board = JSON.parse(workspace);
                } else {
                    this.resetBoard();
                }
                this.selectWorkspaceId(workspaceId);
            } else {
                this.resetBoard();
            }
            this.updateCountByTiles();
        },
        loadWorkspaces() {
            let keys = Object.keys(localStorage);
            if (keys) {
                this.workspaces = keys.map((s) => {
                    return s.split('workspace-')[1];
                });
            }
        },
        selectWorkspaceId(workspaceId) {
            this.selectedWorkspace = workspaceId;
            location.hash = this.selectedWorkspace;
        },
        selectWorkspace() {
            this.selectWorkspaceId(this.selectedWorkspace);
            this.load();
        },
        newWorkspace() {
            let newWorkspaceId = this.guid();

            this.workspaces.push(newWorkspaceId);
            this.selectWorkspaceId(newWorkspaceId);

            this.load();
            this.initGridTiles();
            this.save();
        },
        deleteWorkspace() {
            let currentIdx = this.workspaces.indexOf(this.selectedWorkspace);

            this.workspaces.splice(currentIdx, 1);
            localStorage.removeItem('workspace-' + this.selectedWorkspace);

            if (this.workspaces.length > 0) {
                this.selectWorkspaceId(this.workspaces[currentIdx > 0 ? currentIdx - 1 : 0]);
            } else {
                this.selectWorkspaceId('');
            }

            this.load();
        },
        initGridTiles() {
            let gridTiles = [];
            for (let j = 1; j <= this.columns; j++) {
                for (let i = 1; i <= this.rows; i++) {
                    gridTiles.push({
                        id: this.gridTilesId++,
                        row: i,
                        column: j
                    });
                }
            }
            this.board.gridTiles = gridTiles;
        },
        getFirstEmptyTile() {
            for (let gridTile of this.board.gridTiles) {
                if (! gridTile.tile) {
                    return gridTile;
                }
            }
        },
        deleteTile(gridTile) {
            Vue.set(gridTile, 'tile', null);
            this.save();
            this.updateCountByTiles();
        },
        addTile(tile) {
            let gridTile = this.getFirstEmptyTile();
            Vue.set(gridTile, 'tile', tile);
            this.save();
            this.updateCountByTiles();
        },
        dropTile(gridTile, tile) {
            Vue.set(gridTile, 'tile', tile);
            this.save();
            this.updateCountByTiles();
        },
        guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        toggleDesignerMod() {
            this.designerMod = !this.designerMod;
        },
        updateCountByTiles() {
            let countByTiles = {};
            for (let gridTiles of this.board.gridTiles) {
                let tile = gridTiles.tile;
                if (tile) {
                    let countByTile = countByTiles[tile.name];
                    countByTiles[tile.name] = countByTile ? countByTile + 1 : 1;
                }
            }

            for (let toolBoxTile of this.toolBox.tiles) {
                let count = countByTiles[toolBoxTile.name] || 0;
                if (toolBoxTile.count != count) {
                    Vue.set(toolBoxTile, 'count', count);
                }
            }
        }
    },
    data: {
        tilesId: 0,
        gridTilesId: 0,
        rows: 3,
        columns: 10,
        selectedWorkspace: '',
        workspaces: [],
        designerMod: true,
        board: {
            gridTiles: []
        },
        toolBox: {
            tiles: [
                {
                    name: 'carreblanc'
                },
                {
                    name: 'carrenoir'
                },
                {
                    name: 'carrenoirblue'
                },
                {
                    name: 'cercle'
                },
                {
                    name: 'etoilecarre'
                },
                {
                    name: 'flacon'
                },
                {
                    name: 'flaconneige'
                },
                {
                    name: 'fleur'
                },
                {
                    name: 'fleurexotique'
                }
            ]
        }
    }
});
