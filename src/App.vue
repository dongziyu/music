<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 将路由区域缓存到内存中 -->
    <keep-alive>
      <router-view></router-view>      
    </keep-alive>
    <player></player>
    <tip></tip>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
import Tip from 'base/tip/tip'

export default {
  components:{
    MHeader,
    Tab,
    Player,
    Tip
  }
}
</script>




