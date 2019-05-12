<template>
  <div class="tip" v-show="!flag">
		<p class="tip-text">将手机浏览器调整为全屏以获得更好使用体验！</p>
  </div>
</template>

<script>
export default {
	data(){
		return {
			flag:''
		}
	},
	mounted(){
		this.flag = window.localStorage.getItem('flag')
		setTimeout(() => {
			window.localStorage.setItem('flag','true')
			this.flag = window.localStorage.getItem('flag')
		}, 3000)
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tip
	width: 200px
	height: 50px
	border-radius: 10px
	position: fixed
	top: 50%
	left: 50%
	transform: translate(-50%)
	text-align: center
	background-color: #9d9d9da8
	padding: 10px 5px
	.tip-text
		color: #404040
		margin: 8px
</style>
