chrome.tabs.query(
	{active: true, currentWindow: true},
	function(tabs) {
				var port = chrome.tabs.connect(//建立通道
					tabs[0].id,
					{name: "oexwallet"}//通道名称
			);
});

//监听长连接的请求

chrome.runtime.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(msg) {
		//console.log(msg)
		if(msg.type == "transaction"){
			//链接钱包
			var traInfo = msg.traInfo;
			var views = chrome.extension.getViews({type:'popup'});
			var tabs = chrome.extension.getViews({type:'tab'});

			if(views.length < 1 && tabs.length == 0) {
				chrome.storage.sync.set({'traInfo': traInfo}, function() {
					console.log('保存成功');
				});
				chrome.windows.create({
					url:'index.html',
					type:'popup',
					width:360,
					height:600,
					left:25,
					top:25
				},function(window){})
				
			}else{
				return;
			}
		}
  });
});



