<script>
	import * as oex from 'oex-web3';
	export default {
		onLaunch: function() {
			
			const _this = this;
			let language = uni.getStorageSync('language');
			if(uni.getStorageSync('login_status') && uni.getStorageSync('account_info')){
				let  system_info = "";
				if(language){
					if(language =='en') system_info ="zh_CN";
					else system_info="en";
				}else{
					system_info="zh_CN";
				}
				system_info === 'en' ? system_info = _this._i18n.locale = 'zh_CN' : system_info = _this._i18n.locale = 'en';
				uni.setStorageSync('system_info',system_info);
				uni.reLaunch({
					url: './pages/index/index'
				})
			}else{
				if(language){
					let  system_info = "";
					if(language == 'en') system_info ="zh_CN";
					else system_info="en";
					
					system_info === 'en' ? system_info = _this._i18n.locale = 'zh_CN' : system_info = _this._i18n.locale = 'en';
					uni.setStorageSync('system_info',system_info);
					uni.reLaunch({
						url: './pages/login/login'
					})
				}else{
					uni.navigateTo({
						url:"./pages/start/start"
					})
				}
			}
			
			//设置节点，同步数据
			oex.utils.setApp();
			let nodeInfo = ""
			let nodeInfoList = uni.getStorageSync('nodeInfoList');
			if(!nodeInfoList){
				const nodeInfoData = [{
					name: 'OEXChain主网',
					url: 'http://mainnet.oexchain.com',
					active:'T'
				}]
				nodeInfo = nodeInfoData[0].url;
				uni.setStorageSync('nodeInfoList',nodeInfoData)
			
			}else{
				const item = nodeInfoList.filter(node =>{
					return node.active == 'T'
				})
				nodeInfo = item[0].url;
			}
			uni.setStorageSync('nodeInfo',nodeInfo);
			oex.utils.setProvider(nodeInfo);
			
			oex.oex.getChainConfig(true).then(chainConfig => {
				//console.log(chainConfig)
				this.$CommonJS.request(nodeInfo, "POST", chainConfig).then(chainConfigInfo => {
					oex.oex.setChainConfig(chainConfigInfo.data.result);
					oex.oex.setChainId(chainConfigInfo.data.result.chainId);
				})
			})
		},
	}
</script>

<style>
	/*每个页面公共css */
	page{
		width: 375px;
		height: 600px;
		overflow-y: scroll;
	}
	/* #ifdef H5 */
	::-webkit-scrollbar{
		display: none;
	}
	
	/* #endif */
</style>
