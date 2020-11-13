module.exports = {
	//页面跳转
	navigateTo: (url) => {
		uni.navigateTo({
			url:url,
			animationType:"slide-in-right",
			
		})
	},
	
	navigateBack:() => {
		uni.navigateBack({
		    delta: 1,
				animationType:"slide-out-right"
		});
	},
}