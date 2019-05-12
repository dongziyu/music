<template>
  <scroll
    class="listview"
    :data="data"
    :probeType="probeType"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click='selectItem(item)' v-for="item in group.items" class="list-group-item" :key="item.name">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      v-if="data.length"
    >
      <ul>
        <li
          v-for="(item,index) in shortcutList"
          :data-index="index"
          :class="{'current':currentIndex===index}"
          class="item"
        >{{item}}</li>
      </ul>
    </div>
    <!-- 固定顶部标题 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from "base/scroll/scroll";
import { getData } from "common/js/dom";
const ANCHOR_HEIGHT = 18; //锚点元素高度
const TITLE_HEIGHT = 30; //顶部固定栏高度
export default {
  data() {
    return {
      listenScroll: true,
      currentIndex: 0, //当前歌手显示区域的 index
      scrollY: -1, //表示从上往下滑
      listHeight: [],
      probeType: 3,
      diff: -1 //元素高度与位移之差
    };
  },
  created() {
    this.touch = {};
  },
  props: {
    // 接受父组件传来的歌手列表
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList() {
      // 得到歌手首字母集合数组
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    // 将点击的元素信息派发出去
    selectItem(item){
      this.$emit('select',item)
      // this.$router.push({
      //   path:`/singer/${id}`
      // })
    },
    onShortcutTouchStart(e) {
      // 获得事件对象的 index值
      let anchorIndex = getData(e.target, "index");
      // 获得第一次触碰点的坐标
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
    },
    onShortcutTouchMove(e) {
      // 获取移动过程中的坐标
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      // 将两次的坐标差分为几个锚点
      let delta = parseInt((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
      // 当前触摸点的 index
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
    },
    scroll(pos) {
      this.scrollY = pos.y; //获得滚动距离
    },
    refresh(){
      this.$refs.listview.refresh()
    },
    calculateHeight() {
      // 获取每个歌手分组的高度并添加到一个数组
      const list = this.$refs.listGroup;
      this.listHeight = [];
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.calculateHeight();
      }, 20);
    },
    // 判断当前滚动的区域位于哪个区间
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 顶部继续下拉
      if (newY > 0) {
        this.currentIndex = 0;
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i];
        const height2 = listHeight[i + 1];
        // 中间区域
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
        // 滚动到底部且-newY大于最后一个元素的上限
        if (-newY > height2) {
          this.currentIndex = listHeight.length - 2;
        }
      }
    },
    // 顶部标题偏移
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 由于 newVal是变化的，通过立即触发条件减少 dom渲染
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: #393535cc;
      background: #e2e5e5;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: #666;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    padding: 18px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: #000000;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: #393535cc;
      background: #e2e5e5;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>