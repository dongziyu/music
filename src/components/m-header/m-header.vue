<template>
  <div class="m-header">
    <div class="icon"></div>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    font-family : '微软雅黑'
    height: 44px
    text-align: center
    color: white
    font-size: 0
    background-color #31c27c
    .icon
      display: inline-block
      width: 80px
      height: 28px
      margin: 8px auto
      bg-image('logo')
      background-size: cover
      background-repeat :no-repeat
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: white
</style>