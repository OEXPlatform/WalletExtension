<template>
	<view class="languageBlock">
		<image
		:src="eye?'../../static/img/zh.png':'../../static/img/en.png'" 
		@tap="tapnum"
		class="eyes"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				eye:false,
			}
		},
		methods:{
			tapnum(){
				var _this = this;
				this.eye = !this.eye;
				let system_info = "";
				let data = "";
				if(!_this.eye){
					data = "en";
					system_info="zh_CN";
				}else{
					data = "zh";
					system_info="en";
				}
				uni.setStorageSync('language',data);
				system_info === 'en' ? system_info = this._i18n.locale = 'zh_CN' : system_info = this._i18n.locale = 'en'
				uni.setStorageSync('system_info',system_info)
			},
		}
	}
</script>

<style>
	.languageBlock{
		/* position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%); */
		width: auto;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.eyes{
		width: 102rpx;
		height: 48rpx; 
	}
</style>
