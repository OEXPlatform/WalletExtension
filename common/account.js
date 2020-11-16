import API from './api';
import CommonJS from './common'
import * as oex from 'oex-web3'; 
const nodeInfo = uni.getStorageSync('nodeInfo');

 async function getAccount(accountName){
	//根据账户名查看账户信息 
	var result ;
		const data = await  oex.account.getAccountExByName(accountName); //请求参数
	 await  CommonJS.request(nodeInfo,"POST",data).then( res => {
		 result = res
	 }).catch(error => {
			console.log(error)
			result = error
	 })
	return result;
}

 async function getCoin(assetId){
	//assetId 资产详情
	var result ;
	 const data = await  oex.account.getAssetInfoById(assetId); //请求参数
	 await  CommonJS.request(nodeInfo,"POST",data).then( res => {
		 result = res
	 }).catch(error => {
			console.log(error)
			result = error
	 })
	return result;
}


async function getuserInfo(data){
	var result;
	await uni.request({
		url:API.appServeApi + API.userInfo,
		data:data
	}).then(data => {
		//data为一个数组，数组第一项为错误信息，第二项为返回数据
		var [error, res]  = data;
		result = res.data;
	})
	return result;
}
function getAmount(balance,decimals){
	//转换数量
	return (balance/Math.pow(10,decimals))
}
function toUpCase(symbol){
	return symbol.toUpCase();
}
module.exports = {
	getAccount,getuserInfo,getCoin,getAmount,toUpCase
}