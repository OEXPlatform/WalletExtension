document.addEventListener('DOMContentLoaded', function(){
	injectCustomJs()
	initoexwallet()
})



// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}



function initoexwallet()
{
	var div = document.createElement('div');
	div.className = 'oexwallet';
	document.body.appendChild(div);
}






//建立长连接
var port = chrome.runtime.connect({name: "oexwallet"});//通道名称;

//监听长连接的请求

// chrome.runtime.onConnect.addListener(function(port) {
// 	console.log(port);
//   //console.assert(port.name == "oexwallet");
//   port.onMessage.addListener(function(msg) {
//     if(msg.type == "transaction"){
// 			console.log(msg.msg)
// 		}
      
//   });
// });


//接收来自inject.js的消息
window.addEventListener("message", function(e)
{
	console.log(e);
	if(e.origin !== 'http://127.0.0.1:8848') return;
	if(e.data.type == 'connect'){
		port.postMessage({type: "connect"});//发送消息
		// chrome.runtime.sendMessage({greeting:'你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
		// 	tip('收到来自后台的回复：' + response);
		// 	//console.log("来自张秀姗的后台消息" + response)
		// });
	}else if(e.data.type == 'transaction'){
		port.postMessage({type: "transaction",traInfo:e.data.msg});
		// chrome.runtime.sendMessage({type: "transaction",traInfo:e.data.msg}, function(response) {
		// 	//tip('收到来自后台的回复：' + response);
		// 	//console.log("来自张秀姗的后台消息" + response)
		// });
		//port.postMessage({type:'transaction',trandata:e.data.msg});
	}

}, false);




// 接收来自后台的消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
// {
//   console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);;
//   tip(JSON.stringify(request));
// 	sendResponse('我收到你的消息了：'+JSON.stringify(request));
// });



// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
// function sendMessageToBackground(message) {
// 	chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
// 		tip('收到来自后台的回复：' + response);
// 	});
// }




// window.addEventListener("message", function(e)
// {
// 	console.log('收到消息：', e.data);
// 	if(e.data && e.data.cmd == 'invoke') {
// 		eval('('+e.data.code+')');
// 	}
// 	else if(e.data && e.data.cmd == 'message') {
// 		tip(e.data.data);
// 	}
// }, false);


// 简单的消息通知
var tipCount = 0;
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}