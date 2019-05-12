<template>
  <transition name="slide">
    <music-list :title='title' :rank='rank' :bg-image='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  export default {
    data(){
      return {
        songs:[],
        rank:true
      }
    },
    computed:{
      title(){
        return this.topList.topTitle
      },
      bgImage(){
        if(this.songs.length){
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created(){
      this._getTopList()
    },
    methods:{
      _getTopList(){
        if(!this.topList.id){
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res=>{
          if(res.code===0){
            this.songs=this.normalizeSong(res.songlist)
          }
        })
      },
      normalizeSong(list){
        let ret=[]
        list.forEach(item=>{
          const musicData = item.data
          if(musicData.songid&&musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>