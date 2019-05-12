<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" placeholder="搜索歌曲、歌手" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {

  data() {
    return {
      query: ''
    }
  },
  created() {
    // 把搜索框的值传递给父组件
    this.$watch('query', debounce(
      (newQuery) => {
        this.$emit('query', newQuery)
      }, 400)
    )
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 18px;
  height: 60px;
  background: #f4f4f4;
  position: relative;

  .icon-search {
    position: absolute;
    left: 30px;
    font-size: 26px;
    color: #c4c4c4;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    height: 35px;
    color: #a0a0a0;
    font-size: $font-size-medium;
    padding-left: 35px;
    border-radius: 6px;
    border: none;

    &::placeholder {
      color: #c4c4c4;
    }
  }

  .icon-dismiss {
    font-size: 18px;
    color: #a5a5a5de;
    position: absolute;
    right: 40px;
  }
}
</style>