<template>
  <div class="loading">
    <img width="30" height="30" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    // props: {
    //   title: {
    //     type: String,
    //     default: '正在载入...'
    //   }
    // }
    data(){
      return{
        title:'正在载入...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    // width: 100%
    text-align: center
    .desc
      padding-left 10px
      line-height: 20px
      font-size: $font-size-small
      color: #5a6160b3
</style>
