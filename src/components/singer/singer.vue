<template>
  <div class="singer" ref="singer">
      <router-view></router-view>
      <list-view :data='singers' @select='selectSinger' ref="listview"></list-view>
  </div>
</template>
<script>
import { getSingerList } from "api/singer"
import Singer from "common/js/singer"
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import { playListMixin } from 'common/js/mixin'
export default {
  mixins:[playListMixin],
  data() {
    return {
      singers: []//歌手列表
    }
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlayList(list) {
      const bottom = list.length > 0 ? '50px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh()
    },
    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      // 将参数传给 mutation方法
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        //歌手对象
        hot: {
          title: "热门",
          items: []
        }
      };
      list.forEach((item, index) => {
        // 创建热门歌手对象
        if (index < 10) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        // 以歌手首字母创建的对象
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
      })
      let ret=[]
      let hot=[]
      for(let key in map){
          let val=map[key]
          if(val.title.match(/[a-zA-Z]/)){
              ret.push(val)
          }else if(val.title==='热门'){
              hot.push(val)
          }
      }
    // 将歌手首字母按从a-z排序
      ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },
    // 通过 mutations调用
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  },
  components:{
    ListView
  }
};
</script>
<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
