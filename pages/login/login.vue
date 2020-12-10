<template>
	<view class="login">
		<view class="language"><Language></Language></view>
		<view class="title">{{i18n.logintext}}</view>
		<view class="loginBlock">
			<view class="account" :style="i18n.loginnameback">
				<input type="text" class="input" v-model="accountName" :style="i18n.input"/>
			</view>
			<view class="pwd" :style="i18n.pwdbg">
				<input :type="eye?'text':'password'" class="input" v-model="password" :style="i18n.input"/>
				<image :src="eye?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" class="eye" @tap="chageEye"></image>
			</view>
			<checkbox-group @change="check_xiaobai" class="xiaobai_check">
				<label >
						<checkbox value="1"  color="#FFCC33" style="transform:scale(0.7)" />{{i18n.xiaobai_check}}
				</label>
			</checkbox-group>
		</view>
		<image :src="i18n.login" class="loginBtn" @tap="loginHandler"></image>
		<view class="bottom">
			<view class="addAccount" @tap="registerHandlerLogin">
				<image src="../../static/img/addAccountIcon.png"></image>
				<text>{{i18n.registerlogin}}</text>
			</view>
			<view class="line"></view>
			<view class="addAccount" @tap="importWalletHandler">
				<image src="../../static/img/importWalletIcon.png"></image>
				<text>{{i18n.drqblogin}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { ethers } from 'ethers';
	import * as oex from 'oex-web3'; 
	import Language from '../../components/Language/language.vue'
	export default{
		data(){
			return{
				accountName:"",   //账户名
				password:"",      //密码
				check:[],
				changeColor:false,
				eye:false,
				owner:"",
				isSetNodeInfo:false
			}
		},
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
				if(!this.accountName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户名不能为空':'Account name cannot be empty');
					return;
				}
				if(!this.$CommonJS.accountValidate(this.accountName)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户名不符合规范':'The account name does not conform to the specification');
					return;
				}
				if(!this.password){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码不能为空':'Password cannot be empty');
					return;
				}
				if(!this.$CommonJS.passwordValidate(this.password)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码请输入8-16位数字字母组合':'Please input 8-16 digit alphanumeric combination for password');
					return;
				}
				//读取文件
				uni.showLoading({
					title:_this._i18n.locale == 'zh_CN' ? '登陆中':'Landing',
				})
				//查看是否存在这个账号
				let accountName = this.accountName;
				if(this.check.length >0){
					//小白账户
					accountName = this.$API.xiaobai + this.accountName;
					
				}
							
				var data = await oex.account.getAccountExByName(accountName); //请求参数
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
						console.log(keystore)
						if(keystore == "" || keystore == undefined || keystore == undefined){
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'keystore 丢失': 'keystore lost');
							return;
						}
						ethers.Wallet.fromEncryptedJson(keystore, _this.password).then(function(wallet) {
							 //console.log(wallet)
							 //登录成功
								uni.setStorage({
									key:"account_info",
									data:res.data.result
								})
								//设置登录状态
								uni.setStorage({
									key:"login_status",
									data:true,
									success() {
										uni.hideLoading()
										uni.showToast({
											title:_this._i18n.locale == 'zh_CN' ? '登录成功':'Logged in',
										})
										setTimeout(function(){
											uni.navigateTo({
													url: '../index/index',
													animationType:"slide-in-right",
											});
										},1000)
									}
								})
						
							 
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
	@import url("./login.css");
</style>
