$(document).ready(function () {
	//测试数据(交易转账)
	var transactionData = {
		toAccountName:"zhangxiushan666",
		assetId:0,
		amount:1,
		remark:"插件测试"
	}
	//浏览器控制台执行
	// OEXINJSECTJS.transaction({toAccountName:"zhangxiushan666",assetId:0,amount:1,remark:"插件测试"})
	
	//转账
	$('#transfer').click(function(){
		OEXINJSECTJS.transaction(transactionData)
	})
	
	checkOexWalletExtend();
	
	//钱包是否安装
	function checkOexWalletExtend(){
		var len = $('body').find('.oexwallet').length;
		if(len < 1){
			$('#title').text("oexwallet 未安装，请先下载安装");
			$('#download').show();
		}else{
			$('#title').text("oexwallet 已安装");
			$('#download').hide();
		}
	}
	
	
	
})



