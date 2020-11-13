<template>
	<view class="content">
		<!-- <Header></Header> -->
		<view class="title">
			<image src="../../static/img/back2.png" class="backIcon" @tap="back"></image>{{i18n.setNodeInfo}}
		</view>
		<view class="tips setNodeInfoTips">
			{{i18n.nodeInfoTips}}
		</view>
		<view>
			<view class="zhujici_title zhujicipwd">
				<image src="../../static/img/point.png"></image>
				<text>网络名称</text>
			</view>
			<view class="pwd">
				<input  type="text" class="passworld"  placeholder-class="pwd_placeholder" v-model="nodeInfoName" maxlength="24" />
			</view>
		</view>
		<view>
			<view class="zhujici_title zhujicipwd">
				<image src="../../static/img/point.png"></image>
				<text>新增 RPC URL</text>
			</view>
			<view class="pwd">
				<input  type="text" class="passworld" placeholder-class="pwd_placeholder" placeholder="http(https)://xxx" v-model="nodeInfoUrl" />
			</view>
		</view>
		<view class="setBtns">
			<text class="cancel" @tap="back">取消</text>
			<text class="save" @click="saveHandler">保存</text>
		</view>
	
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
				nodeInfoName:"OEX测试网1",
				nodeInfoUrl:"http://mainnet-bj.oexchain.com",
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
			saveHandler(){
				const _this = this;
				if(!this.nodeInfoName){
					_this.$CommonJS.showToast('网络名称不能为空');
					return;
				}
				if(!this.nodeInfoUrl){
					_this.$CommonJS.showToast('RPC URL 不能为空');
					return;
				}
				if(!this.$CommonJS.validateURL(this.nodeInfoUrl.trim())){
					_this.$CommonJS.showToast('无效的 URL');
					return;
				}
				const nodeInfo = {
					name: this.nodeInfoName,
					url: this.nodeInfoUrl,
					active:"F"
				}
				const nodeInfoList = uni.getStorageSync('nodeInfoList');
				nodeInfoList.push(nodeInfo);
				this.nodeInfoList = nodeInfoList;
				uni.setStorage({
					key:'nodeInfoList',
					data:nodeInfoList,
					success() {
						uni.showToast({
							title:'保存成功'
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	@import url("./setNodeInfo");
</style>
