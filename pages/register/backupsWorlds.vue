<template>
	<view class="login">
		<view style="height: auto;width: 100%;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
			<image src="../../static/img/back_icon.png" class="xiaobaiBack" @tap="backHandler"></image>
			<view class="registrTitle">{{i18n.bfzlcregister_title}}</view>
			<view class="backupsTitle">{{i18n.bfzltips_title}}</view>
			<view class="tipsAttenios">{{i18n.ps}}</view>
			<view class="worldsBlock">
				<text v-for="(item,index) in mnemonic" :key="index">
					{{item}}
				</text>
			</view>
			<view class="attention">
				<view class="attention_item">
					<image src="../../static/img/camera.png"></image>
					<text>{{i18n.attention_item1}}</text>
					<text>{{i18n.attention_item2}}</text>
				</view>
				<view class="attention_item">
					<image src="../../static/img/msg.png"></image>
					<text>{{i18n.attention_item3}}</text>
					<text>{{i18n.attention_item4}}</text>
				</view>
				<view class="attention_item">
					<image src="../../static/img/transfor.png"></image>
					<text>{{i18n.attention_item5}}</text>
					<text>{{i18n.attention_item6}}</text>
				</view>
				<view class="attention_item allow">
					<image src="../../static/img/writedown.png"></image>
					<text>{{i18n.attention_item7}}</text>
					<text>{{i18n.attention_item8}}</text>
				</view>
			</view>
			<image v-if="isnext" :src="i18n.netbtnimg" class="next_btn" @tap="next"></image>
		</view>
		
	</view>
</template>

<script>
	import { ethers } from 'ethers';
	export default{
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		data(){
			return{
				mnemonic:"",//助记词
				Wallet:"",
				isnext:false
			}
		},
		onLoad() {
			//生成助记词
			uni.showLoading();
			this.getWords();
		},
		methods:{
			backHandler(){
				this.BASE.navigateBack()
			},
			next(){
				const mnemonic = JSON.stringify(this.mnemonic);
				this.BASE.navigateTo('./verificationWorlds?mnemonic=' + mnemonic)
				
			},
			getWords(){
				let wallet = ethers.Wallet.createRandom();
				//console.log(wallet)
				this.mnemonic = wallet.mnemonic.phrase.split(' ');
				if(this.mnemonic.length < 1){
					uni.hideLoading();
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '助记词生成失败':'Mnemonic generation failed');
					return;
				}else{
					uni.hideLoading();
					this.isnext = true;
					this.$store.commit('setWallet',wallet);
				}
			}
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
