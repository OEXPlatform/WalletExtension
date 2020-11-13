
module.exports = {
	xiaobai:"oexchainofficial.",//小白用户
	admin:"oexchainofficial",
	//注册
	
	 //appServeApi:"http://api.oexchain.com",
	appServeApi:"http://192.168.1.19:8080",
	
	phoneValidate:"/api/ouser/getcode.oex", //获取短信验证码
	registerXiaoBai:"/api/ouser/register.oex",//小白注册
	
	//忘记密码
	getForgetcode:"/api/ouser/getForgetcode.oex", //忘记密码里获取短信验证码
	resetpasswordval:"/api/ouser/resetpasswordval.oex", //重置密码
	
	//个人中心
	userInfo:"/api/ouser/getdetail.oex", //个人中心获取用户信息，非链上 参数:account
	gettransactionforme:"/api/otransactioninfo/gettransactionforme.oex",//7.	获取用户交易信息参数:account
	
	//更新版本
	updatedVersion:"/api/rpc/getappversion.oex",//参数 oldVersion 当前版本   device 1安卓或2 iso
	
	
	gettransactionforbyassetid:"/api/otransactioninfo/gettransactionforbyassetid.oex", //10.	获取交易信息根据账号和资产id参数：account  账号assetid  资产id
	
	getbanner:"/api/getbanners.oex",//banner
	getInvitationcodeimg:"/api/getUserQrImage.oex",//获取二维码图片
	geticode:"/api/geticodebyip.oex",//获取当前用户所绑定的邀请码
	
	getwkjl:"/api/rpc/getuserinvitedata.oex",//获取账号的邀请奖励详情

	//11.	获取当前主流资产列表
	assetinfolist:'/api/assetinfolist.oex',
	apptoken:'/api/rpc/getapptoken.oex',
	// rcode:'/api/ouser/getrcode.oex',
	
}