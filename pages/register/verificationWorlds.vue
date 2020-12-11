<template>
	<view class="login">
		<image src="../../static/img/back_icon.png" class="xiaobaiBack" @tap="backHandler"></image>
		<view class="registrTitle">{{i18n.yzzlcregister_title}}</view>
		<view class="backupsTitle">{{i18n.yzzltips_title}}</view>
		<view class="tipsAttenios">{{i18n.ps2}}</view>
		<view class="verification_key">
			<view class="keyWorlds"  @tap="selectKey(1)">{{first_key}}</view>
			<view class="keyWorlds"  @tap="selectKey(2)">{{two_key}}</view>
			<view class="keyWorlds"  @tap="selectKey(3)">{{three_key}}</view>
		</view>
		<view class="verification_key">
			<text class="keyNumber" v-for="(item,k) in random" :key="k">{{i18n.di}} {{item}} {{i18n.wei}}</text>
		</view>
		<view class="worldsBlock verificationKeyWorlds">
			<text v-for="(item,index) in mnemonic" :key="index" @tap="handleKye(item)">
				{{item}}
			</text>
		</view>
		
		<image :src="i18n.netbtnimg" class="next_btn verNext" @tap="next"></image>
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
				mnemonic:"",
				random:"",
				first_key:"",
				two_key:"",
				three_key:"",
				Wallet:"",
				validateKey:[],
			}
		},
		onLoad(options) {
			//console.log(options)
			const testArray = JSON.parse(options.mnemonic)
			//console.log(testArray)
			if (!Array.prototype.derangedArray) {
			    Array.prototype.derangedArray = function() {
			        for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
			        return this;
			    };
			}
			this.mnemonic = testArray.derangedArray();
			const length = this.mnemonic.length;
			this.random = this.$CommonJS.random(3,length,1);
			this.random.map((item,index)=>{
				const n = item - 1;
				this.validateKey.push(JSON.parse(options.mnemonic)[n])
			})
			//console.log(this.validateKey)
		},
		methods:{
			backHandler(){
				this.BASE.navigateBack()
			},
			next(){
				const _this=this
				if(
				this.first_key == this.validateKey[0] &&
				this.two_key == this.validateKey[1] &&
				this.three_key == this.validateKey[2] 
				){
					this.$CommonJS.navigateTo('./major')
				}else{
					this.$CommonJS.showToast(_this._i18n.locale == 'zh_CN' ? '助记词验证失败':'Mnemonic verification failed')
				}
			},
			selectKey(n){
				//console.log(n)
				switch(n){
					case 1:
						//第一位
						if(this.first_key != "" ){
							this.first_key = ""
						}
						break;
					case 2:
						//第一位
						if(this.two_key != "" ){
							this.two_key = ""
						}
						break;
					case 3:
						//第一位
						if(this.three_key != "" ){
							this.three_key = ""
						}
						break;
				}
				
			},
			handleKye(item){
				if(this.first_key == ""){
					this.first_key = item;
					return;
				}else if(this.two_key == ""){
					this.two_key = item;
					return;
				}else if(this.three_key == ""){
					this.three_key = item;
					return;
				}else{
					return;
				}
			}
		}
	}
</script>

<style scoped>
	@import url("./register.css");
</style>
