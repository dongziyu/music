<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs='songs'></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import {createSong} from 'common/js/song'
export default {
  data(){
    return{
      songs:[]
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if(!this.disc.dissid){
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === 200) {
          this.songs=this.normalizeSong(res.data[0].songlist)
        }
      })
    },
    normalizeSong(list){
      let ret =[]
      list.forEach((item)=>{
        if(item.id&&item.album.id){
          ret.push(createSong(item))
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
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>