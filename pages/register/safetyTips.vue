<template>
	<view class="login">
		<view style="height: auto;width: 100%;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
			<image src="../../static/img/back_icon.png" class="xiaobaiBack" @tap="backHandler"></image>
			<view class="registrTitle">{{i18n.zlcregister_title1}}</view>
			<view class="tips">
				<view class="tipsTitle">{{i18n.tips_title2}}</view>
				<view class="tipsItem">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.bzzltext_item1}}</text>
				</view>
				<view class="tipsItem">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.bzzltext_item2}}</text>
				</view>
				<view class="tipsItem">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.bzzltext_item3}}</text>
				</view>
				<view class="tipsItem">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.bzzltext_item4}}</text>
				</view>
				<view class="tipsItem">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.bzzltext_item5}}</text>
				</view>
			</view>
			<image :src="i18n.bzzlbuttomimg1" class="btn backups" @tap="backupsHandler"></image>
			<image :src="i18n.bzzlbuttomimg2" class="btn" @tap="backHandler"></image>
		</view>
		
	</view>
</template>

<script>
	export default{
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			backHandler(){
				this.BASE.navigateBack()
			},
			backupsHandler(){
				this.$CommonJS.navigateTo('./backupsWorlds')
			}
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
