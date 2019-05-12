<template>
  <transition name="slider">
    <music-list :songs='songs' :title="title" :bg-image='bgImage'></music-list>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { createSong } from "common/js/song";
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    },
    ...mapGetters(["singer"])
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      if(!this.singer.id){
        this.$router.go(-1)
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === 0) {
          this.songs=this.normalizeSongs(res.data.list)
        }
      });
    },
    normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item;
        // 如果歌曲id存在，则将包含其他信息的歌曲推送到数组中
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components:{
    MusicList
  }
};
</script>
<style lang="stylus" scoped>

.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
