<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <div class="middle" 
        @touchstart='middleTouchStart'
        @touchmove='middleTouchMove'
        @touchend='middleTouchEnd'>
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdwrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{playingLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data='currentLyric&&currentLyric.lines'>
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" 
                v-for="(line,index) in currentLyric.lines" 
                :class="{'current':currentLineNum===index}">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :fullScreen='fullScreen' :percent="percent" @changePercent='onPercentChange'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius='radius' :percent='percent' @emitClick='togglePlaying'>
            <i :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio
      :src="currentSong.url"
      ref="audio"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import playlist from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin'

export default {
  mixins:[playerMixin],
  data() {
    return {
      songReady: false,//歌曲播放状态
      currentTime: 0,
      radius:32,
      currentLyric:null,
      currentLineNum:0,
      currentShow:'cd',
      playingLyric:''
    }
  },
  created(){
    this.touch={}
  },
  computed: {
    // 播放按钮图标 class
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play"
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini"
    },
    cdCls(){
      return this.playing?'play':'play pause'
    },
    disableCls() {
      return this.songReady ? "" : "disable"
    },
    percent(){
      return this.currentTime/this.currentSong.duration
    },
    ...mapGetters([
      "fullScreen",
      "playing",
      "currentIndex",
    ])
  },
  methods: {
    showPlaylist(){
      this.$refs.playlist.show()
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if(this.playlist.length===1){
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1;
        if (index == -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if(this.playlist.length===1){
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1;
        if (index == this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    // 歌曲结束判断循环还是下一首
    end(){
      if(this.mode===playMode.loop){
        this.loop()
      }else {
        this.next()
      }
    },
    // 单曲循环
    loop(){
      this.$refs.audio.currentTime=0
      this.$refs.audio.play()
      if(this.currentLyric){
        this.currentLyric.seek(0)
      }
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if(this.currentLyric){
        this.currentLyric.togglePlay()
      }
    },
    getLyric(){
      this.currentSong.getLyric().then((lyric)=>{
        if(this.currentSong.lyric!==lyric) {
          return
        }
        this.currentLyric=new Lyric(lyric,this.handlerLyric)
        if(this.playing){
          this.currentLyric.play()
        }
      }).catch(()=>{
        this.currentLyric=null
        this.playingLyric=''
        this.currentLineNum=0
      })
    },
    handlerLyric({lineNum, txt}){
      this.currentLineNum=lineNum
      if(lineNum>5){
        let lineEl=this.$refs.lyricLine[lineNum-5]
        this.$refs.lyricList.scrollToElement(lineEl,1000)
      }else{
        this.$refs.lyricList.scrollTo(0,0)
      }
      this.playingLyric=txt
    },
    middleTouchStart(e){
      this.touch.boolean=true
      this.touch.moved = false
      const touch=e.touches[0]
      this.touch.startX=touch.pageX
      this.touch.startY=touch.pageY
    },
    middleTouchMove(e){
      if(!this.touch.boolean){
        return
      }
      const touch=e.touches[0]
      const deltaX=touch.pageX-this.touch.startX
      const deltaY=touch.pageY-this.touch.startY
      if(Math.abs(deltaY)>Math.abs(deltaX)){
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left=this.currentShow==='cd'?0:-window.innerWidth
      const offetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))
      this.touch.percent=Math.abs(offetWidth/window.innerWidth)
      this.$refs.lyricList.$el.style.transform=`translate(${offetWidth}px,0)`
      this.$refs.lyricList.$el.style.transitionDuration=0
      this.$refs.middleL.style.opacity=1-this.touch.percent
      this.$refs.middleL.style.transitionDuration=0
      
    },
    middleTouchEnd(){
      if (!this.touch.moved) {
        return
      }
      let offetWidth
      let opacity
      if(this.currentShow==='cd'){
        if(this.touch.percent>0.1){
          offetWidth=-window.innerWidth
          opacity=0
          this.currentShow='lyric'
        }else{
          offetWidth=0
          opacity=1
        }
      }else{
        if(this.touch.percent<0.9){
          offetWidth=0
          opacity=1
          this.currentShow='cd'
        }else{
          opacity=0
          offetWidth=-window.innerWidth
        }
      }
      this.$refs.lyricList.$el.style.transform=`translate(${offetWidth}px,0)`
      this.$refs.lyricList.$el.style.transitionDuration='300ms'
      this.$refs.middleL.style.opacity=opacity
      this.$refs.middleL.style.transitionDuration='300ms'
      this.touch.boolean=false
    },
    
    // 改变歌曲列表后，歌曲序号也改变，遍历每一项找出与当前歌曲相同的歌曲的 index，
    // 在setPlayList之前设置为当前歌曲 index，保持切换播放模式而不切换当前歌曲
    
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error() {
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    format(time) {
      time = time | 0
      let minute = time / 60 | 0
      let second = time % 60
      if(minute<10){
        minute='0'+minute
      }
      if(second<10){
        second='0'+second
      }
      return `${minute}:${second}`
    },
    onPercentChange(percent){
      this.$refs.audio.currentTime=this.currentSong.duration*percent
      // 如果歌曲为暂停，调用播放方法
      if(!this.playing){
        this.togglePlaying()
      }
      if(this.currentLyric){
        this.currentLyric.seek(this.currentSong.duration*percent*1000)
      }
    },
    getPosAndScale() {
      // 小图宽度
      const targetWidth = 40;
      // 小图中心距屏幕左边宽度
      const paddingLeft = 40;
      // 距屏幕底部高度
      const paddingBottom = 30;
      // 大图顶部距顶部高度
      const paddingTop = 80;
      // 大图宽度
      const width = window.innerWidth * 0.8;
      // 缩放比例: 小图与大图比例
      const scale = targetWidth / width;
      // x 轴位移距离
      const x = -(window.innerWidth / 2 - paddingLeft);
      // y 轴位移距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong(newSong,oldSong) {
      if (!newSong.id){
        return
      }
      if(newSong.id===oldSong.id){
        return
      }
      if(this.currentLyric){
        this.currentLyric.stop()
        this.currentTime=0
        this.playingLyric=''
        this.currentLineNum=0
      }
      this.$refs.audio.volume=0.2
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    // 监听播放状态来播放暂停歌曲
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      })
    },
    
  },
  components:{
    progressBar,
    progressCircle,
    Scroll,
    playlist
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #393939;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: #ffffffad;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin 0 5px
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: #ffffffad;

          &.disable {
            color: #ffffff4f;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 25px;
        color: #ffffffad;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
        z-index -1
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>