<template>
	<view class="start">
		<text class="title">欢迎使用OEX钱包</text>
		<view class="language">
			<view class="CN" @tap="change('zh')">中文</view>
			<view class="EN" @tap="change('en')">English</view>
		</view>
		<!-- <image src="../../static/img/startBtn.png" class="startBtn" @tap="startHandler"></image> -->
	</view>
</template>

<script>
	export default{
		data(){
			return{
				language:""
			}
		},
		methods:{
			startHandler(){
				this.BASE.navigateTo('../login/login')
			},
			change(lang) {
				var _this = this;
				let system_info = "";
				if(lang =='en'){
					_this.language ='en';
					uni.setStorageSync('language','en');
					system_info = "zh_CN";
					
				}else{
					_this.language = 'zh';
					uni.setStorageSync('language','zh');
					system_info="en"
				}
				system_info === 'en' ? system_info = this._i18n.locale = 'zh_CN' : system_info = this._i18n.locale = 'en'
				uni.setStorageSync('system_info',system_info)
				uni.reLaunch({
					url: '../login/login'
				})
			}
			
		}
	}
</script>

<style>
	.start{
		width: 750rpx;
		height: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background:url(../../static/img/startBg.png)no-repeat;
		background-size: cover;
		position: relative;
	}
	
	.title{
		width: 100%;
		height: auto;
		text-align: center;
		font-size: 25px;
		font-weight: 400;
		color: #141426;
		position: absolute;
		left: 0;
		top: 58%;
		font-family: Alibaba PuHuiTi;
		transform: translateY(-58%);
		letter-spacing: 1rpx;
	}
	.startBtn{
		width: 399rpx;
		height: 109rpx;
		position: absolute;
		left: 50%;
		top: 80%;
		transform: translate(-50%,-80%);
	}
	.language{
		width: 100%;
		height: auto;
		position: absolute;
		left: 50%;
		top: 80%;
		transform: translate(-50%,-80%);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		color: #00C9A7;
		font-weight: bold;
	}
	.language view{
		border-bottom: 1rpx solid #00C9A7;
		margin:0 60rpx;
	}
	
</style>
