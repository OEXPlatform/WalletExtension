<template>
	<view class="content" @tap="isEditBlock=false">
		<Header></Header>
		<view class="linkStatus">
			<view class="linkStatusBlock">
				<image src="../../static/img/linkStatusGreen.png"></image>
				<text>{{i18n.linkStatus}}</text>
			</view>
			<view class="accountInfo">
				<text class="accountName">{{shotrAccount}}</text>
				<!-- <text>0xd796…D785</text> -->
			</view>
			<image src="../../static/img/EditIcon.png" class="editIcon" @click.stop="isEditBlockHandler"></image>
			<view class="editBlock" v-if="isEditBlock">
				<!-- <view class="accountInfoBlock" @tap="accountInfoHandler">
					<image src="../../static/img/accountIcon.png"></image>
					<text>账户详情</text>
				</view>
				<view class="accountInfoBlock" @tap="assetsListHandle">
					<image src="../../static/img/service-assets.png"></image>
					<text>我的资产</text>
				</view> -->
				<view class="accountInfoBlock" @tap="scanHandler">
					<image src="../../static/img/scanInconActive.png"></image>
					<text>{{i18n.dcsy}}</text>
				</view>
				<view class="accountInfoBlock" @tap="setNodeInfo">
					<image src="../../static/img/web.png"></image>
					<text>{{i18n.szjd}}</text>
				</view>
				<view class="accountInfoBlock" @tap="logoutHandler">
					<image src="../../static/img/log-out.png"></image>
					<text>{{i18n.logOut}}</text>
				</view>
			</view>
		</view>
		<view class="assetsInfo" v-if="isScroll">
			<image src="../../static/img/assetsIcon.png" class="assetsIcon"></image>
			<text class="assetsName">{{oexBalance}} OEX</text>
			<text class="exchangeRate"></text>
			<view class="operationHandler">
				<text class="buyHandler" :class="buyActive?'operationActive':''" @tap="operationHandler(1)">{{i18n.Collection}}</text>
				<text class="sendHanler" :class="sendActive?'operationActive':''"  @tap="operationHandler(2)">{{i18n.transfer}}</text>
			</view>
		</view>
		<view class="navTab">
			<text :class="tabAssetActive?'active':''" @tap="chageTabHandler(1)">{{i18n.assets}}</text>
			<text :class="tabTransactionActive?'active':''" @tap="chageTabHandler(2)">{{i18n.jiaoyi}}</text>
		</view>
		<!-- <image src="../../static/img/bg1.png" class="bg"></image> -->
		<scroll-view class="assetsBlcok" scroll-y="true" v-if="tabAssetActive" >
			
			<view class="assets" v-if="assetsList.length > 0" v-for="(item,assetsIndex) in assetsList" :key="assetsIndex"
			 @click="assetsDetailHandler(item.assetId,item.balance,item.symbol,item.decimals,item.assetName)">
				<view class="assetsLeft">
					<image src="../../static/img/assetsIcon.png"></image>
					<view class="assetsDetail">
						<text>{{getBalance(item.balance,item.decimals)}} {{toUpperCaseSymbol(item.symbol)}}</text>
					</view>
				</view>
				<image src="../../static/img/rightIcon.png" class="rightIcon"></image>
			</view>
			<text class="noData" v-else >{{i18n.wzc}}</text>
			<!-- <view class="addCoin">添加代币</view> -->
		</scroll-view>
		<view class="transactionBlock" v-else :style="scrollHeight">
			<image src="../../static/img/bg1.png" class="bg"></image>
			<view class="nodataBlock" >
				
				<scroll-view class="transactionList" scroll-y="true" v-if="dataList.length  >0"
				@scroll="scroll"
				@scrolltolower="scrolltolower"
				 @scrolltoupper="scrolltoupper">
					<view class="detailItem" v-for="(item,index) in dataList" :key="index" @click="transactionDetail(item.actionhash)">
						<view class="left">
							<view class="leftTop">
								<text class="outTitle" :class="{'mining':item.actiondata.type == 774,'vote':item.actiondata.type == 772,'red':item.txto != accountName && item.actiondata.type != 772 && item.actiondata.type != 774, 'green':item.txto == accountName && item.actiondata.type != 772 && item.actiondata.type != 774}">{{getType(item)}}</text>
								<image :src="getImg(item)"  class="out"></image>
								<text class="account">{{getAccount(item)}}</text>
							</view>
							<view class="leftBottom">{{getTime(item.transactiontime)}}</view>
						</view>
						<view class="right">
							<text class="rightTop" :class="{'mining':item.actiondata.type == 774,'vote':item.actiondata.type == 772,'red':item.txto != accountName && item.actiondata.type != 772 && item.actiondata.type != 774, 'green':item.txto == accountName && item.actiondata.type != 772 && item.actiondata.type != 774}">{{getAmout(item)}}</text>
							<text class="rightBottom">{{getState(item)}}</text>
						</view>
					</view>
				</scroll-view>
				<text class="noData" v-else >{{i18n.nodata}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Header from '../../components/Header/header.vue'
	
	import {myMixins} from '../../common/mixins.js' 
	const util = require('../../common/util.js'); 
	import account from '../../common/account.js'
	export default {
		data() {
			return {
				accountName:"",
				tabAssetActive:true,
				tabTransactionActive:false,
				buyActive:true,
				sendActive:false,
				isScroll:true,
				scrollHeight:'height: 280rpx;',
				isEditBlock:false,
				dataList:[],
				assetsList:[],
				pageIndex:1, //当前第几页
				pageSize:10, //页大小
				isData:false,
				oexAssets:"",
				oexAssetID:"",
				oexBalance:0,
				oexSymbol:"",
			}
		},
		mixins: [myMixins],
		components:{ Header },
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		
		onLoad() {
			this.accountName = this.account_info.accountName;
			this.getTransactionList();
			this.getAssets();
			const _this = this;
			
			
			chrome.storage.sync.get(['traInfo'], function(result) {
				//console.log(result)
				var res = JSON.stringify(result['traInfo']) ;
				
				if(res){
					_this.$CommonJS.navigateTo('../transferAccounts/transferAccounts?traInfo=' + res)
				}
			});

			// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
			// {
			// 	_this.$CommonJS.navigateTo('../transferAccounts/transferAccounts')
			// });
		},
		methods: {
			getAssets(){
				//加载资产
				uni.showLoading()
				const _this = this;
				account.getAccount(this.account_info.accountName).then(res =>{
					const balances = res.data.result.balances;
				
					if(balances.length > 0){
						_this.oexAssets = balances.filter(assets =>{
							return assets.assetID == 0
						})
						
						balances.map(item =>{
							_this.getOexAssetsDetail(item.assetID,item.balance);
						})
						if(_this.oexAssets.length > 0){
							_this.getOexAssetsDetail(_this.oexAssets[0].assetID,_this.oexAssets[0].balance,"oex");
							
						}else{
							_this.oexBalance = 0;
						}
					}else{
							return
					}
					
					
				}).catch(error =>{
					//_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请求超时':'Request Timeout',)
					console.log(error)
				})
			},
			getOexAssetsDetail(assetID,balance,type){
				//加载oex资产详情
				const _this = this;
				account.getCoin(assetID).then(result =>{
					const res = result.data.result;
					//console.log(res)
					if(type == "oex"){
						_this.oexAssetID = assetID;
						_this.oexSymbol = res.symbol.toUpperCase();
						_this.oexBalance = account.getAmount(balance,res.decimals);
					}else{
						res.balance = balance;
						_this.assetsList.push(res)
						uni.hideLoading()
					}
				})
			},
			assetsListHandle(){
				//资产列表
				this.$CommonJS.navigateTo('../assetsList/assetsList')
			},
			assetsDetailHandler(assetID,balance,symbol,decimals,assetName){
				//资产详情
				balance = account.getAmount(balance,decimals)
				this.$CommonJS.navigateTo('../assetsDetail/assetsDetail?assetID=' + assetID + '&balance=' + balance + '&symbol=' + symbol + '&assetName=' + assetName)
			},
			setNodeInfo(){
				//设置节点
				this.isEditBlock = !this.isEditBlock;
				this.BASE.navigateTo('../setNodeInfo/setNodeInfo')
			},
			deleteNodeInfo(index){
				//删除节点
				let nodeList = this.nodeInfoList.filter((item,Index) =>{
					return Index !== index
					
				})
				const arr =  nodeList.filter(item =>{
					return item.active == true;
				})
				if(arr.length < 1){
					const nodeInfoData = {
						name:  _this._i18n.locale == 'zh_CN' ? 'OEXChain主网':'OEXChain mainnet',
						url: 'http://mainnet.oexchain.com',
						active:true
					}
					nodeList.splice(0,1)
					nodeList.unshift(nodeInfoData)
					uni.setStorageSync('nodeInfoList',nodeList)
				}else{
					uni.setStorageSync('nodeInfoList',nodeList)
				}
				
			},
			getAmount(amount){
				return Number(amount).toFixed(2);
			},
			getBalance(balance,decimals){
				return account.getAmount(balance,decimals);
			},
			toUpperCaseSymbol(symbol){
				//console.log(symbol)
				return symbol.toUpperCase()
			},
			initAccountName(accountName){
				//
				let name = "";
				if(accountName.includes('.')){
					const prefix = accountName.split('.')[0];
					const suffix = accountName.split('.')[1];
					name =	prefix.substr(0, 3) + '**' + prefix.substring(14, 16) + '.' +	suffix.substr(0, 3) + '**' + suffix.substring(-1, -2)
					
				}else{
					name = accountName.substr(0, 3) + '**' + accountName.substring(-1, -2)
				}
				return name;
			},
			getTransactionList(){
				//初始化交易列表
				const _this = this;
				this.requestList().then(res=>{
					//console.log(res)
					if(res.list.length < 1){
						_this.isData = true;
						return;
					}
					_this.dataList = res.list;
				}).catch(error =>{
					console.log(error)
				})
			},
			requestList() {
				 //请求封装
				const _this = this;
				return new Promise((resolute, reject)=>{
					//延时一秒,模拟联网
					setTimeout(function() {
						try {
							var list = [];
							 uni.request({
									url:_this.$API.appServeApi + _this.$API.gettransactionforme,
									data:{
										account:_this.account_info.accountName,
										pageIndex:_this.pageIndex,
										pageSize:_this.pageSize
									},
									success(res) {
										//console.log(res)
										if(res.data.code == 200 && res.data.data.list.length >0){
											res.data.data.list.map(item =>{
												item.actiondata = JSON.parse(item.actiondata)
											})
											list = res.data.data;
											_this.pageIndex ++;
											resolute(list);
										}else{
											list = res.data.data;
											resolute(list);
										}
									},
									fail(error) {
										console.log(error)
									}
								})
						} catch (e) {
							reject(e);
						}
					}, 1000)
				})
			},
			chageTabHandler(n){
				//切换资产和交易
				if(n == 1){
					this.tabAssetActive = true;
					this.tabTransactionActive = false;
					this.isScroll = true;
					this.scrollHeight = 'height: 280rpx;'
				}else{
					this.tabAssetActive = false;
					this.tabTransactionActive = true;
				}
			},
			operationHandler(n){
				//买入发送
				if(n == 1){
					//买入
					this.buyActive = true;
					this.sendActive = false;
					//具体操作
					this.$CommonJS.navigateTo('../collection/collection')
				}else{
					//转出
					this.buyActive = false;
					this.sendActive = true;
					//具体操作
					this.$CommonJS.navigateTo('../transferAccounts/transferAccounts')
				}
			},
			scrolltolower:util.throttle(function(e) {
				const _this = this;
				this.requestList().then(list =>{
					list.list.map(item =>{
						 _this.dataList.push(item)
					})
				});
			}, 300),
			scrolltoupper(){
			},
			scroll(event){
				//交易滚动
				if(event.detail.scrollTop > 130){
						this.isScroll = false;
						this.scrollHeight = 'height: 880rpx;'
				}else if( event.detail.scrollTop = 0 ||  event.detail.scrollTop < 4){
						this.isScroll = true;
						this.scrollHeight = 'height: 280rpx;'
				}
			},
			isEditBlockHandler(){
				this.isEditBlock = !this.isEditBlock;
			},
			accountInfoHandler(){
				//账户详情
				this.isEditBlock = !this.isEditBlock;
			},
			scanHandler(){
				//导出私钥
				this.isEditBlock = !this.isEditBlock;
				this.BASE.navigateTo('../exportwallet/exportwallet')
			},
			logoutHandler(){
				//退出登录
				const _this = this;
				uni.showLoading();
				uni.removeStorage({
				    key: 'account_info',
				    success: function (res) {
				        uni.setStorage({
				        	key:'login_status',
									data:false,
									success() {
										uni.hideLoading();
										uni.showToast({
											title:_this._i18n.locale == 'zh_CN' ? '已退出':'Exited',
											success() {
												_this.$CommonJS.navigateTo('../login/login')
											}
										})
									}
				        })
				    }
				});
			}
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
