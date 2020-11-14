<template>
	<view class="content" @click="showAssetsList=false">
		<!-- <Header></Header> -->
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>转账
		</view>
		<view class="assetsBlock" @click.stop="showAssetsList=!showAssetsList">
			<image src="../../static/img/Bitcoin.png" class="bitcoin"></image>
			<text class="symol" >{{symbol}}</text>
			<image src="../../static/img/dowIcon.png" class="downIcon"></image>
			<view class="assetsList" v-if="showAssetsList">
				<view v-if="symbolList.length >0" @tap="clickItem(item)" v-for="(item,index) in symbolList" :key="index">{{getAuthor(item.assetName)}} ({{item.symbol}})</view>
				<text v-else>{{i18n.wzc}}</text>
			</view>
		</view>
		<view class="accountBlock">
			<text class="accountTitle">收款账户： </text>
			<input type="text" class="accountInput" v-model="toAccountName"/>
		</view>
		<view class="walletBlock">
			<text>钱包账户余额</text>
			<text>{{currentAmount}}</text>
		</view>
		<view class="transferAmount">
			<text>{{symbol}}</text>
			<input class="amountInput" placeholder="请输入您要划转的数量" v-model="amount"/>
		</view>
		<textarea class="remark" placeholder="收款账户：（选填） " v-model="remark"></textarea>
		<image src="../../static/img/transfer.png" class="transferIcon" @tap="recharge"></image>
		<password v-if="show" :gasPrice="100" :gasLimit="1000000" @close="close" @callback="callback" :yzpassword="i18n.yzpassword" :btnl="i18n.btn1" :btnr="i18n.btn2" :placeholder="i18n.placeholder" :passprice="i18n.passprice" :pwdtitle="i18n.pwdtitle" :cap="i18n.cap"></password>
	</view>
</template>

<script>
	import Header from '../../components/Header/header.vue'
	import {myMixins} from '../../common/mixins.js'
	import account from '../../common/account.js'
	import * as oex from 'oex-web3'; 
	import payment from '../../common/payment.js'
	import password from '../../components/password/password.vue'
	export default{
		data(){
			return{
				showAssetsList:false,
				//币种选择
				toAccountName:"",  //转出账户
				amount:"", //转出数量
				remark:"",   //转出备注
				show: false, //支付密码
				password:"", //支付密码
				symbolList:[], //当前账户所持有的币种列表
				balances:[] ,//当前账户资产
				assetIdList:[],
				currentAmount:"",
				assetId: "",
				decimals: "",
				assetName:"",
				symbol:"选择币种"
			}
		},
		mixins: [myMixins], 
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		components:{ Header,password},
		onLoad() {
			this.getCurrentAccountInfo();//加载当前账户资产
		},
		methods:{
			back(){
				this.symbol = "";
				this.toAccountName = "";
				this.amount = "";
				this.remark = "";
				this.$CommonJS.navigateBack()
			},
			getAuthor(author){
				if(author.indexOf('.')!=-1){
					return 'oexch**' + '.' + author.split('.')[1];
				}else{
					return author
				}
			},
			showAssetsListHandler(){
				this.showAssetsList = !this.showAssetsList;
			},
			clickItem(item){
				//console.log(item)
				this.symbol =item.symbol;
				this.assetName =item.assetName;
				this.assetId = item.assetId;
				this.decimals = item.decimals;
				this.currentAmount  = item.balance/Math.pow(10,item.decimals);
				this.isList = false;
			},
			async getCurrentAccountInfo(){
				//加载当前账户信息
				 let _this = this;
				const nodeInfo = uni.getStorageSync('nodeInfo');
				 oex.utils.setApp();
				 const data = await oex.account.getAccountExByName(this.account_info.accountName); //请求参数
				 this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
				 		//console.log(res)
				 		this.balances = res.data.result.balances;
						if(res.data.result.balances.length > 0){
							//根据资产id获取资产详情
								_this.getInfoByAssetsID(res.data.result.balances);
						}else{
								_this.symbolList.push(_this._i18n.locale == 'zh_CN' ? '当前账户暂无资产':'There are no assets in the current account')
						}
				 }).catch(error => {
				 		console.log(error)
				 })
			},
			getInfoByAssetsID(data){
			//根据资产id获取资产详情
				if(data.length<1){
					uni.hideLoading()
					return;
				}
				const _this = this;
				data.map(item =>{
					account.getCoin(item.assetID).then(result =>{
						//console.log(result)
						const obj = {
							assetID:result.data.result.assetId,
							symbol:result.data.result.symbol,
							balance:item.balance,
							decimals:result.data.result.decimals,
							assetName:result.data.result.assetName
						}
						_this.assetIdList.push(obj);
						const asset = {
							assetName:result.data.result.assetName,
							symbol:result.data.result.symbol.toUpperCase(),
							assetId:result.data.result.assetId,
							balance:item.balance,
							decimals:result.data.result.decimals,
						}
						_this.symbolList.push(asset);
						uni.hideLoading()
					})
				})
			},
			async recharge(){
				const _this = this;
				//转账
				if(this.symbolList.length < 1){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '当前账户暂无资产,不能转账':'There is no asset in the current account, no transfer is allowed');
					return;
				}
				if(!this.assetName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请选择币种':'Please select currency');
					return;
				}
				if(!this.toAccountName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入收款账户':'Please input the collection account');
					return;
				}
				if(this.account_info.accountName == this.toAccountName){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '非法操作,不能转账当前账户':'Please input the illegal operation of the collection account. The current account cannot be transferred');
					return;
				}
				if(!this.amount || this.amount == 0){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请输入转账数量':'Please input the transfer quantity');
					return;
				}
				if(this.amount > Number(this.currentAmount)){
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户余额不足':'Insufficient account balance');
					return;
				}
				this.toAccountName = this.toAccountName.trim();
				//验证转出的账户是否存在
				oex.utils.setApp();
				var data = await oex.account.getAccountExByName(this.toAccountName); //请求参数
				const nodeInfo = uni.getStorageSync('nodeInfo');
				this.$CommonJS.request(nodeInfo,"POST",data).then( res => {
						//console.log(res)
						if(res.data.result == null){
							_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '账户不存在':'Account does not exist')
							return;
						}
						//
						_this.show = true;
				}).catch(error => {
						console.log(error)
				})
			},
			close(){
				//关闭支付框
				this.show = false
			},
			callback(privateKey,gasPrice,gasLimit){
				const _this=this
				//console.log(privateKey,gasPrice,gasLimit);
				this.show = false
				//支付参数(currentAccountName,toAccountName,assetId,amount,decimals,privateKey,gasPrice,gasLimit)
				payment.payment(this.account_info.accountName,this.toAccountName,this.assetId,this.amount,this.remark,this.decimals,privateKey,gasPrice,gasLimit).then(paymentInfo =>{
					console.log(paymentInfo)
					if(paymentInfo){
						uni.showToast({
							title:_this._i18n.locale == 'zh_CN' ? '转账成功':'Transfer successful'
						})
					}
				}).catch(err =>{
					console.log(err)
				})
			}
		}
	}
</script>

<style scoped>
	@import url("./transferAccounts");
</style>
