import API from './api.js'
import CommonJS from './common.js'
import i18n from '../lang/index.js'
module.exports = {
	update:(v)=>{
		//版本更新
		var _this = this;
		var wgtVer = "";
		var device = "";
		//#ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			 //console.log(inf)
			var wgtVer = inf.version;
			//_this.version = wgtVer;
			if (wgtVer) {
				console.log("当前应用版本：" + wgtVer);
				if (plus.os.name == "Android") {
					device = 1;
				} else if (plus.os.name == "iOS") {
					device = 2;
				}
				//掉接口
				// const _this = this;
				uni.request({
					url:API.appServeApi + API.updatedVersion,
					  method:'GET',
					data: {
						oldVersion:wgtVer ,
						device: device
					},
					success: (res) => {
						//console.log(res)
						if(res.data.code == 200 && res.data.data != null){
							var d = res.data.data;
							if(d.vtype == 1 || d.vtype == 2){
								uni.showModal({
									title: i18n.locale == 'zh_CN' ? '版本更新':'Version Update',
									content: i18n.locale == 'zh_CN' ? "发现新版本,是否前往下载,若下载新版本,无需卸载之前的版本,直接下载安装即可" : 'If a new version is found in the version update, do you want to download it? If you download the new version, you do not need to uninstall the previous version, you can download and install it directly',
									success(res) {
										if (res.confirm) {
											plus.runtime.openURL("http://www.btctool.cn/#/downapp");
										}
								
									}
								})
								return false;
							}
							//差量包
							var wgtUrl = d.url;
							console.log(wgtUrl)
							plus.downloader.createDownload( wgtUrl, {
								filename: "_doc/update/"
							}, function(d, status) {
								console.log(d)
								if (status == 200) {
									uni.showLoading({
										title: i18n.locale == 'zh_CN' ? "版本更新中..." : 'Version update in progress'
									});
									plus.runtime.install(d.filename, {
										force: true
									}, function() {
										uni.hideLoading();
										plus.runtime.restart();
									}, function(e) {
										uni.hideLoading();
										CommonJS.showToast(i18n.locale == 'zh_CN' ? "更新失败" : 'Update failed')
									});
							
								} else {		
									//uni.hideLoading();
									CommonJS.showToast(i18n.locale == 'zh_CN' ? "更新失败" : 'Update failed')
								}
							
							})
							.start();
						}else{
							if(v){
								CommonJS.showToast(i18n.locale == 'zh_CN' ? "当前版本为最新版本" : 'The current version is the latest version')
							}
							
						}
					
					},
					fail(err) {
						console.log(err)
					}
		
				})
			}else {
				console.log('获取版本号失败');
			}
		})
		//#endif
	}
}