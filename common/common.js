import * as oex from 'oex-web3';
import * as API from './api.js';

module.exports = {
	change:()=> {
		const system_info = uni.getStorageSync('system_info')
		system_info.language === 'zh_CN' ? system_info.language = this._i18n.locale = 'en' : system_info.language = this._i18n
			.locale = 'zh_CN'
		uni.setStorageSync('system_info', system_info)
		uni.reLaunch({
			url: 'index'
		})
	},
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
	//uni-requst
	request:(url,method,data) => {
		return new Promise((resolve,reject) => {
			uni.request({
			    url: url,
					method: method ? method : "GET",
					// header:{
					// 	'content-type':"application/x-www-form-urlencoded"
					// },
			    data:data
			}).then(res => {
				resolve(
					res[1]
				)
			})
			// .catch(error=>{
			// 	reject(error)
			// })
		})
		
	},
	getTime:(time,type) => {
		//时间戳处理
		var time1;
		var reg = /^\d{13}$/;
		if(reg.test(time)) {
			 time1 = time; //13位时间戳
		} else {
		  time1 = time*1000; //10位时间戳
		}
		let time2 = new Date(time1);
		var   year=time2.getFullYear();   
		var   month=time2.getMonth()+1;  
		var   date=time2.getDate();  
		var   hour=time2.getHours();   
		var   minute=time2.getMinutes();    
		var   second=time2.getSeconds();
		if(type){
		  return year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date) + ' ' 
			+ (hour < 10 ? ('0' + hour) : hour)  
			+ ':' + (minute < 10 ? ('0' + minute) : minute)
			+ ':' + (second < 10 ? ('0' + second) : second)
		}else{
			return year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date) + ' ' ;
		}
		
		
	},
	
  getCountDown:(timestamp)=>{
		//时间戳倒计时
		setInterval(function(){
				var nowTime = new Date();
				var endTime = new Date(timestamp * 1000);

				var t = endTime.getTime() - nowTime.getTime();
	//            var d=Math.floor(t/1000/60/60/24);
				var hour=Math.floor(t/1000/60/60%24);
					 var min=Math.floor(t/1000/60%60);
					 var sec=Math.floor(t/1000%60);

				if (hour < 10) {
						 hour = "0" + hour;
				}
				if (min < 10) {
						 min = "0" + min;
				}
				if (sec < 10) {
						 sec = "0" + sec;
				}
				var countDownTime = hour + ":" + min + ":" + sec;
				return countDownTime;
		
		},1000);
	},
	
	getQueryVariable:(variable,url)=>{
		 //url参数处理
		 if(url){
			 var vars = url.split("&");
			
		 }else{
			  var query = window.location.search.substring(1);
			   var vars = query.split("&");
		 }
		 for (var i=0;i<vars.length;i++) {
			 var pair = vars[i].split("=");
			 if(pair[0] == variable){return pair[1];}
		 }
		 return(false);
		 
	},
	
	

	getBaseImgUrl:(url,baseUrl)=>{
			//拼接图片路径
			if(url && url.indexOf('http')==-1){
				return baseUrl + url;
			}else{
				return url
			}
	},
	showToast:(msg)=>{
		uni.showToast({
			title:msg,
			icon:"none"
		})
	},
	formatNum:(f, digit)=>{ 
		//提高js计算精度
	    var m = Math.pow(10, digit); 
	    return parseInt(f * m, 10) / m; 
	} ,
	toNonExponential:(num) => {
		//转换科学计数法
		var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
		return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
	},
	async appReadFileToBase64(path){
		//图片转base64
		return new Promise((resolve,reject)=>{  
	
				plus.io.resolveLocalFileSystemURL(path, function(entry) {  
						entry.file(function(file) {  
								var AppReader = new plus.io.FileReader();  
								AppReader.onloadend = function(e) {  
										let base64 = e.target.result  
										resolve('data:image/png;base64,'+ base64.split(",")[1])  
								};  
								AppReader.onerror = function(err) {  
										reject(err)  
								};  
								AppReader.readAsDataURL(file);    
						}, function(e) {  
								reject(e)  
	
						});  
				});  
	
		})  
	
	},
	//验证手机号
	PhoneValidate:(phone)=>{
		if(!(/^1[3456789]\d{9}$/.test(phone))){
			return false; 
		} else{
			return true;
		}
		
	},
	//手机号格式化
	initPhone:(phone)=>{
	 return	phone.substr(0, 3) + '****' + phone.substring(7, 11);
	},
	//密码验证
	passwordValidate:(pwd) =>{
		
		var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}');
		if (!pwdRegex.test(pwd)) {
		    return false;
		}else{
			return true;
		}
	},
	//账户验证
	// 专业账户：字母开头，名称由数字和字母组成，12到16位
	// 小白账户：名称由数字和字母组成，3到16位
	//^([a-z][a-z0-9]{11,15})(\.([a-z0-9]{2,16})){0,2}$`
	accountValidate:(account,type) =>{
		if(type == 1){
			//var accountRegex = new RegExp('[a-z][a-z0-9]{11,15}');
			var accountRegex =/^[a-z][a-z0-9]{11,15}$/;
		}else{
			//小白账户
			var accountRegex = new RegExp(/^[a-z0-9]{2,16}$/) ;
		}
		if(!accountRegex.test(account)){
			return false;
		}else{
			return true;
		}
	},
	
	//random
	random:(length,min,max)=>{
		var Arr = [];
		var add=0;
		
		while(add<length){
		 var num= Math.floor(Math.random()*(max-min+1)+min);
		 if(Arr.indexOf(num) == -1){
		   Arr.push(num);
		   add++;
		 }
		 Arr.sort(function(a,b){
		       return a-b;
		 })			
		}
		return Arr;
	},
	hex2Bytes: (str) => {
	  let pos = 0;
	  let len = str.length;
	  let hexA = new Uint8Array();
	
	  if (str[0] === '0' && (str[1] === 'x' || str[1] === 'X')) {
	    pos = 2;
	    len -= 2;
	  }
	  if (len === 0) {
	    return hexA;
	  }
	  if (len % 2 !== 0) {
	    if (pos === 0) {
	      str = '0' + str;
	    } else {
	      str = str.substr(0, pos) + '0' + str.substr(pos);
	      len += 1;
	    }
	  }
	
	  len /= 2;
	  hexA = new Uint8Array(len);
	  for (let i = 0; i < len; i += 1) {
	    const s = str.substr(pos, 2);
	    const v = parseInt(s, 16);
	    hexA[i] = v;
	    pos += 2;
	  }
	  return hexA;
	},
	validateURL:(urlString) =>{
		if(urlString!=""){
			var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
			if(!reg.test(urlString)){
				return false;
			}else{
				return true
			}
		}
	},
	
}