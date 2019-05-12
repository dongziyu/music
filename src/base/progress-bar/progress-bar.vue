<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="btnTouchStart"
        @touchmove.prevent="btnTouchMove"
        @touchend="btnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
export default {
  data() {
    return {
      progressBarLength: 0
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    fullScreen: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    btnTouchStart(e) {
      this.touch.boolean = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    btnTouchMove(e) {
      if (!this.touch.boolean) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const width = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this.setWidth(width)
    },
    btnTouchEnd() {
      this.touch.boolean = false
      this.trigglePercent()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this.setWidth(offsetWidth)
      this.trigglePercent()
    },
    trigglePercent() {
      const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - 16)
      this.$emit("changePercent", percent)
    },
    setWidth(width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.boolean) {
        const barWidth = this.progressBarLength - progressBtnWidth
        const progressWidth = newPercent * barWidth
        this.setWidth(progressWidth)

      }
    },
    // 第一次点击歌曲时，保存进度条长度
    fullScreen(flag) {
      if (flag) {
        this.progressBarLength = this.$refs.progressBar.clientWidth
      }
    }
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: #82808fa1;

    .progress {
      position: absolute;
      height: 100%;
      background: #bcbbbec9;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #757477;
        border-radius: 50%;
        background: #d1d1d1f7;
      }
    }
  }
}
</style>