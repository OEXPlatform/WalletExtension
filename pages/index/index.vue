<template>
	<view class="content">
		<Header></Header>
		<view class="linkStatus">
			<view class="linkStatusBlock">
				<image src="../../static/img/linkStatus.png"></image>
				<text>未连接</text>
			</view>
			<view class="accountInfo">
				<text class="accountName">{{shotrAccount}}</text>
				<!-- <text>0xd796…D785</text> -->
			</view>
			<image src="../../static/img/EditIcon.png" class="editIcon" @tap="isEditBlockHandler"></image>
			<view class="editBlock" v-if="isEditBlock">
				<view class="accountInfoBlock" @tap="accountInfoHandler">
					<image src="../../static/img/accountIcon.png"></image>
					<text>账户详情</text>
				</view>
				<view class="accountInfoBlock" @tap="assetsListHandle">
					<image src="../../static/img/service-assets.png"></image>
					<text>我的资产</text>
				</view>
				<view class="accountInfoBlock" @tap="scanHandler">
					<image src="../../static/img/scanInconActive.png"></image>
					<text>导出私钥</text>
				</view>
				<view class="accountInfoBlock" @tap="setNodeInfo">
					<image src="../../static/img/web.png"></image>
					<text>设置节点</text>
				</view>
				<view class="accountInfoBlock" @tap="logoutHandler">
					<image src="../../static/img/log-out.png"></image>
					<text>退出登录</text>
				</view>
			</view>
		</view>
		<view class="assetsInfo" v-if="isScroll">
			<image src="../../static/img/assetsIcon.png" class="assetsIcon"></image>
			<text class="assetsName">{{oexBalance}} OEX</text>
			<text class="exchangeRate"></text>
			<view class="operationHandler">
				<text class="buyHandler" :class="buyActive?'operationActive':''" @tap="operationHandler(1)">转入</text>
				<text class="sendHanler" :class="sendActive?'operationActive':''"  @tap="operationHandler(2)">转出</text>
			</view>
		</view>
		<view class="navTab">
			<text :class="tabAssetActive?'active':''" @tap="chageTabHandler(1)">资产</text>
			<text :class="tabTransactionActive?'active':''" @tap="chageTabHandler(2)">交易</text>
		</view>
		<view class="assetsBlcok" v-if="tabAssetActive" @click="assetsDetailHandler">
			<image src="../../static/img/bg1.png" class="bg"></image>
			<view class="assets">
				<view class="assetsLeft">
					<image src="../../static/img/assetsIcon.png"></image>
					<view class="assetsDetail">
						<text>{{oexBalance}} OEX</text>
						<!-- <text>$0.00 USD</text> -->
					</view>
				</view>
				<image src="../../static/img/rightIcon.png" class="rightIcon"></image>
			</view>
			<image src="../../static/img/bg2.png" class="bg"></image>
			<view class="addCoin">添加代币</view>
		</view>
		<view class="transactionBlock" v-else :style="scrollHeight">
			<image src="../../static/img/bg1.png" class="bg"></image>
			<view class="nodataBlock" >
				
				<scroll-view class="transactionList" scroll-y="true" v-if="dataList.length  >0"
				@scroll="scroll"
				@scrolltolower="scrolltolower"
				 @scrolltoupper="scrolltoupper">
					<!-- <view class="transactionItem" 	v-for="(item,index) in dataList" :key="index">
						<view class="left">
							<view class="transactionDetail">
								<text class="transcationType">{{item.txto == account_info.accountName ? 'From：' + initAccountName(item.txfrom)  :'To：' + initAccountName(item.txto)}}</text>
								<text class="transcationInfo">{{item.txto == account_info.accountName? i18n.zr:i18n.zc}} : {{item.actiondata.status == "1"? i18n.success : i18n.failed}}</text>
							</view>
						</view>
						<view class="right">
							<view class="transactionAmount">{{i18n.amount}}: {{getAmount(item.actiondata.realvalue)}} {{item.actiondata.symbol}}</view>
							<view class="transactionRate">{{i18n.time}}: {{getTime(item.transactiontime)}}</view>
						</view>
					</view> -->
					<view class="detailItem" v-for="(item,index) in dataList" :key="index">
						<view class="left">
							<view class="leftTop">
								<text class="outTitle" :class="{'vote':item.actiondata.type == 772,'red':item.txto != accountName && item.actiondata.type != 772, 'green':item.txto == accountName && item.actiondata.type != 772}">{{getType(item)}}</text>
								<image :src="getImg(item)"  class="out"></image>
								<text class="account">{{getAccount(item)}}</text>
							</view>
							<view class="leftBottom">{{getTime(item.transactiontime)}}</view>
						</view>
						<view class="right">
							<text class="rightTop" :class="{'vote':item.actiondata.type == 772,'red':item.txto != accountName && item.actiondata.type != 772, 'green':item.txto == accountName && item.actiondata.type != 772}">{{getAmout(item)}}</text>
							<text class="rightBottom">{{getState(item)}}</text>
						</view>
					</view>
				</scroll-view>
				<text class="noData" v-else >暂无交易记录</text>
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
				pageIndex:1, //当前第几页
				pageSize:10, //页大小
				isData:false,
				oexAssetID:"",
				oexBalance:0,
				oexSymbol:""
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
		},
		methods: {
			getAssets(){
				//加载资产
				const _this = this;
				account.getAccount(this.account_info.accountName).then(res =>{
					//console.log(res)
					const balances = res.data.result.balances;
					_this.balances = balances;
					if(balances.length > 0){
						const oexAssets = balances.filter(assets =>{
							return assets.assetID == 0
						})
						if(oexAssets.length > 0){
							_this.getOexAssetsDetail(oexAssets[0].assetID,oexAssets[0].balance);
						}else{
							_this.oexBalance = 0;
						}
					}else{
							_this.oexBalance = 0;
					}
					
					
				}).catch(error =>{
					//_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '请求超时':'Request Timeout',)
					console.log(error)
				})
			},
			getOexAssetsDetail(assetID,balance){
				//加载oex资产详情
				const _this = this;
				this.oexAssetID = assetID;
				account.getCoin(assetID).then(result =>{
					console.log(result)
					const res = result.data.result;
					_this.oexSymbol = res.symbol.toUpperCase();
					_this.oexBalance = account.getAmount(balance,res.decimals);
				})
			},
			assetsListHandle(){
				//资产列表
				this.$CommonJS.navigateTo('../assetsList/assetsList')
			},
			assetsDetailHandler(){
				//资产详情
				this.$CommonJS.navigateTo('../assetsDetail/assetsDetail?assetID=' + this.oexAssetID + '&balance=' + this.oexBalance + '&symbol=' + this.oexSymbol)
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
						name: 'OEXChain主网',
						url: 'http://mainnet.oexchain.com',
						active:true
					}
					nodeList.splice(0,1)
					nodeList.unshift(nodeInfoData)
					//this.nodeInfoList = nodeList;
					uni.setStorageSync('nodeInfoList',nodeList)
				}else{
					//this.nodeInfoList = nodeList;
					uni.setStorageSync('nodeInfoList',nodeList)
				}
				
			},
			getAmount(amount){
				return Number(amount).toFixed(2);
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
			getTime(time){
				//转化时间戳
				time = Number(time.toString().substring(0,13))
				return this.$CommonJS.getTime(time,1)
			},
			getType(listItem){
				if(listItem.actiondata.type == 772){
					return '投票'
				}else{
					if(listItem.txto == this.account_info.accountName){
						return '转入'
					}else{
						return '转出'
					}
				}
			},
			getAccount(listItem){
				if(listItem.actiondata.type == 772){
					return listItem.txfrom
				}else{
					if(listItem.txto == this.account_info.accountName){
						return listItem.txfrom
					}else{
						return listItem.txto
					}
				}
			},
			getAmout(listItem){
				if(listItem.actiondata.type == 772){
					return parseInt(listItem.actiondata.realvalue) + listItem.actiondata.symbol.toUpperCase()
				}else{
					if(listItem.txto == this.accountName){
						return '+' + Number(listItem.actiondata.realvalue).toFixed(2) + listItem.actiondata.symbol.toUpperCase()
					}
					return '-' + Number(listItem.actiondata.realvalue).toFixed(2) + listItem.actiondata.symbol.toUpperCase()
				}
			},
			getImg(listItem){
				if(listItem.actiondata.type == 772){
					return '../../static/img/vote.png'
				}else{
					if(listItem.txto == this.account_info.accountName){
						return '../../static/img/in.png'
					}else{
						return '../../static/img/out.png'
					}
				}
			},
			getState(listItem){
				if(listItem.actiondata.type == 772){
					if(Number(listItem.actiondata.status) == 1){
						return '投票成功'
					}else{
						return '投票失败'
					}
				}else{
					if(Number(listItem.actiondata.status) == 1){
						return '交易成功'
					}else{
						return '交易失败'
					}
				}
			},
			getTransactionList(){
				//初始化
				const _this = this;
				this.requestList().then(res=>{
					//console.log(res)
					//uni.hideLoading()
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
					console.log("买入")
				}else{
					//发送
					this.buyActive = false;
					this.sendActive = true;
					//具体操作
					console.log("发送")
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
