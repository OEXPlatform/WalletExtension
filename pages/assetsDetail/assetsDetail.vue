<template>
	<view class="content">
		<!-- <Header></Header> -->
		
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>
			<view class="titleBox">
				<text class="shotrAccount">{{shotrAccount}}</text>
				<text>/{{symbol}}</text>
			</view>
		</view>
		<view class="assetsInfo">
			<image src="../../static/img/assetsIcon.png" class="assetsIcon"></image>
			<text class="assetsName">{{balance}} {{symbol}}</text>
			<!-- <text class="exchangeRate">$0.00 USD</text> -->
			<view class="operationHandler">
				<text class="buyHandler" :class="buyActive?'operationActive':''" @tap="operationHandler(1)">转入</text>
				<text class="sendHanler" :class="sendActive?'operationActive':''"  @tap="operationHandler(2)">转出</text>
			</view>
		</view>
		<image src="../../static/img/bg1.png" class="bg"></image>
		<view class="noData" v-if="list.length < 1">暂无交易</view>
		<scroll-view class="transactionDetails" scroll-y="true" v-else>
			<view class="detailItem" v-for="(item,index) in list" :key="index">
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
		<!-- <image src="../../static/img/bg2.png" class="bg"></image> -->
	
	</view>
</template>

<script>
	import Header from '../../components/Header/header.vue'
	import { ethers } from 'ethers';
	import {myMixins} from '../../common/mixins.js'
	import { setClipboardData, getClipboardData } from '../../js_sdk/u-clipboard/index.js'
	export default{
		data(){
			return{
				accountName:"",
				buyActive:true,
				sendActive:false,
				assetID:"",
				balance:"",
				symbol:"",
				list:[]
			}
		},
		mixins: [myMixins], 
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		onUnload() {
			this.password = "";
			this.privateKey = "";
			
		},
		components:{ Header ,setClipboardData, getClipboardData},
		onLoad(options){
			this.accountName = this.account_info.accountName;
			this.assetID = options.assetID;
			this.balance = options.balance;
			this.symbol = options.symbol;
			//交易信息
			this.getList();
		},
		methods:{
			
			getTime(time){
				//转化时间戳
				time = Number(time.toString().substring(0,13))
				return this.$CommonJS.getTime(time,1)
			},
			getList(){
				//交易信息
				const _this = this;
				uni.request({
					url:this.$API.appServeApi + this.$API.gettransactionforbyassetid,
					data:{
						account:this.account_info.accountName,
						assetid:this.assetID
					},
					success(res) {
						console.log(res)
						if(res.data.code == 200 && res.data.data.length >0){
							res.data.data.map(item =>{
								item.actiondata = JSON.parse(item.actiondata)
							})
							_this.list = res.data.data;
						}
					},
					fail(e) {
						_this.$CommonJS.showToast(e)
					}
				})
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
			back(){
				this.nodeInfoName = "";
				this.nodeInfoUrl = "";
				uni.reLaunch({
					url:'../index/index',
					animationType: 'pop-in',
				})
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
		}
	}
</script>

<style scoped>
	@import url("./assetsDetail");
</style>
