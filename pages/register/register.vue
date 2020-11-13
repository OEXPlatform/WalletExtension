<template>
	<view class="login">
		<image src="../../static/img/back_icon.png" class="back" @tap="backHandler"></image>
		<view class="title">{{i18n.registerTitle}}</view>
		<view class="img"><image :src="i18n.msg_first" :style="i18n.msg_first_style"></image></view>
		<view class="img2"><image :src="i18n.msg_secound" :style="i18n.msg_secound_style"></image></view>
		<view class="bottom">
			<view class="left" @tap="registerHandler(1)">
				<image src="../../static/img/xiaobaiIcon.png"></image>
				<text>{{i18n.xbzhname}}</text>
			</view>
			<view class="left right" @tap="registerHandler(2)">
				<image src="../../static/img/majorIcon.png"></image>
				<text>{{i18n.zyyhname}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		methods:{
			registerHandler(n){
				if(n == 1) this.BASE.navigateTo('./xiaobai')
				else this.BASE.navigateTo('./safetyTips')
			},
			backHandler(){
				this.BASE.navigateBack()
			}
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
