<template>
	<view class="content">
		<!-- <Header></Header> -->
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>收款
		</view>
		<view class="assetsBlock">
			<view class="example-body" style="width: 100%">
				<uni-combox :label="coin_name" :candidates="candidates" placeholder="" v-model="coin" @input="getCoin" ></uni-combox>
			</view>
		</view>
		<view class="walletBlock">
			<input class="amountInput" type="number" :placeholder="i18n.Amount"  @input="getAmount"/>
		</view>
		<view class="transferAmount">
			<text>{{i18n.Token}}:{{coin_Name}}</text>
		</view>
		<view class="imgbox">
			<canvas class="canvas" canvas-id="qrcode" style="width: 200px;height: 200px;" />
		</view>
		<view class="bottombutton" @tap="makeQrcodeImg"  v-if="!isSave" :class="changeColor? 'green': ''">
			{{i18n.QR}}
		</view>
		<view class="bottombutton" @tap="saveQrcode" v-if="isSave">
			{{i18n.savePHOTO}}
		</view>
	</view>
</template>

<script>
	import {myMixins} from '../../common/mixins.js'
	import * as oex from 'oex-web3'; 
	import uniCombox from "../../components/uni-combox/uni-combox"
	import uQRCode from '../../common/uqrcode.js'
	export default{
		data(){
			return{
				amount:0,
				isSave:false,
				//币种选择
				candidates: [],
				copyCandidates:[],
				symablList:[],
				coin: '',
				coin_Name:"",
				coin_name:"",//显示的币种名称
				assetName:"",
				//个人账户信息
				accountName:"",
				accountID:"",
				assetinfolist:"",//获取当前主流资产列表
				
				qrcodeSrc:"",
				canvasShow:true,
				changeColor:false,
			}
		},
		mixins: [myMixins], 
		computed: {
			changeData() {
				const { coin_name, amount} = this
				return {
					coin_name,
					amount
				}
			},
			i18n() {
				return this.$t('user')
			}
		},
		watch: {
			changeData: {
				handler: function (newval, oldval) {
					this.coin_name = newval.coin_name;
					this.amount = newval.amount;
					if(this.coin_name != "" && this.amount != ""){
						this.changeColor = true
					}else{
						this.changeColor = false
					}
				},
				deep: true
			}
		},
		components:{ uniCombox },
		onLoad() {
			//	获取当前主流资产列表
			this.coin_name = this._i18n.locale == 'zh_CN' ? "请选择币种":'Please select currency'
			this.getAssetinfolist();
		},
		methods: {
			
			async getAssetinfolist(){
				//	获取当前主流资产列表
				const _this = this;
				uni.request({
					url:this.$API.appServeApi + this.$API.assetinfolist,
					success(res) {
						//console.log(res)
						if(res.data.code == 200){
							
							if(res.data.data.length > 0){
								res.data.data.map(item =>{
									_this.request(item.assetname);
								})
							}
						}else{
							_this.showToast(res.data.message)
						}
					}
				})
			},
			async request(assetname,search){
				const _this = this;
				
				//oex.utils.setApp();
				var data = await  oex.account.getAssetInfoByName(assetname); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
						//console.log(res)
						if(res.data.result){
							const  d = res.data.result;
							const str = d.assetName + '  ' +'(' + d.symbol.toUpperCase() + ')';
							
							_this.candidates = _this.candidates.filter(item =>{
								return item != str
							})
							
							
							_this.symablList.unshift(d)
							_this.candidates.unshift(d.assetName + '  ' +'(' + d.symbol.toUpperCase() + ')');
							_this.copyCandidates.unshift(d.assetName + '  ' +'(' + d.symbol.toUpperCase() + ')');
						}
					
				}).catch(error => {
						console.log(error)
				})
			},
			async getAccountExByName(){
				const _this = this;
				const accountName =  account.getAccount().then(res =>{
					_this.accountName = res.data.result.accountName;
					_this.accountID = res.data.result.accountID;
				}).catch(error =>{
					console.log(error)
				})
			},
			back(){
				//返回
				this.coin_name = "",
				this.coin_Name = "";
				this.amount = "";
				this.$CommonJS.navigateBack()
			},
			getAmount(event){
				//输入收款数量
				this.amount = event.target.value;
				
			},
			async makeQrcodeImg(){
				//制作二维码
			 	let _this = this;
				
				if(this.coin_name == "请选择币种" || this.coin_name == 'Please select currency'){
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? "请选择币种":'Please select currency');
					return;
				}
				if(this.amount == 0 ||this.amount == this.$t('user.Amount')){
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '数量不能为空':'Quantity cannot be empty');
					return;
				}
				
				let str = this.coin_name;
				if(this.coin_name.indexOf('(') == -1){
					 str = this.coin_Name.trim();
				}else{
					str = this.coin_Name.split('(')[0].trim();
				}
				
				oex.utils.setApp();
				var data = await  oex.account.getAssetInfoByName(str); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
					//console.log(res)
					if(!res.data.result){
						_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '无此资产':'There is no such asset');
						return;
					}else{
						//二维码传递数据
						const str = JSON.stringify({
							ToaccountName:this.account_info.accountName,
							ToaccountID:this.account_info.accountID,
							Tocoin_name:this.coin_name,
							Toamount:this.amount
						})
						
						uQRCode.make({
							canvasId: 'qrcode',
							componentInstance: this,
							text: str,
							size: 200,
							margin: 10,
							backgroundColor: '#ffffff',
							foregroundColor: '#000000',
							fileType: 'jpg',
							correctLevel: uQRCode.errorCorrectLevel.H,
							success: res => {
								this.isSave = true;
								this.qrcodeSrc = res;
							}
						})
					}
				}).catch(err =>{
					console.log(err)
				})
				
				
			},
			saveQrcode() {
				//保存二维码
				const _this = this;
				//#ifdef H5
					const a = document.createElement('a')
					a.href = this.qrcodeSrc;
					a.setAttribute('download', 'oexpayment')
					a.click()
				//#endif
			},
			getCoin(e){
				if(this.candidates.length > 0){
					this.candidates.map(item =>{
						if(item.indexOf(e) == -1){
							this.request(e)
						}
					})
				}else{
					this.request(e)
				}
				this.coin_name = e;
				this.coin_Name = e;
			}
		}
	}
</script>

<style scoped>
	@import url("./collection");
</style>
