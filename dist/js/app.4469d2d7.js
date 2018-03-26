webpackJsonp([1],{0:function(e,t,i){e.exports=i("NHnr")},MtE2:function(e,t,i){"use strict";(function(e){var t=i("EuXz");i.n(t);e.exports={props:["tile"],methods:{click:function(){this.$emit("tile-click",{name:this.tile.name})},dragstart:function(e){e.dataTransfer.setData("tile",JSON.stringify({name:this.tile.name}))}},computed:{imgHref:function(){return"img/".concat(this.tile.name,".png")}}}}).call(t,i("f1Eh")(e))},NHnr:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i("EuXz"),s=(i.n(r),i("A0n/")),o=(i.n(s),i("fx22")),n=(i.n(o),i("mJx5")),a=(i.n(n),i("/5sW"));i("opib");console.log(a["Vue"]),a["Vue"].component("gridTile",{props:["gridTile"],template:'<li :style="style"\n                    v-on:dblclick="dblclick"\n                    v-on:drop="drop"\n                    v-on:dragover="dragover"\n                >\n                   <tile v-if="gridTile.tile" :tile="gridTile.tile"></tile>\n               </li>',methods:{dblclick:function(){this.$emit("grid-tile-dblclick",this.gridTile)},drop:function(e){var t=JSON.parse(e.dataTransfer.getData("tile"));this.$emit("tile-drop-on-grid-tile",this.gridTile,t)},dragover:function(e){e.preventDefault()}},computed:{style:function(){return{"grid-column":this.gridTile.column,"grid-row":this.gridTile.row}}}}),new a["Vue"]({el:"#app",created:function(){this.load(),this.board.gridTiles||this.initGridTiles(),this.loadWorkspaces()},methods:{getWorkspaceIdFromHash:function(e){var t=location.hash;return t&&t.length>1?(t=t.split("#")[1],t):e?this.guid():null},save:function(){var e=this.getWorkspaceIdFromHash(!0);this.selectWorkspaceId(e),localStorage.setItem("workspace-"+e,JSON.stringify({gridTiles:this.board.gridTiles.map(function(e){return{tile:e.tile,column:e.column,row:e.row}})}))},resetBoard:function(){this.board={gridTiles:[]}},load:function(){var e=this.getWorkspaceIdFromHash();if(e){var t=localStorage.getItem("workspace-"+e);t?this.board=JSON.parse(t):this.resetBoard(),this.selectWorkspaceId(e)}else this.resetBoard();this.updateCountByTiles()},loadWorkspaces:function(){var e=Object.keys(localStorage);e&&(this.workspaces=e.map(function(e){return e.split("workspace-")[1]}))},selectWorkspaceId:function(e){this.selectedWorkspace=e,location.hash=this.selectedWorkspace},selectWorkspace:function(){this.selectWorkspaceId(this.selectedWorkspace),this.load()},newWorkspace:function(){var e=this.guid();this.workspaces.push(e),this.selectWorkspaceId(e),this.load(),this.initGridTiles(),this.save()},deleteWorkspace:function(){var e=this.workspaces.indexOf(this.selectedWorkspace);this.workspaces.splice(e,1),localStorage.removeItem("workspace-"+this.selectedWorkspace),this.workspaces.length>0?this.selectWorkspaceId(this.workspaces[e>0?e-1:0]):this.selectWorkspaceId(""),this.load()},initGridTiles:function(){for(var e=[],t=1;t<=this.columns;t++)for(var i=1;i<=this.rows;i++)e.push({id:this.gridTilesId++,row:i,column:t});this.board.gridTiles=e},getFirstEmptyTile:function(){var e=!0,t=!1,i=void 0;try{for(var r,s=this.board.gridTiles[Symbol.iterator]();!(e=(r=s.next()).done);e=!0){var o=r.value;if(!o.tile)return o}}catch(e){t=!0,i=e}finally{try{e||null==s.return||s.return()}finally{if(t)throw i}}},deleteTile:function(e){a["Vue"].set(e,"tile",null),this.save(),this.updateCountByTiles()},addTile:function(e){var t=this.getFirstEmptyTile();a["Vue"].set(t,"tile",e),this.save(),this.updateCountByTiles()},dropTile:function(e,t){a["Vue"].set(e,"tile",t),this.save(),this.updateCountByTiles()},guid:function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},toggleDesignerMod:function(){this.designerMod=!this.designerMod},updateCountByTiles:function(){var e={},t=!0,i=!1,r=void 0;try{for(var s,o=this.board.gridTiles[Symbol.iterator]();!(t=(s=o.next()).done);t=!0){var n=s.value,l=n.tile;if(l){var c=e[l.name];e[l.name]=c?c+1:1}}}catch(e){i=!0,r=e}finally{try{t||null==o.return||o.return()}finally{if(i)throw r}}var d=!0,u=!1,h=void 0;try{for(var p,f=this.toolBox.tiles[Symbol.iterator]();!(d=(p=f.next()).done);d=!0){var g=p.value,m=e[g.name]||0;g.count!=m&&a["Vue"].set(g,"count",m)}}catch(e){u=!0,h=e}finally{try{d||null==f.return||f.return()}finally{if(u)throw h}}}},data:{tilesId:0,gridTilesId:0,rows:3,columns:10,selectedWorkspace:"",workspaces:[],designerMod:!0,board:{gridTiles:[]},toolBox:{tiles:[{name:"carreblanc"},{name:"carrenoir"},{name:"carrenoirblue"},{name:"cercle"},{name:"etoilecarre"},{name:"flacon"},{name:"flaconneige"},{name:"fleur"},{name:"fleurexotique"}]}}})},opib:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i("MtE2"),s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"tileItem"},[i("span",{staticClass:"tileCount"},[e._v(e._s(e.tile.count))]),i("img",{staticClass:"item",attrs:{src:e.imgHref,draggable:"true"},on:{click:e.click,dragstart:e.dragstart}})])},o=[],n=i("XyMi"),a=!1,l=null,c=null,d=null,u=Object(n["a"])(r["default"],s,o,a,l,c,d);t["default"]=u.exports}},[0]);
//# sourceMappingURL=app.4469d2d7.js.map