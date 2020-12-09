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
		getType(listItem){
			if(listItem.actiondata.type == 772){
				return this._i18n.locale == 'zh_CN' ?'投票':'vote'
			}else if(listItem.actiondata.type == 774){
				return this._i18n.locale == 'zh_CN' ?'挖矿':'mining'
			}else{
				if(listItem.txto == this.account_info.accountName){
					return this._i18n.locale == 'zh_CN' ?'转入':"roll-in"
				}else{
					return this._i18n.locale == 'zh_CN' ?'转出':"roll-out"
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
				//投票
				return parseInt(listItem.actiondata.realvalue) + listItem.actiondata.symbol.toUpperCase()
			}else if(listItem.actiondata.type == 774){
				//挖矿
				return   " *** OEX"
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
					return this._i18n.locale == 'zh_CN' ?'投票成功':"Vote Successful"
				}else{
					return this._i18n.locale == 'zh_CN' ?'投票失败':"Vote Failed"
				}
			}else if(listItem.actiondata.type == 774){
				if(Number(listItem.actiondata.status) == 1){
					return this._i18n.locale == 'zh_CN' ?'领取成功':"Claim Successful"
				}else{
					return this._i18n.locale == 'zh_CN' ?'领取失败':"Claim Failed"
				}
			}else{
				if(Number(listItem.actiondata.status) == 1){
					return this._i18n.locale == 'zh_CN' ?'交易成功':"Trade Successful"
				}else{
					return this._i18n.locale == 'zh_CN' ?'交易失败':"Trade Failed"
				}
			}
		},
		getTime(time){
			//转化时间戳
			time = Number(time.toString().substring(0,13))
			return this.$CommonJS.getTime(time,1)
		},
		transactionDetail(actionhash){
			//交易详情
			//#ifdef APP-PLUS
					plus.runtime.openURL('http://oexchain.com/#/Transaction?' + actionhash);
			//#endif
			//#ifdef H5
				let tempwindow = window.open('_blank');
				tempwindow.location.href = 'http://oexchain.com/#/Transaction?' + actionhash;
			//#endif
		},
	}
}