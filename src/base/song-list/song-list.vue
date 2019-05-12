<template>
  <div class="song-list">
    <ul>
      <li v-for="(item,index) in songs" class="item" @click="selectItem(item,index)">
        <div class="rank" v-show='rank'>
          <span class="rank-number">{{index+1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectItem(item, index) {
      // 给父组件派发事件并传参
      this.$emit("select", item, index)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 10px;
      width: 10px;
      margin-right: 20px;
      text-align: left;
      .rank-number{
        color #777
        font-size 16px
        font-weight 300
        font-family sans-serif
      }
    }
  &:nth-child(-n+3){
    .rank-number {
      color #FF400B
    }
  }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        no-wrap();
        color: #000000f2;
      }
      .desc {
        no-wrap();
        margin-top: 4px;
        color: #6c6969a3;
      }
    }
  }
}
</style>