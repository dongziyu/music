<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @select="saveHistory" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import { saveSearch } from 'common/js/cache'
import { mapActions, mapGetters } from 'vuex'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playListMixin,searchMixin} from 'common/js/mixin'

export default {
  mixins:[playListMixin,searchMixin],
  data() {
    return {
      hotkey: []
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  methods: {
    handlePlayList(playlist){
      const bottom = playlist.length ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom=bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom=bottom
      this.$refs.suggest.refresh()
    },
    showConfirm() {
      this.$refs.confirm.show()
      // this.clearSearchHistory()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === 0) {
          let ret = res.data.hotkey.slice(0, 8)
          // 去掉字符串后的空格
          ret.forEach((item) => {
            item.k = item.k.trim()
          })
          this.hotkey = ret
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
      query(newQuery) {
        // 搜索值为空返回搜索历史页面时，重新刷新 scroll组件
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: #2c2828a8;
          font-weight: bold;
        }

        .item {
          display: inline-block;
          padding: 8px 10px;
          margin: 0 10px 10px 0;
          border-radius: 14px;
          border: 1px solid;
          font-size: $font-size-medium;
          color: #352d2d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: #4c49497d;

          .text {
            flex: 1;
            font-weight: bold;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: #4c49497d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 147px;
    bottom: 0;
  }
}
</style>