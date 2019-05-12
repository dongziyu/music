<template>
  <div class="music-list">
    <div class="back" @click="click">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length" ref="playBtn" @click="random">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank='rank' @select="selectItem"></song-list>
      </div>
      <loading class="loading-container" v-show="!songs.length"></loading>
    </scroll>
  </div>
</template>
<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { prefixStyle } from "common/js/dom";
import { mapActions, mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const RESERVE_HEIGTH = 40;
export default {
  mixins: [playListMixin],
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.minTranslateY = -this.$refs.bgImage.clientHeight + RESERVE_HEIGTH;
    // 设置歌曲列表 top值为图片高度
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    click() {
      this.$router.back();
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    handlePlayList(list) {
      const bottom = list.length > 0 ? '50px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    random() {
      this.randomPlay({ list: this.songs })
    },
    ...mapMutations({
      setRandomMode: 'SET_PLAY_MODE'
    }),
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])

  },
  watch: {
    scrollY(newY) {
      // 滚动值小于图片高度时滚动值为 newY，大于时为图片高度值
      let TranslateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      this.$refs.layer.style[
        prefixStyle("transform")
      ] = `translate3d(0,${TranslateY}px,0)`;
      const percent = Math.abs(newY / this.$refs.bgImage.clientHeight);
      // 往下拉图片缩放
      if (newY > 0) {
        zIndex = 10;
        let scale = 1 + percent;
        this.$refs.bgImage.style[prefixStyle("transform")] = `scale(${scale})`;
      }
      // 拉到顶部挡住文字
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVE_HEIGTH}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: #ffffffad;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: #ffffffe0;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid #ffffffc9;
        color: #ffffffc9;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: bottom;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          margin-bottom: 2px;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    // overflow hidden
    .song-list-wrapper {
      padding: 20px 20px;
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