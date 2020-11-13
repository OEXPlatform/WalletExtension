export const myMixins = {
	data(){
		return{
			account_info:"",
			login_status:"",
			shotrAccount:"",
			nodeInfoList:[]
		}
	},
	onLoad(){
		this.login_status = uni.getStorageSync('login_status');
		this.account_info = uni.getStorageSync("account_info");
		if(this.account_info.accountName.indexOf('.') != -1) this.shotrAccount = this.account_info.accountName.split('.')[1]
		else this.shotrAccount = this.account_info.accountName
		
		this.nodeInfoList = uni.getStorageSync('nodeInfoList');
	},
	
	methods:{
		
	}
}