<template>
	<view class="login">
		<view class="language"><Language></Language></view>
		<view class="title">{{i18n.lock}}</view>
		<view class="loginBlock">
			<view class="pwd" :style="i18n.pwdbg">
				<input :type="eye?'text':'password'" class="input" v-model="password" :style="i18n.input"/>
				<image :src="eye?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" class="eye" @tap="chageEye"></image>
			</view>
		</view>
		<image :src="i18n.lockBtn" class="loginBtn" @tap="loginHandler"></image>
		<view class="bottom">
			<view class="addAccount" @tap="importWalletHandler">
				<image src="../../static/img/importWalletIcon.png"></image>
				<text>{{i18n.lockImport}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { ethers } from 'ethers';
	import * as oex from 'oex-web3'; 
	import Language from '../../components/Language/language.vue'
	import {myMixins} from '../../common/mixins.js'
	export default{
		data(){
			return{
				accountName:"zhangxiushan",   //账户名
				password:"123456zxs",      //密码
				check:[],
				changeColor:false,
				eye:false,
				owner:"",
				isSetNodeInfo:false
			}
		},
		mixins: [myMixins], 
		computed: {
			changeData() {
				const { accountName, password} = this
				return {
					accountName,
					password
				}
			},
			i18n() {
				return this.$t('user')
			}
		},
		components:{Language},
		watch: {
			changeData: {
				handler: function (newval, oldval) {
					this.accountName = newval.accountName;
					this.password = newval.password;
					if(this.accountName != "" && this.password != ""){
						this.changeColor = true
					}else{
						this.changeColor = false
					}
				},
				deep: true
			}
		},
		methods:{
			registerHandlerLogin(){
				this.BASE.navigateTo('../register/register')
			},
			importWalletHandler(){
				this.BASE.navigateTo('../importwallet/importWallet')
			},
			chageEye(){
				this.eye = !this.eye;
			},
			check_xiaobai(e){
				this.check = e.detail.value;
			},
			async loginHandler(){
				const _this = this;
				if(!this.password){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码不能为空':'Password cannot be empty');
					return;
				}
				if(!this.$CommonJS.passwordValidate(this.password)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码请输入8-16位数字字母组合':'Please input 8-16 digit alphanumeric combination for password');
					return;
				}
				//读取文件
				uni.showLoading()
				//let accountName = uni.getStorageSync('account_info').accountName;	
				var data = await oex.account.getAccountExByName(this.account_info.accountName); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
					if(res.data.result == null){
						//账户不存在
						uni.hideLoading()
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户不存在':'Account does not exist');
						return;
					}else{
						//验证私钥是否匹配
						_this.owner = res.data.result.authors[0].owner;
						let keystore = uni.getStorageSync(accountName);
						//console.log(keystore)
						if(keystore == "" || keystore == undefined || keystore == undefined){
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'keystore 丢失': 'keystore lost');
							return;
						}
						ethers.Wallet.fromEncryptedJson(keystore, _this.password).then(function(wallet) {
							//#ifdef H5
								_this.$CommonJS.setCookie("lock",1,6)
							//#endif
							uni.navigateTo({
									url: '../index/index',
									animationType:"slide-in-right",
							});
						}).catch (resp => { 
							uni.hideLoading()
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'密码错误': 'Password error');
							return;
						});
					}	
				})
			}
		}
	}
</script>

<style>
	@import url("./lock.css");
</style>
