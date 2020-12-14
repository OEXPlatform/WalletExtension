//console.log("hahahahah123")
// 监听来自content-script的消息
// chrome.runtime.onConnect.addListener(function(port) {
// 	//console.log(port)

//   port.onMessage.addListener(function(msg) {
// 		//console.log(msg)
// 	 if(msg.type == "transaction"){
// 		// 	//监听交易消息
// 			console.log(msg.trandata);
// 			//return;
// 			port.postMessage({type: "transaction",msg:"后台同意你发起的交易请求"});
// 		}

      
//   });
// });
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
// {
// 	console.log('我是popup，我已收到你的消息：' + JSON.stringify(request))
// 	parent.operationHandler()
// 	//console.log('收到来自content-script的消息：');
// 	//console.log(request, sender, sendResponse);
// 	//sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
// //  if(request.type == "transaction"){
// // 		//监听交易消息
// // 		console.log(request.trandata);
// // 		//sendResponse({callback:"yes"})
// // 		//port.postMessage({type: "transaction",msg:"后台同意你发起的交易请求"});
// // 	}
// });

// popup与content-script建立长连接
// $('#connect_to_content_script').click(() => {
	// getCurrentTabId((tabId) => {
	// 	var port = chrome.tabs.connect(tabId, {name: 'oexwallet'});
	// 	//port.postMessage({question: '你是谁啊？'});
	// 	port.onMessage.addListener(function(msg) {
	// 		//alert('收到长连接消息：'+msg.answer);
	// 		if(msg.type == "transaction"){
	// 			// 	//监听交易消息
	// 				console.log(msg.trandata);
	// 				//return;
	// 				port.postMessage({type: "transaction",msg:"后台同意你发起的交易请求"});
	// 		}
		
	// 	});
	// });
// });

// 获取当前选项卡ID
// function getCurrentTabId(callback)
// {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
// 	{
// 		if(callback) callback(tabs.length ? tabs[0].id: null);
// 	});
// }

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
// function getCurrentTabId2()
// {
// 	chrome.windows.getCurrent(function(currentWindow)
// 	{
// 		chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs)
// 		{
// 			if(callback) callback(tabs.length ? tabs[0].id: null);
// 		});
// 	});
// }

// 向content-script主动发送消息
// function sendMessageToContentScript(message, callback)
// {
// 	getCurrentTabId((tabId) =>
// 	{
// 		chrome.tabs.sendMessage(tabId, message, function(response)
// 		{
// 			if(callback) callback(response);
// 		});
// 	});
// }

// 向content-script注入JS片段
// function executeScriptToCurrentTab(code)
// {
// 	getCurrentTabId((tabId) =>
// 	{
// 		chrome.tabs.executeScript(tabId, {code: code});
// 	});
// }