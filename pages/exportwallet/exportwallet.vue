<template>
	<view class="content">
		<Header></Header>
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>{{i18n.keyback1}}
		</view>
		<view class="tips">
			<view class="tipsTitle">{{i18n.rulestitle2}}</view>
			<view class="tipsItem">
				<image src="../../static/img/point.png"></image>
				<text>{{i18n.rules_item1}}</text>
			</view>
			<view class="tipsItem">
				<image src="../../static/img/point.png"></image>
				<text>{{i18n.rules_item2}}</text>
			</view>
			<view class="tipsItem">
				<image src="../../static/img/point.png"></image>
				<text>{{i18n.rules_item3}}</text>
			</view>
		</view>
		<view>
			<view class="zhujici_title zhujicipwd">
				<image src="../../static/img/point.png"></image>
				<text>{{i18n.pwdtitle}}</text>
			</view>
			<view class="pwd">
				<input  :type="eye?'text':'password'" class="passworld" :placeholder="i18n.placeholder" placeholder-class="pwd_placeholder" v-model="password" />
				<image :src="eye?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye" class="eyes"></image>
			</view>
		</view>
		<textarea v-if="show" placeholder="" class="zhujici_textarea" placeholder-class="textarea_placeholder" v-model="privateKey"></textarea>
		<view class="copy" v-if="show" @click="copyHandler">{{i18n.copy}}</view>
		<image :src="i18n.keyimg2" class="export" v-else @tap="exportHandler"></image>
	</view>
</template>

<script>
	import Header from '../../components/Header/header.vue'
	import { ethers } from 'ethers';
	import {myMixins} from '../../common/mixins.js'
	import { setClipboardData, getClipboardData } from '../../js_sdk/u-clipboard/index.js'
	export default{
		data(){
			return{
				show: false,
				//showexport:false,
				password:"",
				privateKey:"",
				eye:false
			}
		},
		mixins: [myMixins], 
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		onUnload() {
			this.password = "";
			this.privateKey = "";
		},
		components:{ Header ,setClipboardData, getClipboardData},
		methods:{
			back(){
				this.BASE.navigateBack();
			},
			chageEye(){
				this.eye = !this.eye;
			},
			copyHandler(){
				const _this = this;
				setClipboardData(this.privateKey).then(res =>{
					uni.showToast({
						title: _this._i18n.locale == 'zh_CN' ? '复制成功':'Copied'
					})
				}).catch(err =>{
					_this.$CommonJS.showToast(err)
				})

			},
			exportHandler(){
				const _this = this;
				if(this.password == ""){
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码不能为空':'Password cannot be empty');
					return;
				}else{
					
					uni.showLoading({
						title: _this._i18n.locale == 'zh_CN' ? "正在导出":'Exporting'
					})
					uni.getStorage({
						key: _this.account_info.accountName,
						success:function(res){
							
							console.log(res.data)
							let keystore = res.data;
							//解密
							ethers.Wallet.fromEncryptedJson(keystore, _this.password).then(wallet => {
								console.log(wallet)
								uni.hideLoading();
								_this.show = true;
								_this.privateKey = wallet.privateKey;
								
							}).catch(err =>{
								uni.hideLoading();
								_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码错误':'Password error');
							})
						},
						fail(err) {
							uni.hideLoading();
							_this.$CommonJS.showToast(err)
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	@import url("./exportwallet");
</style>
