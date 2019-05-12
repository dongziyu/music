<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}} {{song.songname}} -</span>
              <span>{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { playListMixin } from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === 0) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList:'SET_TOPLIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  background: #f4f4f4;

  .toplist {
    height: 100%;
    overflow: hidden;
    ul{
      padding-top 1px
    }
    .item {
      display: flex;
      margin: 10px 10px;
      height: 100px;
      background-color #fff

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: #000000d1;
        font-size: 14px;

        .song {
          no-wrap();
          line-height: 26px;
          span:last-child {
            color :#00000080
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>