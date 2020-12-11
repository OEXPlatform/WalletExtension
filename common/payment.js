import * as oex from 'oex-web3';
import * as common from './common.js';
import * as API from './api.js';
import BigNumber from 'bignumber.js';
import i18n from '../lang/index.js' 

module.exports = {
	payment:(currentAccountName,toAccountName,assetId,amount,remark,decimals,privateKey,gasPrice,gasLimit) =>{
		return new Promise((resolve,reject) => {
			//console.log(privateKey + "," + gasPrice + "," + gasLimit);
			let nodeInfo = uni.getStorageSync('nodeInfo');
			//console.log(nodeInfo)
			oex.account.getNonce(currentAccountName).then(nonceReqData => {
				//console.log(nonceReqData);
				common.request(nodeInfo, "POST", nonceReqData).then( nonce => {
						//console.log(nonce)
						const actionInfo = {
							accountName: currentAccountName,
							toAccountName: toAccountName,
							assetId: assetId,
							amount: new BigNumber(amount).shiftedBy(parseInt(decimals)),
							remark:remark,
							nonce: nonce.data.result
						};
						const gasInfo = {gasPrice:"0x" + new BigNumber(gasPrice).toString(16), gasLimit: "0x" + new BigNumber(gasLimit).toString(16)};
						//console.log(actionInfo)
						oex.action.transfer(actionInfo, gasInfo, privateKey).then(res =>{
							//console.log(res)
							
							common.request(nodeInfo,"POST",res).then( res => {
								const txHash = res.data.result;
								if (txHash === undefined) {
									common.showToast(i18n.locale == 'zh_CN' ? '交易生成有误':'Transaction generation error');
									return;
								}
								//console.log(txHash)
								uni.showLoading({
									title:i18n.locale == 'zh_CN' ? '交易已发送':'Transaction Sent',
								});
								let count = 0;
								const intervalId = setInterval(() => {
									  oex.oex.getTransactionReceipt(txHash).then(receiptData => {
										  common.request(nodeInfo, "POST", receiptData).then(receipt => {
											  receipt = receipt.data.result;
											  if (receipt == null) {
												  count++;
												  if (count == 3) {
													  common.showToast(i18n.locale == 'zh_CN' ? '交易打包超时':'Transaction packing timeout');
													  clearInterval(intervalId);
												  }
												  return;
											  }
											  clearInterval(intervalId);
											  uni.hideLoading();
											  const actionResults = receipt.actionResults;
											  if (actionResults[0].status == 0) {
												  common.showToast(i18n.locale == 'zh_CN' ? '交易执行失败，原因' + ':' + actionResults[0].error:'Transaction execution failed, reason' + ':' + actionResults[0].error);
													reject(actionResults[0].error);
											  } else {
												  common.showToast(i18n.locale == 'zh_CN' ? '交易打包中':'Package Deal');
													resolve(true)
													
											  }
										  }).catch(error => {
											  common.showToast(error);
												reject(error);
										  })
										}).catch(err =>{
										reject(err);
										})
									}, 3000);
							}).catch(error => {
									reject(error);
							})
							
						}).catch(err =>{
							console.log(err)
							reject(error);
						})
					
				}).catch(error => {
						console.log(error)
						reject(error);
				})
			});
		})
	},
}