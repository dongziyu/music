<template>
  <div class="progress-circle" @click.stop="toggleClick">
    <svg :width='radius' :height='radius' viewBox="0 0 100 100" version="1.1"
    xmlns="http://www.w3.org/2000/svg">
      <!-- <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/> -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
      :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    
    props:{
      radius:{
        type:Number,
        default:100
      },
      percent:{
        type:Number,
        default:0
      }
    },
    computed: {
      dasharray(){
        return Math.PI*100
      },
      dashoffset(){
        return this.dasharray*(1-this.percent)
      }
    },
    methods:{
      toggleClick(){
        this.$emit('emitClick')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-circle
    position: relative
    circle
      stroke-width: 11px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: #ffffffd6
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: #5d5757b8
</style>