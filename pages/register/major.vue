<template>
	<view class="login">
		<image src="../../static/img/back_icon.png" class="xiaobaiBack" @tap="backHandler"></image>
		<view class="registrTitle">{{i18n.zyyhtitle}}</view>
		<view class="block" :style="i18n.block">
			<input type="email" :style="i18n.textAlign" v-model="email" :placeholder="i18n.zyyhpl1" class="tell" placeholder-class="placeholder"/>
		</view>
		<view class="account" :style="i18n.account">
			<input type="text" :style="i18n.textAlign" v-model="accountName" :placeholder="i18n.zyyhpl2" class="accountInput" placeholder-class="placeholder"/>
			<image src="../../static/img/proIcon.png" class="proIcon"></image>
		</view>
		<view class="pwd" :style="i18n.pwd">
			<input :type="eye?'text':'password'" :style="i18n.textAlign" v-model="password" :placeholder="i18n.zyyhpl3" class="pwdInput" placeholder-class="placeholder"/>
			<image :src="eye?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" class="eye" @tap="chageEye(1)"></image>
		</view>
		<view class="pwd2" :style="i18n.pwd2">
			<input :type="eye2?'text':'password'" :style="i18n.textAlign" v-model="password2" :placeholder="i18n.zyyhpl4" class="pwdInput2" placeholder-class="placeholder"/>
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
	export default{
		data(){
			return{
				email:"",
				accountName:"",
				password:"",
				password2:"",
				agree:false,
				Wallet:"",
				changeColor:false,
				eye:false,
				eye2:false
			}
		},
		computed: {
			changeData() {
				const {email,accountName, password,password2,agree} = this
				return {
					email,accountName,password,password2,agree
				}
			},
			i18n() {
				return this.$t('user')
			}
		},
		watch: {
			changeData: {
				handler: function (newval, oldval) {
					this.email = newval.email;
					this.accountName = newval.accountName;
					this.password = newval.password;
					this.password2 = newval.password2;
					this.agree = newval.agree;
					if(this.email != ""  && this.accountName != "" && this.password != "" && this.password2 != "" && this.agree){
						this.changeColor = true
					}else{
						this.changeColor = false
					}
				},
				deep: true
			}
		},
		onLoad() {
			this.Wallet = this.$store.getters.getWallet;
			console.log(this.Wallet)
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
			chageEye(n){
				if(n == 1){
					this.eye = !this.eye;
				}else{
					this.eye2 = !this.eye2;
				}
				
			},
			registerHandler(){
				//注册
				const _this = this;
				if(this.email == ""){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '邮箱不能为空':'The mailbox cannot be empty');
					return;
				}
				var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
				if(!reg.test(this.email)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '邮箱格式不正确':'The mailbox format is incorrect');
					return; 
				} 
				
				if(!this.accountName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输账户名':'Please input account name');
					return;
				}
				
				if(!this.$CommonJS.accountValidate(this.accountName,1)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '字母开头，12到16位数字字母组合':'Letter start, 12 to 16 digit alphanumeric combination');
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
				
				//请求接口，传参子账号注册信息
				
				uni.showLoading({
					title:_this._i18n.locale == 'zh_CN' ? '正在注册':'Registering',
				})
				const url = this.$API.appServeApi + this.$API.registerXiaoBai;
				const data = {
					account : this.accountName,
					mobile:this.email,
					publickey:this.Wallet.publicKey,
					isfather:1
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
							_this.Wallet.encrypt(_this.password).then(json =>{
								uni.setStorage({
								    key: _this.accountName,
								    data: json,
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
							}).catch(err =>{
								_this.$CommonJS.showToast(err);
								return;
							})
						}
					},fail(error) {
						uni.hideLoading();
						//console.log(error)
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '注册请求失败':'Registration request failed')
					}
				})
			}
			
			
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
