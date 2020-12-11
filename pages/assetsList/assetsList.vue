<template>
	<view class="content">
		<!-- <Header></Header> -->
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>
			zhangxiushan / OEX
		</view>
		<view class="assetsInfo">
			<image src="../../static/img/assetsIcon.png" class="assetsIcon"></image>
			<text class="assetsName">0 OEX</text>
			<text class="exchangeRate">$0.00 USD</text>
			<view class="operationHandler">
				<text class="buyHandler" :class="buyActive?'operationActive':''" @tap="operationHandler(1)">转入</text>
				<text class="sendHanler" :class="sendActive?'operationActive':''"  @tap="operationHandler(2)">转出</text>
			</view>
		</view>
		<image src="../../static/img/bg1.png" class="bg"></image>
		<scroll-view class="transactionDetails" scroll-y="true">
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
				</view>
			</view>
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
				</view>
			</view>
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
				</view>
			</view>
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
				</view>
			</view>
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
				</view>
			</view>
			<view class="detailItem">
				<view class="left">
					<view class="leftTop">
						<text class="outTitle red">转出</text>
						<image src="../../static/img/out.png" class="out"></image>
						<text class="account">zhangxiushanzhangxiushan</text>
					</view>
					<view class="leftBottom">2020/11/04 10:09:15</view>
				</view>
				<view class="right">
					<text class="rightTop red">-0.42 OEX</text>
					<text class="rightBottom">交易成功</text>
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
				buyActive:true,
				sendActive:false,
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
		methods:{
			back(){
				this.nodeInfoName = "";
				this.nodeInfoUrl = "";
				// this.BASE.navigateBack();
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
				}else{
					//发送
					this.buyActive = false;
					this.sendActive = true;
					//具体操作
				}
			},
		}
	}
</script>

<style scoped>
	@import url("./assetsList");
</style>
