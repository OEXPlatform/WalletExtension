import * as oexWeb3 from 'oex-web3';
import * as common from './common.js';
import * as API from './api.js';
import i18n from '../lang/index.js'
let nodeInfo = uni.getStorageSync('nodeInfo')
const checkReceipt = (txHash) => {
		uni.showLoading({
			title:i18n.locale == 'zh_CN' ? '交易已发送':'Transaction Sent'
		});
		let count = 0;
		const intervalId = setInterval(() => {
			  oexWeb3.oex.getTransactionReceipt(txHash).then(receiptData => {
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
					  } else {
							common.showToast(i18n.locale == 'zh_CN' ? '交易打包中':'Package Deal');
					  }
				  }).catch(error => {
					  console.log(error)
					  common.showToast(error);
				  })
				}).catch(err =>{
					console.log(err)
				})
			}, 3000);
}
module.exports = {
	
	getAssetInfoByName: (assetName) => {
		return new Promise((resolve,reject) => {
			oexWeb3.account.getAssetInfoByName(assetName).then(assetInfoReq => {
				common.request(nodeInfo, "POST", assetInfoReq).then(assetInfo => {
					assetInfo = assetInfo.data.result;
					resolve(assetInfo);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			});
		});
	},
	getAssetInfoById: (assetId) => {
		return new Promise((resolve,reject) => {
			oexWeb3.account.getAssetInfoById(assetId).then(assetInfoReq => {
				common.request(nodeInfo, "POST", assetInfoReq).then(assetInfo => {
					assetInfo = assetInfo.data.result;
					resolve(assetInfo);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getCurrentBlock: (bIncludeTxDetail) => {
		return new Promise((resolve,reject) => {
			oexWeb3.oex.getCurrentBlock(bIncludeTxDetail).then(blockReq => {
				common.request(nodeInfo, "POST", blockReq).then(blockInfo => {
					blockInfo = blockInfo.data.result;
					resolve(blockInfo);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getEpochByHeight: (blockNumber) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getEpochByHeight(blockNumber).then(epochReq => {
				common.request(nodeInfo, "POST", epochReq).then(epoch => {
					epoch = epoch.data.result;
					resolve(epoch);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getCandidates: (epoch, bDetail) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getCandidates(epoch, bDetail).then(candidatesReq => {
				common.request(nodeInfo, "POST", candidatesReq).then(candidates => {
					candidates = candidates.data.result;
					resolve(candidates);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getCandidate: (epoch, candidateName) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getCandidate(epoch, candidateName).then(candidateReq => {
				common.request(nodeInfo, "POST", candidateReq).then(candidate => {
					candidate = candidate.data.result;
					resolve(candidate);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getValidCandidates: (epoch) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getValidCandidates(epoch).then(candidatesReq => {
				common.request(nodeInfo, "POST", candidatesReq).then(candidates => {
					candidates = candidates.data.result;
					resolve(candidates);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getDposInfo: () => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getDposInfo().then(dposReq => {
				common.request(nodeInfo, "POST", dposReq).then(dposInfo => {
					dposInfo = dposInfo.data.result;
					resolve(dposInfo);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getAvailableStake: (epoch, accountName) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getAvailableStake(epoch, accountName).then(stakeReq => {
				common.request(nodeInfo, "POST", stakeReq).then(stakeInfo => {
					stakeInfo = stakeInfo.data.result;
					resolve(stakeInfo);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	getChainConfig: () => {
		return new Promise((resolve,reject) => {
			oexWeb3.oex.getChainConfig(true).then(chainConfigReq => {
				common.request(nodeInfo, "POST", chainConfigReq).then(chainConfig => {
					chainConfig = chainConfig.data.result;
					resolve(chainConfig);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	voteCandidate: (actionInfo, gasInfo, payloadInfo, privateKey, successCallback, failCallback) => {
		oexWeb3.account.getNonce(actionInfo.accountName).then(nonceReqData => {
			common.request(nodeInfo, "POST", nonceReqData).then(nonce => {
				actionInfo.nonce = nonce.data.result;
				oexWeb3.action.voteCandidate(actionInfo, gasInfo, payloadInfo, privateKey).then(candidateReq =>{
					common.request(nodeInfo, "POST", candidateReq).then(res => {
						console.log(res)
						const txHash = res.data.result;
						successCallback();
						checkReceipt(txHash);
					});
				}).catch(err =>{
					console.log(err);
					failCallback(err);
				})
			}).catch(error => {
				console.log(error);
				failCallback(err);
			})
		});		
	},
	issueAsset: (actionInfo, gasInfo, payloadInfo, privateKey, successCallback, failCallback) => {
		oexWeb3.account.getNonce(actionInfo.accountName).then(nonceReqData => {
			common.request(nodeInfo, "POST", nonceReqData).then(nonce => {
				actionInfo.nonce = nonce.data.result;
				oexWeb3.action.issueAsset(actionInfo, gasInfo, payloadInfo, privateKey).then(issueAssetReq =>{
					common.request(nodeInfo, "POST", issueAssetReq).then(res => {
						console.log(res)
						const txHash = res.data.result;
						successCallback();
						checkReceipt(txHash);
					});
				}).catch(err =>{
					console.log(err);
					failCallback(err);
				})
			}).catch(error => {
				console.log(error);
				failCallback(err);
			})
		});		
	},
	getVotersByVoter: (epoch, accountName, detail) => {
		return new Promise((resolve,reject) => {
			oexWeb3.dpos.getVotersByVoter(epoch, accountName, detail).then(votersReq => {
				common.request(nodeInfo, "POST", votersReq).then(voters => {
					voters = voters.data.result;
					resolve(voters);
				}).catch(error => {
					console.log(error);
					reject(error);
				})
			})
		})
	},
	registerCandidate: (actionInfo, gasInfo, payloadInfo, privateKey, successCallback, failCallback) =>{
		oexWeb3.account.getNonce(actionInfo.accountName).then(candidateReqData => {
			common.request(nodeInfo, "POST", candidateReqData).then(candidate => {
				actionInfo.nonce = candidate.data.result;
				console.log(actionInfo, gasInfo, payloadInfo, privateKey)
				oexWeb3.action.registerCandidate(actionInfo, gasInfo, payloadInfo, privateKey).then(candidateReq =>{
					common.request(nodeInfo, "POST", candidateReq).then(res => {
						console.log(res)
						const txHash = res.data.result;
						successCallback();
						checkReceipt(txHash);
					});
				}).catch(err =>{
					console.log(err);
					failCallback(err);
				})
			}).catch(error => {
				console.log(error);
				failCallback(err);
			})
		});		
	}
}