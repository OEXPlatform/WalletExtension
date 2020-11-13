<template>
	<view class="wallet">
		<view style="height: auto;width: 100%;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
			<view class="walletTitle">
				<image src="../../static/img/back_icon.png" class="backimg" @tap="back"></image>
				<text>{{i18n.drqb}}</text>
			</view>
			<view class="wallet_type" v-if="isForgetPwd">
				<text :class="showZj?'active':''" @tap="chage(1)">{{i18n.zhulici}}</text>
				<text :class="showSy?'active':''" @tap="chage(2)">{{i18n.siyao}}</text>
			</view>
			
			<view class="zhujici" v-if="showZj">
				<view class="zhujici_title">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.drqbzhulici}}</text>
				</view>
				<view class="pwd">
					<input :placeholder="i18n.drqbzhulicitext" placeholder-class="pwd_placeholder" v-model="accountName" />
				</view>
				<textarea :placeholder="i18n.drqbzhulicitext2" class="zhujici_textarea" placeholder-class="textarea_placeholder" v-model="keyWorlds"></textarea>
				<view class="tips">
					<text>*</text>{{i18n.drqbzhulicitext3}}
				</view>
				<view class="zhujici_title zhujicipwd">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.drqbzhulicitext4}}</text>
				</view>
				<view class="pwd">
					<input  :type="eye1?'text':'password'" class="passworld" :placeholder="i18n.drqbzhulicitext5" placeholder-class="pwd_placeholder" v-model="pwdKeyWorlds" />
					<image :src="eye1?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye1" class="eyes"></image>
				</view>
				<view class="pwd">
					<input  :type="eye2?'text':'password'" class="passworld" :placeholder="i18n.drqbzhulicitext6" placeholder-class="pwd_placeholder" v-model="pwdKeyWorlds2" />
					<image :src="eye2?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye2" class="eyes"></image>
				</view>
				<image :src="i18n.drqbzhulicitext7" class="importBtn" @tap="exportZjc"></image>
			</view>
			
			<view class="zhujici" v-else>
				<view class="zhujici_title">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.siyao}}</text>
				</view>
				<view class="pwd">
					<input :placeholder="i18n.drqbzhulicitext" placeholder-class="pwd_placeholder" v-model="accountName" />
				</view>
				<textarea :placeholder="i18n.drqbzhulicitext8" class="zhujici_textarea" placeholder-class="textarea_placeholder" v-model="privateKey"></textarea>
				<view class="tips">
					<text>*</text>{{i18n.drqbzhulicitext9}}
				</view>
				<view class="zhujici_title zhujicipwd">
					<image src="../../static/img/point.png"></image>
					<text>{{i18n.drqbzhulicitext4}}</text>
				</view>
				<view class="pwd">
					<input  :type="eye3?'text':'password'" class="passworld" :placeholder="i18n.drqbzhulicitext5" placeholder-class="pwd_placeholder" v-model="pwdPrivateKey" />
					<image :src="eye3?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye3" class="eyes"></image>
				</view>
				<view class="pwd">
					<input :type="eye4?'text':'password'" class="passworld" :placeholder="i18n.drqbzhulicitext6" placeholder-class="pwd_placeholder" v-model="pwdPrivateKey2" />
					<image :src="eye4?'../../static/img/openeye_green.png':'../../static/img/closeeye_green.png'" @tap="chageEye4" class="eyes"></image>
				</view>
				<image :src="i18n.drqbzhulicitext7" class="importBtn" @tap="inportPrivateKey"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import * as ethers from 'ethers';
	import * as oex from 'oex-web3'; 
	export default {
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		data() {
			return {
				show: false,
				showZj: true,
				showSy: false,
				keyWorlds: "",
				pwdKeyWorlds: "",
				pwdKeyWorlds2: "",
				privateKey: "",
				pwdPrivateKey: "",
				pwdPrivateKey2: "",
				owner: "",
				accountName: "",
				eye1:"",
				eye2:"",
				eye3:"",
				eye4:"",
				isForgetPwd:true
			}
		},
		onLoad(options) {
			if(options.isForgetPwd && options.isForgetPwd == "0"){
				this.isForgetPwd = false;
			}
			
		},
		methods: {
			chageEye1(){
				this.eye1 = !this.eye1;
			},
			chageEye2(){
				this.eye2 = !this.eye2;
			},
			chageEye3(){
				this.eye3 = !this.eye3;
			},
			chageEye4(){
				this.eye4 = !this.eye4;
			},
			chage(n) {
				if (n == 1) {
					//助记词
					this.showZj = true;
					this.showSy = false;
					this.privateKey = "";
					this.pwdPrivateKey = "";
					this.pwdPrivateKey2 = "";
					this.accountName = "";
				} else {
					this.showZj = false;
					this.showSy = true;
					this.keyWorlds = "";
					this.pwdKeyWorlds = "";
					this.pwdKeyWorlds2 = "";
					this.accountName = "";
				}
			},
			async exportZjc() {
				const _this = this;
				this.accountName = this.accountName.trim();
				
				if (this.accountName == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入账户名':'Please enter account name');
					return;
				}
				
				if (this.keyWorlds == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请按要求输入助记词':'Please input mnemonics as required');
					return;
				}
				if (this.keyWorlds.trim().split(' ').length < 12) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '输入的助记词不符合规范':'The input mnemonics do not conform to the standard');
					return;
				}
				if (!this.validateKeyWorlds(this.keyWorlds)) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '输入的助记词不符合规范':'The input mnemonics do not conform to the standard');
					return;
				}
				if (this.pwdKeyWorlds == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入密码':'Please input a password');
					return;
				}
				if (this.pwdKeyWorlds2 == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入确认密码':'Please enter the confirmation password');
					return;
				}
				if (!this.$CommonJS.passwordValidate(this.pwdKeyWorlds)) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码请输入8-16位数字字母组合':'Please input 8-16 digit alphanumeric combination for password');
					return;
				}
				if (this.pwdKeyWorlds !== this.pwdKeyWorlds2) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '两次输入的密码不一致':'The two passwords are not the same');
					return;
				}
				
				var data = await oex.account.getAccountExByName(this.accountName); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
						if(res.data.result == null){
							//账户不存在
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户不存在':'Account does not exist');
							return;
						}else{
							uni.showLoading({
								title:_this._i18n.locale == 'zh_CN' ? '正在导入':'Importing',
							});
							_this.owner = res.data.result.authors[0].owner;
							const mnemonic = this.keyWorlds.trim();
							const bip32path = "m/44'/550'/0'/0/0"
							let wallet = "";
							try{
								wallet = new ethers.Wallet.fromMnemonic(mnemonic, bip32path, null);
								console.log(wallet)
							}catch{
								uni.hideLoading();
								_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '助记词不匹配':'Mnemonic Mismatch')
							}
							
							//加密
							if(wallet){
								wallet.encrypt(_this.pwdKeyWorlds).then(json =>{
									uni.setStorage({
									    key: _this.accountName,
									    data: json,
									    success: function () {
												uni.hideLoading();
												uni.showToast({
													title:_this._i18n.locale == 'zh_CN' ? '钱包导入成功':'Wallet imported successfully',
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
							
						}
				})
				
			},
			async inportPrivateKey() {
				const _this = this;
				this.accountName = this.accountName.trim();
				this.privateKey = this.privateKey.trim();
				if (this.accountName == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入账户名':'Please enter account name');
					return;
				}
				if (this.privateKey == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入私钥':'Please enter Private key');
					return;
				}
				if (this.pwdPrivateKey == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入密码':'Please input a password');
					return;
				}
				if (this.pwdPrivateKey2 == "") {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入确认密码':'Please enter the confirmation password');
					return;
				}
				if (!this.$CommonJS.passwordValidate(this.pwdPrivateKey)) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码请输入8-16位数字字母组合':'Please input 8-16 digit alphanumeric combination for password');
					return;
				}
				if (this.pwdPrivateKey !== this.pwdPrivateKey2) {
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '两次输入的密码不一致':'The two passwords are not the same');
					return;
				}
				var data = await oex.account.getAccountExByName(this.accountName); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
						if(res.data.result == null){
							//账户不存在
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户不存在':'Account does not exist');
							return;
						}else{
							uni.showLoading({
								title: _this._i18n.locale == 'zh_CN' ? '正在导入':'Importing',
							});
							_this.owner = res.data.result.authors[0].owner;
							let wallet = "";
							try {
							  wallet = new ethers.Wallet('0x' + _this.privateKey);
								console.log(wallet)
							}catch (err) {
								console.log(err)
								_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '私钥不匹配':'Private key mismatch')
							}
							if(wallet){
								//加密存储
								wallet.encrypt(_this.pwdPrivateKey).then(json =>{
									uni.setStorage({
									    key: _this.accountName,
									    data: json,
									    success: function () {
												uni.hideLoading();
												uni.showToast({
													title:_this._i18n.locale == 'zh_CN' ? '钱包导入成功':'Wallet imported successfully',
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
						}
				})
						
			
				
			},
			bytes2Str(arr) {
				var str = "";
				for (var i = 0; i < arr.length; i++) {
					var tmp = arr[i].toString(16);
					if (tmp.length == 1) {
						tmp = "0" + tmp;
					}
					str += tmp;
				}
				return str;
			},
			validateKeyWorlds(keyworlds) {
				let flg = true;
				const a = keyworlds.trim().split(' ');
				if (this.CheckArrayElement(a) > 0) {
					flg = false;
				}
				if (!this.validateReg(a)) {
					flg = false;
				}
				return flg;
			},
			back() {
				this.BASE.navigateBack();
			},
			CheckArrayElement(array) {
				array.sort(); //数组排序
				var reNum = 0; //返回结果
				//遍历整个数组对象
				for (var i = 0; i < array.length; i++) {
					//跳过最后一个元素的比较
					if (i + 1 == array.length) {
						continue;
					}
					//判断相邻的元素是否相同
					if (array[i] == array[i + 1]) {
						reNum += 1;
					}
				}
				if (reNum > 0) {
					//console.log("数组有重复项")
				}
				return reNum;
			},
			validateReg(array) {
				let flg = true;
				var reg = new RegExp(/^[a-z]*$/);
				for (let i = 0; i < array.length; i++) {
					if (!reg.test(array[i])) {
						console.log(array[i])
						flg = false;
						break;
					}
				}
				if (!flg) {
					//console.log("正则验证失败")
				}
				return flg;
			}
		}
	}
</script>

<style lang="stylus">
	@import "./wallet.stylus"
</style>
