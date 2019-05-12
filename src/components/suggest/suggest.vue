<template>
  <scroll ref='scroll' class="suggest" :data='result' :pullup='pullup' @scrollToEnd='searchMore'>
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <img :src="getAvatar(item)">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name" :class="{isSinger:item.type==='singer'}">
          <h6 class="text" v-html="getName(item)"></h6>
          <p class="singer" v-html="getSingerName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=''></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length&&!hasMore">
      暂无搜索结果
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  // import {filterSinger} from 'common/js/song'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'

  const perpage = 20
  export default {
    data(){
      return{
        page:1,
        result:[],
        pullup:true,
        hasMore:true,//有无更多数据
      }
    },
    props:{
      query:{
        type:String,
        default:''
      },
      type:{
        type:String,
        default:'song'
      }
    },
    methods:{
      refresh(){
        this.$refs.scroll.refresh()
      },
      search(){
        if(!this.query){
          return
        }
        this.page=1
        this.hasMore=true
        this.$refs.scroll.scrollTo(0,0)
        search(this.query, this.type, perpage, this.page).then(res=>{
          if(res.code===200){
            this.result=this.genResult(res.data)
            this.checkMore(res.data)
          }
        })
      },
      // 上拉刷新
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        search(this.query, this.type, perpage, this.page).then(res=>{
          if(res.code===200){
            this.result=this.result.concat(this.genResult(res.data))
            this.checkMore(res.data)
          }
        })
      },
      // 判断是否有更多数据
      checkMore(data){
        const song=data.list
        if(!song.length||(data.curnum+data.curpage*perpage)>data.totalnum){
          this.hasMore=false
        }
      },
      selectItem(item){
        if(item.type==='singer'){
          const singer = new Singer({
            id:item.mid,
            name:item.name,
          })
          this.$router.push({
            path:`/search/${singer.id}`
          })
          this.setSinger(singer)
        }else{
          this.insertSong(item)
        }
        this.$emit('select')
      },
      // 处理得到的数据，将歌手和歌曲列表信息添加到数组 
      genResult(data){
        let ret=[]
        let keyword = this.query.trim()
        if(!data.list.length){
          return ret
        }
        let hasSinger = data.list[0].singer[0].name
        if(keyword===hasSinger && this.page===1){
          ret.push({...data.list[0].singer[0],...{type:'singer'}})
        }
        if(data.list){
          ret=ret.concat(this.normalizeSongs(data.list))
        }
        return ret
      },
      normalizeSongs(list){
        let ret =[]
        list.forEach((musicData)=>{
          if(musicData.songid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      // 区分搜索的是歌手还是歌曲添加对应 class
      getIconCls(item){
        if(item.type!='singer'){
          return 'icon-music'
        }
      },
      getAvatar(item){
        if(item.type==='singer'){
          const singer = new Singer({
            id:item.mid
          })
          return singer.avatar
        }
      },
      getName(item){
        if(item.type==='singer'){
          return item.name
        }else{
          return `${item.name}`
        }
      },
      getSingerName(item){
        if(item.type==='singer'){
          return ''
        }else{
          return `${item.singer}`
        }
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch:{
      query(){
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      // padding-top 8px
      .suggest-item
        position relative
        display: flex
        align-items: center
        height 60px
        padding-left 58px
        &::after
          content: "";
          position: absolute;
          height: 1px;
          top: 0;
          left: 0;
          right: 0;
          background: #e5e5e5
      .icon
        flex: 0 0 36px
        width: 40px
        height 40px
        top 20px
        left 16px
        position absolute
        img
          width: 100%
          display: block
          position: absolute
          left: -6px
          top: -8px
          border-radius 20px

        [class^="icon-"]
          font-size: 24px
          color: #656565a2
      .isSinger
        margin-top 0.8em
      .name
        flex: 1
        color: #000
        overflow: hidden
        .text
          no-wrap()
          font-size 16px
        .singer
          padding-top: 8px
          color: gray
          font-size 12px
    .no-result-wrapper
      font-family sans-serif
      margin 30%
      font-size 16px 
      text-align center
      font-weight 550
      color #5b5959a6
</style>