<template>
	<view class="header">
		<image src="../../static/img/logo.png" class="logo"></image>
		<view class="headerRight">
			<view class="setNodeInfo" @click.stop="toggleNodeInfoBlockHandler">
				<view class="circle"></view>
				<text class="mainNet">{{nodeInfo}}</text>
				<image src="../../static/img/dowIcon.png"></image>
			</view>
			<Language></Language>
		</view>
		<view class="setNodeInfoBlock" v-if="isNodeInfo">
			<view class="title">{{i18n.web}}</view>
			<view class="tips">{{i18n.defaultweb}}</view>
			<view class="nodeItem" v-for="(nodeInfo,index) in nodeInfoList" :key="index" @tap="changeIndexHandle(index)">
				<image :src="nodeInfo.active == 'T'?'../../static/img/selectgreen.png':'../../static/img/selectwheit.png'"></image>
				<text :class="nodeInfo.active == 'T'?'activeNode':''">{{nodeInfo.name}}</text>
				<image v-if="index !==0" :src="nodeInfo.active == 'T'?'../../static/img/deleteActive.png':'../../static/img/delete.png'" class="delete" @click.stop="deleteHandler(index)"></image>
			</view>
			<view class="nodeItem" @tap="setNodeInfoHandler">
				<image src="../../static/img/selectwheit.png"></image>
				<text>{{i18n.custom}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import * as oex from 'oex-web3';
	import Language from '../Language/language.vue';
	export default{
		data(){
			return{
				isNodeInfo:false,
				nodeInfoList:[],
				nodeInfo:"",
				newList:[]
			}
		},
		components:{ Language },
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		watch: {
			nodeInfoList(val) {
				let leng = val.filter(item => {
					return item.active == 'T'
				})
				if(leng.length <1){
					val[0].active = 'T'
					
				}
				let node = val.filter(item => {
					return item.active == 'T'
				})
				let nodeInfo = node[0].url;
				this.nodeInfoList = val;
				this.initNodeInfo();
				this.setProviderHandler(nodeInfo);
				uni.setStorageSync('nodeInfo',nodeInfo);
				uni.setStorageSync('nodeInfoList',val)
			}
		},
		mounted() {
			this.nodeInfoList = uni.getStorageSync('nodeInfoList');
			this.initNodeInfo();
		},
		methods:{
			initNodeInfo(){
				 const node = this.nodeInfoList.filter(item =>{
					return item.active == 'T'
				})
				this.nodeInfo = node[0].name
			},
			changeIndexHandle(index){
				this.nodeInfoList.map(item =>{
					item.active = 'F';
				})
				this.nodeInfoList[index].active = 'T';
				this.nodeInfo = this.nodeInfoList[index].name;
				let nodeInfo = this.nodeInfoList[index].url;
				this.setProviderHandler(nodeInfo);
				uni.setStorageSync('nodeInfo',nodeInfo);
				uni.setStorageSync('nodeInfoList',this.nodeInfoList)
				this.isNodeInfo = !this.isNodeInfo;
			},
			setProviderHandler(nodeInfo){
				oex.utils.setProvider(nodeInfo);
				oex.oex.getChainConfig(true).then(chainConfig => {
					this.$CommonJS.request(nodeInfo, "POST", chainConfig).then(chainConfigInfo => {
						oex.oex.setChainConfig(chainConfigInfo.data.result);
						oex.oex.setChainId(chainConfigInfo.data.result.chainId);
					})
				})
			},
			toggleNodeInfoBlockHandler(){
				this.isNodeInfo = !this.isNodeInfo;
				
			},
			setNodeInfoHandler(){
				this.isNodeInfo = !this.isNodeInfo;
				this.$CommonJS.navigateTo('../setNodeInfo/setNodeInfo');
			},
			deleteHandler(index){
				//删除节点
				let arr = this.nodeInfoList.filter((item,Index) =>{
					return Index !== index;
				})
				this.nodeInfoList = arr;
				this.isNodeInfo = !this.isNodeInfo;
			}
		}
	}
</script>

<style>
	.header{
		width: calc(750rpx - 54rpx);
		height: 140rpx;
		background: #F2F3F4;
		opacity: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 54rpx;
		position: relative;
	}
	.logo,.avatar{
		width: 89rpx;
		height: 89rpx;
		border-radius: 50rpx;
	}
	.headerRight{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.setNodeInfo{
		min-width: 269rpx;
		width: auto;
		max-width: 300rpx;
		height: 67rpx;
		background: #FFFFFF;
		border: 3rpx solid #767E89;
		opacity: 1;
		border-radius: 50rpx;
		margin-right: 34rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 0 10rpx;
	}
	.circle{
		width: 20rpx;
		height: 20rpx;
		background: #00C9A7;
		border-radius: 50rpx;
	}
	.mainNet{
		font-size: 13px;
		color: #383C41;
		margin: 10rpx;
		min-width: 200rpx;
		width: auto;
		max-width: 250rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.setNodeInfo image{
		width: 27rpx;
		height: 15rpx;
	}
	.setNodeInfoBlock{
		position: absolute;
		z-index: 10;
		width: calc(650rpx - 30rpx);
		min-height:calc(200rpx - 40rpx) ;
		height: auto;
		background: rgba(0,0,0,0.8);
		right: 30rpx;
		top: 120rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 30rpx 15rpx;
	}
	.title{
		width: 90%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 16px;
		color: #FFFFFF;
		border-bottom: 1rpx solid #F1F1F1;
	}
	.tips{
		width: 90%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: left;
		font-size: 14px;
		color: #999;
		letter-spacing: 1rpx;
		margin: 10rpx 0 20rpx;
	}
	.nodeItem{
		width: 90%;
		height: auto;
		padding: 20rpx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.nodeItem image{
		width: 30rpx;
		height: 30rpx;
		margin-right: 15rpx;
	}
	.nodeItem text{
		font-size: 14px;
		color: #999;
		letter-spacing: 1rpx;
	}
	.nodeItem .activeNode{
		color: #00C9A7;
		font-size: 15px;
		font-weight: bold;
	}
	.nodeItem .delete{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
