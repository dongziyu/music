<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      position relative
    .router-link-active
      .tab-link
        color: #31c27c
    .router-link-active:after
       content ""
       display block
       position absolute
       bottom: 0
       left 0
       right 0
       height 2px
       background #31c27c
      .tab-link
        padding-bottom: 5px
        color: #000
      &.router-link-active
        .tab-link
          color: #31c27c
          border-bottom: 2px solid #31c27c
</style>