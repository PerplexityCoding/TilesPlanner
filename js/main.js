(() => {

    /*let $tiles = $('.leftContent .tiles');

    function dropGrid() {
        $tiles.on('dragover', (e) => {
            e.preventDefault(); // Annule l'interdiction de drop
        });

        $tiles.on('drop', (e) => {
            let $target = $(e.target);
            let $newItem = createItem(e.originalEvent.dataTransfer.getData('text/html'));
            e.preventDefault();
            if (e.target == $tiles[0]) {
                $tiles.append($newItem);
            } else if ($target.hasClass('item')) {
                $target.attr('src', $newItem.find('img').attr('src'));
            }
            save();
        });

        $('.rightContent .item')
            .on('dragstart', (e) => {
                e.originalEvent.dataTransfer.setData('text/html', e.target.outerHTML);
            })

            .on('click', (e) => {
                $tiles.append(createItem(e.target.outerHTML));
                save();
            })
    }

    load();
    dropGrid();*/

    const TileComponent = Vue.component('tile', {
        props: ['tile'],
        template: `<img class="item" :src="imgHref" v-on:click="click" v-on:dragstart="dragstart" draggable="true"></img>`,
        methods: {
            click() {
                this.$emit('tile-click', this.tile);
            },
            dragstart(e) {
                console.log(e);
                e.dataTransfer.setData('tile', JSON.stringify(this.tile))
            }
        },
        computed: {
            imgHref() {
                return `img/${this.tile.name}.jpg`;
            }
        }
    });

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
                console.log('test');
                this.$emit('grid-tile-dblclick', this.gridTile);
            },
            drop(e) {
                const tile = JSON.parse(e.dataTransfer.getData('tile'));
                //this.gridTile.tile = tile;
                Vue.set(this.gridTile, 'tile', tile);
            },
            dragover(e) {
                e.preventDefault();
            }
        },
        computed: {
            style() {
                return {
                    "border": "1px solid red",
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
            },
            addTile(tile) {
                let gridTile = this.getFirstEmptyTile();
                Vue.set(gridTile, 'tile', tile);
                this.save();
            },
            guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            },
        },
        data: {
            tilesId: 0,
            gridTilesId: 0,
            rows: 3,
            columns: 10,
            selectedWorkspace: '',
            workspaces: [],
            board: {
                gridTiles: []
            },
            toolBox: {
                tiles: [
                    {
                        name: 'tile1'
                    },
                    {
                        name: 'tile2'
                    }
                ]
            }
        }
    });




})();
