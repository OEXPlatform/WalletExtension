<template>
	<view class="login">
		<image src="../../static/img/back_icon.png" class="xiaobaiBack" @tap="backHandler"></image>
		<view class="registrTitle">{{i18n.register_title}}</view>
		<view class="block" :style="i18n.block">
			<input type="tell" :style="i18n.textAlign" :placeholder="i18n.input_placeholder1" class="tell" placeholder-class="placeholder" v-model="phone"/>
		</view>
		<view class="codeBlock">
			<view class="code" :style="i18n.code">
				<input type="text" :style="i18n.textAlign" :placeholder="i18n.input_placeholder2" class="codeInput" placeholder-class="placeholder" v-model="vcode"/>
			</view>
			<view class="sendCode"  @tap="send_vcode" v-if="sendVode">{{i18n.send_vcode}}</view>
			<text class="sendCode" v-else>{{vtext}}</text>
		</view>
		<view class="account" :style="i18n.account">
			<input type="text" :style="i18n.textAlign" class="accountInput" placeholder-class="placeholder" v-model="accountName" :placeholder="i18n.xiaobaibg3placeholder"/>
			<image src="../../static/img/proIcon.png" class="proIcon"></image>
		</view>
		<view class="actualAccount">{{i18n.sjzhm}}：oexchainofficial.{{accountName}}</view>
		<view class="pwd" :style="i18n.pwd">
			<input :type="eye?'text':'password'" :style="i18n.textAlign" :placeholder="i18n.xiaobaibg4placeholder" class="pwdInput" placeholder-class="placeholder" v-model="password"/>
			<image :src="eye?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye(1)" class="eye"></image>
		</view>
		<view class="pwd2" :style="i18n.pwd2">
			<input :type="eye2?'text':'password'" :style="i18n.textAlign" :placeholder="i18n.xiaobaibg5placeholder" class="pwdInput2" placeholder-class="placeholder" v-model="password2"/>
			<image :src="eye2?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" class="eye" @tap="chageEye(2)"></image>
		</view>
		<view class="agree" @tap="agree_ruls">
			<image :src="agree?'../../static/img/agreeGreen.png':'../../static/img/agree.png'"></image>
			<view class="agreeBox">
				<text class="agreeText">{{i18n.agreement_text1}}</text>
				<text class="agreeUser">{{i18n.agreement_text2}}</text>
			</view>
			
		</view>
		<view class="registerBtn" :class="{'changeColor':changeColor}" @tap="registerHandler">{{i18n.Register}}</view>
		<view class="registrLogin" @tap="loginHandler">{{i18n.zjdl}}?</view>
	</view>
</template>

<script>
	import { ethers } from 'ethers';
	export default{
		data(){
			return{
				agree:false, //init agree
				phone:"19801380721",
				vcode:"1234",
				accountName:"oexchini",
				password:"123456zxs",
				password2:"123456zxs",
				sendVode:true,
				vtext:'发送验证码',
				Wallet:"",//钱包
							
				publicKey:"",
				changeColor:false,
				eye:false,
				eye2:false,
				type1:"password"
			}
		},
		computed: {
			changeData() {
				const {phone,vcode,accountName, password,password2,agree} = this
				return {
					phone,vcode,accountName,password,password2,agree
				}
			},
			i18n() {
				return this.$t('user')
			}
		},
		watch: {
			changeData: {
				handler: function (newval, oldval) {
					this.phone = newval.phone;
					this.vcode = newval.vcode;
					this.accountName = newval.accountName;
					this.password = newval.password;
					this.password2 = newval.password2;
					this.agree = newval.agree;
					this.fathercode = newval.fathercode;
					if(this.phone != "" && this.vcode != "" && this.accountName != "" && this.password != "" && this.password2 != "" && this.agree && this.fathercode !=""){
						this.changeColor = true
					}else{
						this.changeColor = false
					}
				},
				deep: true
			}
		},
		methods:{
			loginHandler(){
				this.BASE.navigateTo('../login/login')
			},
			backHandler(){
				this.BASE.navigateBack()
			},
			agree_ruls(){
				//同意协议
				this.agree = !this.agree;
			},
			send_vcode(){
				//发送验证码
				const _this = this;
				if(!this.phone){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入手机号':'Please enter your mobile phone number');
					return;
				}
				if(!this.$CommonJS.PhoneValidate(this.phone)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '手机号不正确':'Incorrect mobile phone number');
					return;
				}
			
				
				_this.getTime();
				const url = this.$API.appServeApi + this.$API.phoneValidate + "?mobile=" + this.phone+"&rtype=0";
				this.$CommonJS.request(url,"POST").then(res => {
					//console.log(res)
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '验证码已发送':'Verification code sent')
				}).catch(error => {
					_this.$CommonJS.showToast(error. message)
				})
			},
			getTime(){
				//倒计时
				var _this = this;
				
				var num = 60;
			  var timer =	 setInterval(function(){
					if(num <= 0){
						clearInterval(timer);
						_this.vtext = "";
						_this.sendVode = true;
						return;
					}
					
					_this.vtext = (_this._i18n.locale == 'zh_CN' ?'重新发送' + num + 's' :'Resend' + num + 's');
					
					num --;
				},1000)
					_this.sendVode = !_this.sendVode;
			},
			async registerHandler(){
				//注册
				const _this = this;
				if(!this.phone){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入手机号':'Please enter the verification code');
					return;
				}
				
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '手机号码有误，请重填':'Wrong mobile number, please fill in again');
					return; 
				} 
				
				
				if(!this.vcode){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入验证码':'Please enter the verification code');
					return;
				}
				if(!this.accountName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入子账户名':'Please enter sub account name');
					return;
				}
				if(!this.$CommonJS.accountValidate(this.accountName,0)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账号名请输入3-16数字字母组合':'Please input 3-16 letters for account number');
					return;
				}
				if(!this.password){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入密码':'Please input a password');
					return;
				}
				
				if(!this.$CommonJS.passwordValidate(this.password)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码请输入8-16位数字字母组合':'Please input 8-16 digit alphanumeric combination for password');
					return;
				}
				if(!this.password2){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入确认密码':'Please enter the confirmation password');
					return;
				}
				if(this.password !== this.password2){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '两次输入的密码不一致':'The two passwords are not the same');
					return;
				}
				if(!this.agree){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '未同意用户协议':'User agreement not agreed');
					return;
				}
				if(this.fathercode == ""){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '邀请码不能为空':'Invitation code cannot be empty');
					return;
				}
				
				uni.showLoading({
					// title:"正在注册"
					title:_this._i18n.locale == 'zh_CN' ? '正在注册':'Registering',
				})
				let wallet = ethers.Wallet.createRandom();
				//console.log(wallet)
				//const privateKey = wallet.privateKey;
				this.publicKey = wallet.publicKey;
				//const publicKey = ethers.utils.computePublicKey(privateKey,false);
				let keystore = ""
				await wallet.encrypt(this.password).then(json =>{
					keystore = json;
				}).catch(err =>{
					_this.$CommonJS.showToast(err);
					return;
				})
				//请求接口，传参子账号注册信息
				const url = this.$API.appServeApi + this.$API.registerXiaoBai;
				const data = {
								account : this.accountName,
								mobile:this.phone,
								valcode:this.vcode,
								publickey:this.publicKey,
								isfather:0,
							}
				uni.request({
					url:url,
					method:"POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data:data,
					success(res) {
						//console.log(res)
						if(res.data.code == 200){
								uni.setStorage({
								    key: 'oexchainofficial.' + _this.accountName,
								    data: keystore,
								    success: function () {
											uni.hideLoading();
											uni.showToast({
												// title:"注册成功",
												title:_this._i18n.locale == 'zh_CN' ? '注册成功':'login was successful',
											})
											setTimeout(()=>{
												_this.$CommonJS.navigateTo('../login/login')
											},2000)
								    }
								});
							
						}else{
							uni.hideLoading();
							_this.$CommonJS.showToast(res.data.message);
						}
					},fail(error) {
						uni.hideLoading();
						//console.log(error)
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '注册请求失败':'Registration request failed')
					}
				})
			},
			chageEye(n){
				if(n == 1){
					this.eye = !this.eye;
				}else{
					this.eye2 = !this.eye2;
				}
				
			},
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
