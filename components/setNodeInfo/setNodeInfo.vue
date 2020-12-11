<template>
	<view class="setNodeInfo">
		<view class="candidate">
			<view class="setTitle">
				<image src="../../static/image/setIcon.png"></image>
				<text>{{i18n.szljjd}}</text>
			</view>
			<view class="selectNodeInfo" >
				<view class="selectBox" @tap="showNodeInfoList">
					<text>{{currentNodeInfo}}</text>
					<image src="../../static/image/downset.png"></image>
				</view>
				<view class="nodeInfoList"  v-if="isList">
					<view class="nodeItem" :class="{'active':node.active}" v-for="(node,index) in nodeInfoList" :key="index" >
						<image src="../../static/image/select.png" v-if="node.active"></image>
						<text @tap="handlerNode(index)">{{node.url}}</text>
						<image src="../../static/image/clear.png" class="delete" @tap="nodeDelHandler(index)" v-if="node.isDelete"></image>
					</view>
				</view>
			</view>
			<view class="setInput" v-if="isSetNodeInfp">
				<text>RPC URL</text>
				<text>|</text>
				<input type="text"  :placeholder="i18n.Pleaseenter" placeholder-class="placeholder" class="nodeInput" v-model="nodeInfo"/>
				<image src="../../static/image/clear.png" @tap="clear"></image>
				<!-- <text>0/20</text> -->
			</view>
			<view class="btn">
				<image :src="i18n.btn2" @tap="setHandler"></image>
				<image :src="i18n.btn1" @tap="cancleHandler"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		computed: {
			i18n() {
				return this.$t('user')
			}
		},
		data(){
			return{
				isList:false,
				nodeInfo:"",
				isSetNodeInfp:false,
				currentNodeInfo:"",
				
				nodeInfoList:[]
			}
		},
		created() {
			this.currentNodeInfo = uni.getStorageSync('nodeInfo');
			const nodeInfo = uni.getStorageSync('nodeInfo');
			//console.log(uni.getStorageSync('nodeInfo'))
			let storgeNodeInfoList = uni.getStorageSync('nodeInfoList');
			//console.log(storgeNodeInfoList)
			//let nodeInfoList = 
			if(storgeNodeInfoList == ""){
				this.nodeInfoList = [
					{
						active:uni.getStorageSync('nodeInfo') == "http://mainnet.oexchain.com"? true:false,
						url:'http://mainnet.oexchain.com',
						isDelete:false
					},
					{
						active:uni.getStorageSync('nodeInfo') == "http://mainnet.oexchain.com"? true:false,
						url:this._i18n.locale == 'zh_CN' ?'自定义': 'Custom',
						isDelete:false
					}
				]
			}else{
				storgeNodeInfoList.map(item =>{
					item.active = false;
					if(item.url == nodeInfo){
						item.active = true;
					}
				})
				this.nodeInfoList = storgeNodeInfoList;
			}
		},
		methods:{
			clear(){
				this.nodeInfo = "";
			},
			handlerNode(Index){
				const _this = this;
				this.nodeInfoList.map((item,index) =>{
					item.active = false;
					if(index == Index){
						item.active = !item.active;
						_this.currentNodeInfo = item.url;
						_this.isList = !_this.isList;
					}
					if(index == Index && item.url == "自定义" || item.url == 'Custom'){
						_this.isSetNodeInfp = true;
					}else{
						_this.isSetNodeInfp = false;
					}
				})
			},
			showNodeInfoList(){
				this.isList = !this.isList;
			},
			cancleHandler(){
				this.$emit('colseNodeInfoHandler');
			},
			setHandler(){
				const _this = this;
				var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
				if(this.isSetNodeInfp && this.nodeInfo == ""){
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'请输入RPC URL': 'Please enter RPC URL');
					return;
				}
				if(this.isSetNodeInfp && reg.test(this.nodeInfo) == false){
					_this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ?'RPC URL 格式不规范': 'RPC URL The format is not standard');
					return;
				}
				if(this.isSetNodeInfp && this.nodeInfo !== "" && reg.test(this.nodeInfo)){
					_this.$emit('setNodeInfoHandler',_this.nodeInfo.trim());
					const node = {
						active:false,
						url:_this.nodeInfo,
						isDelete:true
					}
					_this.nodeInfoList.splice(-2, 0,node);
					uni.setStorageSync('nodeInfoList',_this.nodeInfoList);
				}else{
					_this.$emit('setNodeInfoHandler',_this.currentNodeInfo.trim());
					uni.setStorageSync('nodeInfoList',_this.nodeInfoList);
				}
			},
			nodeDelHandler(Index){
				//console.log(Index)
				const _this = this;
				this.nodeInfoList.map((item,index) =>{
					if(index == Index){
						_this.nodeInfoList.splice(index,1)
					}
				})
			},
		}
	}
</script>

<style lang="stylus">
	.setNodeInfo
		width 100%
		height 100%
		position fixed
		top 0
		left 0
		background rgba(0,0,0,.7)
		z-index 1
		
	.candidate 
		width 90%
		height auto
		min-height 400upx
		
		background rgba(247,247,247,0.96)
	
		position fixed
		z-index 2
		border-radius 24upx
		top 50%
		left 50%
		transform translate(-50%,-50%)
		display flex
		flex-direction column
		justify-content flex-start
		align-items center
		padding-bottom 30upx
		
		
	.setTitle
		width 100%
		height 160upx
		background #00C9A7
		border-top-left-radius 24upx 
		border-top-right-radius 24upx
		display flex
		flex-direction column
		justify-content center
		align-items center
		
	.setTitle image
		width 50upx 
		height 50upx 
		margin-bottom 15upx 
		
	.setTitle text
		font-size 14px
		color #FFFFFF
	.selectNodeInfo
		width 100%
		height auto
		display flex
		flex-direction column
		justify-content flex-start
		align-items center
		position relative
	.selectBox
		width calc(90% - 60upx)
		height 50px
		border 1px solid #C0C0C0
		border-radius 8px
		display flex
		flex-direction row
		justify-content flex-start
		align-items center
		padding-left 20upx 
		padding-right 40upx
		position relative
		margin 20upx 0
	.selectBox text 
		width 100%
		font-size 13px 
		color #91A1AF
	.selectBox image 
		width 25upx 
		height 15upx
		position absolute
		right 20upx 
		top 50% 
		transform translateY(-50%)
		
	.nodeInfoList 
		position absolute
		top 105upx 
		left calc(5% - 1px)
		width 90%
		height auto
		min-height 40upx
		z-index 10
		font-size 12px 
		color #91A1AF
		display flex
		flex-direction column
		justify-content flex-start
		align-items center
		border 1px solid #C0C0C0
		border-bottom-left-radius 8px 
		border-bottom-right-radius 8px
		border-top none
		background rgba(247,247,247,0.96)
		
	.nodeInfoList .nodeItem
		width calc(100% - 20upx)
		height 70upx 
		display flex
		flex-direction row
		justify-content flex-start
		align-items center
		padding-left 20upx
		position relative
	.nodeItem image
		width 35upx
		height 35upx
		
	.nodeItem .delete
		position absolute
		right 0
		top 20upx
		
	.nodeInfoList view image
		width 35upx 
		height 35upx
		margin-right 20upx
	
	.setInput 
		width calc(90% - 20upx)
		height 50px
		border 1px solid #C0C0C0
		border-radius 8px
		display flex
		flex-direction row
		justify-content flex-start
		align-items center
		padding-left 10upx 
		padding-right 10upx
		position relative
		margin 20upx 0
		font-size 12px 
		color #91A1AF
		
	.placeholder 
		font-size 12px
		color #91A1AF
	.nodeInput 
		width 75%
		font-size 12px
	.setInput  text
		margin 0 5upx 
	.setInput image
		width 35upx
		height 35upx
		
	.btn
		width auto
		display flex
		flex-direction row
		justify-content center
		align-items center
	.btn image
		width 278upx
		height 115upx
		margin 0 20upx
	.active
		color #00C9A7
</style>
