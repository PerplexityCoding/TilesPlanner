<template>
    <section id="app" class="mainContent" v-cloak v-bind:class="{ designerMod: designerMod }">
        <section class="leftContent">
            <section>
                <select v-model="selectedWorkspace" v-on:change="selectWorkspace">
                    <option v-for="workspace in workspaces" v-bind:value="workspace.id">{{workspace.name}}</option>
                </select>

                <button v-on:click="showNewModal=true">new</button>
                <button v-on:click="showRenameModal=true">rename</button>
                <button v-on:click="deleteWorkspace">delete</button>
            </section>

            <ul class="tiles">
                <grid-tile v-for="gridTile in board.gridTiles" :grid-tile="gridTile"
                           v-on:grid-tile-dblclick="deleteTile"
                           v-on:tile-drop-on-grid-tile="dropTile"
                ></grid-tile>
            </ul>
        </section>

        <section class="rightContent">
            <button v-on:click="toggleDesignerMod">
                Designer Mod: {{designerMod}}
            </button>

            <hr/>

            <ul class="tiles">
                <tile v-for="tile in toolBox.tiles" v-on:tile-click="addTile" :tile="tile"></tile>
            </ul>
        </section>

        <modal v-if="showNewModal">
            <h3 slot="header">
                New tiles board
            </h3>

            <section slot="body">
                To create new board !
                <label for="board-name-new">Board name:</label>
                <input id="board-name-new" type="text" v-model="newBoardName" />
            </section>

            <section slot="footer">
                <button @click="closeNewWorkspaceModal"> Create </button>
            </section>
        </modal>

        <modal v-if="showRenameModal">
            <h3 slot="header">
                Rename board
            </h3>

            <section slot="body">
                Rename the board
                <label for="board-name-rename">Board name:</label>
                <input id="board-name-rename" type="text" v-model="newBoardName" />
            </section>

            <section slot="footer">
                <button @click="closeRenameWorkspaceModal"> Close </button>
            </section>
        </modal>

    </section>
</template>

<script>
    import GridTile from '../grid-tile';
    import Tile from '../tile';
    import Modal from '../modal'
    import Vue from 'vue';

    export default {
        name: 'App',
        components: {
            GridTile,
            Tile,
            Modal
        },
        created() {
            this.loadWorkspaces();
            this.loadWorkspace();
            if (!this.board.gridTiles) {
                this.initGridTiles();
            }

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
                localStorage.setItem('workspaces', JSON.stringify(this.workspaces));
            },
            resetBoard() {
                this.board = {
                    gridTiles: []
                };
            },
            loadWorkspace() {
                let workspaceId = this.getWorkspaceIdFromHash();
                if (workspaceId) {
                    let workspace = this.findWorkspaceById(workspaceId);
                    if (workspace) {
                        this.board = workspace.data;
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
                let workspaces = localStorage.getItem('workspaces');

                if (workspaces) {
                    this.workspaces = JSON.parse(workspaces);
                } else { // old workspaces
                    let keys = Object.keys(localStorage);
                    if (keys) {
                        this.workspaces = keys.filter(s => s.startsWith('workspace-')).map((s) => {
                            let id = s.split('workspace-')[1];
                            let workspaceData = JSON.parse(localStorage.getItem(s));
                            return {
                                id: id,
                                name: id,
                                data: workspaceData
                            };
                        });
                    }
                }
            },
            findWorkspaceById(workspaceId) {
                let result = this.workspaces.filter((o) => {return o.id == workspaceId});
                if (result && result.length > 0) {
                    return result[0];
                }
                return null;
            },
            findWorkspaceIdxById(workspaceId) {
                return this.workspaces.map((o) => {return o.id}).indexOf(workspaceId);
            },
            selectWorkspaceId(workspaceId) {
                this.selectedWorkspace = workspaceId;
                location.hash = this.selectedWorkspace;
            },
            selectWorkspace() {
                this.selectWorkspaceId(this.selectedWorkspace);
                this.loadWorkspace();
            },
            openNewWorkspaceModal() {
                this.showNewModal = true;
            },
            closeNewWorkspaceModal() {
                let newWorkspaceId = this.guid();

                this.workspaces.push({
                    id: newWorkspaceId,
                    name: this.newBoardName,
                    data: {
                        gridTiles: this.createGridTiles()
                    }
                });
                this.selectWorkspaceId(newWorkspaceId);

                this.loadWorkspace();
                this.initGridTiles();
                this.save();

                this.showNewModal = false;
            },
            closeRenameWorkspaceModal() {
                let worskpace = this.findWorkspaceById(this.selectedWorkspace);
                worskpace.name = this.newBoardName;

                this.showRenameModal = false;
            },
            deleteWorkspace() {
                let currentIdx = this.findWorkspaceIdxById(this.selectedWorkspace);

                this.workspaces.splice(currentIdx, 1);
                if (this.workspaces.length > 0) {
                    this.selectWorkspaceId(this.workspaces[currentIdx > 0 ? currentIdx - 1 : 0].id);
                } else {
                    this.selectWorkspaceId('');
                }

                this.loadWorkspace();
            },
            createGridTiles() {
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
                return gridTiles;
            },
            initGridTiles() {
                this.board.gridTiles = this.createGridTiles();
            },
            getFirstEmptyTile() {
                for (let gridTile of this.board.gridTiles) {
                    if (!gridTile.tile) {
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
        data() {
            return {
                showNewModal: false,
                showRenameModal: false,
                newBoardName: '',
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
        }
    }
</script>

<style scoped>
    .mainContent {
        display: flex;
        height: calc(100vh - 4rem);
        margin: 2rem;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .leftContent {
        flex: 1;
        padding: 1rem;
        background-color: #ebebeb;
    }

    .leftContent .tiles {
        list-style: none;
        display: grid;
        grid-template-rows: repeat(3, 100px);
        grid-auto-flow: column;
        grid-auto-columns: 100px;
        background: white;
        padding: 0;
    }

    .rightContent {
        width: 250px;
        background-color: #cacaca;
    }

    .rightContent .tiles {
        list-style: none;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 100px;
        grid-template-columns: repeat(2, 100px);
        grid-row-gap: 1rem;
        justify-content: space-evenly;
        margin-top: 10px;
        padding: 0;
    }

    .designerMod .leftContent .tiles li {
        outline: 1px dashed grey;
    }

    .rightContent .tiles li {
        padding: 5px;
    }

    .rightContent .tileItem {
        position: relative;
    }

</style>

<style>
    [v-cloak] {
        display: none;
    }

    body {
        background-color: #424b49;
    }
</style>
