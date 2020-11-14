<template>
	<view class="pwd_content">
		<view class="pwd_center">
			<view class="pwd_title" style="border-bottom: none;">{{pwdtitle}}</view>
			<view class="enter_input" style="border-bottom: none;">
				<view class="" style="background: #202039;width: 100%;border-radius: 16upx;">
					<label class="input_box" style="border-bottom-right-radius: 0upx;border-bottom-left-radius: 0upx;">
						<text style="border-right: 1px solid #8687A3;padding-right: 20upx;">Gas {{passprice}}</text>
						<input type="number" v-model="GasPrice" />
						<text class="dw">GWei</text>
					</label>
					<view class="hx"></view>
					<label class="input_box" style="">
						<text style="border-right: 1px solid #8687A3;padding-right: 20upx;">Gas {{cap}}</text>
						<input type="number" v-model="GasLimit" />
						<text class="dw">OEX</text>
					</label>
				</view>
				
				<label class="input_box" style="margin: 20upx 0;">
					<text>≈</text>
					<input type="number" style="width: 80%;" v-model="colculateOEX" disabled="disabled"/>
					<text class="dw">OEX</text>
				</label>
				<view class="yzpassword">
					{{yzpassword}}
				</view>
				<label class="input_box" style="justify-content: flex-start;margin-bottom: 20upx;">
					<input type="password" style="margin-left:0;width: 100%;font-size: 12px;text-align: left;" v-model="password" :placeholder="placeholder"
					 placeholder-class="enter_placeholder"/>
				</label>

			</view>
			<view class="btns">
				<image :src="btnl" mode="" @tap="cancel"></image>
				<image :src="btnr" mode="" @tap="confirm"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ethers
	} from 'ethers';
	// import AES from '../../common/secret.js'
	// import Files from '../../common/files.js'
	// import CryptoJS from 'crypto-js';
	export default {
		
		name: "password",
		props: {
			gasPrice: {
				type: Number,
				default: 100,
				
			},
			gasLimit: {
				type: Number,
				default: 1000000
			},
			yzpassword:"",
			placeholder:"",
			pwdtitle:"",
			btnl:"",
			btnr:"",
			passprice:"",
			cap:""
		},
		data() {
			return {
				password: "",
				accountName: "",
				account_info: "",
				GasPrice: this.gasPrice,
				GasLimit: this.gasLimit,
				colculateOEX: ''
			}
		},
		computed: {
			changeData() {
				const { GasPrice, GasLimit} = this
				return {
					GasPrice,
					GasLimit
				}
			}
		},
		watch: {
			changeData: {
				handler: function (newval, oldval) {
					this.colculateOEX = this.$CommonJS.toNonExponential( (this.GasPrice  * this.GasLimit)/Math.pow(10,9))
				},
				deep: true
			}
		},
		mounted() {
			this.account_info = uni.getStorageSync("account_info");
		},
		created() {
			this.colculateOEX = this.$CommonJS.toNonExponential( (this.GasPrice * this.GasLimit)/Math.pow(10,9))
		},
		methods: {
			cancel(e) {
				//取消密码
				
				this.password = ""
				this.$emit('close')
			},
			confirm(e) {
				//确认密码
				const _this = this;
				if (!this.password) {
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码不能为空':'Password cannot be empty');
					return;
				} else {
					uni.showLoading();
					//解密
					let keystore = uni.getStorageSync(this.account_info.accountName);
					ethers.Wallet.fromEncryptedJson(keystore, _this.password).then(wallet => {
						console.log(wallet)
						uni.hideLoading();
						_this.show = true;
						_this.privateKey = wallet.privateKey;
						
						//const privateKey = decryptedData.privateKey;
						const GasPrice = Number(_this.GasPrice) * Number(1e9);
						const GasLimit = Number(_this.GasLimit);
						_this.$emit('callback', wallet.privateKey, GasPrice, GasLimit)
						
					}).catch(err =>{
						uni.hideLoading();
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '密码错误':'Password error');
					})
					return;
					//读取文件
					Files.getFileData(_this.account_info.accountName).then(txt => {
						//解密
						console.log(txt)
						var bytes = CryptoJS.AES.decrypt(txt, _this.password);
						console.log(bytes)
						
						const arr = bytes.words.filter(item =>{
							return Number(item) < 0
						})
						
						if(arr.length >= 1){
							uni.hideLoading()
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'密码错误': 'Password error');
							_this.password = '';
							return;
						}else{
							var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
							const privateKey = decryptedData.privateKey;
							const GasPrice = Number(_this.GasPrice) * Number(1e9);
							const GasLimit = Number(_this.GasLimit);
							_this.$emit('callback', privateKey, GasPrice, GasLimit)
							uni.hideLoading()
						}
					}).catch(err => {
						console.log(err)
						uni.hideLoading()
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'找不到 keyStore':'KeyStore Lose')
					})

				}

			}
		},
	}
</script>

<style lang="stylus">
	@import "./password.stylus"
</style>
