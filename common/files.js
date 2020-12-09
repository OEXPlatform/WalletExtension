module.exports = {
	getFileData:  (fileName)=> {
		 //#ifdef APP-PLUS
		return new Promise((resolve,reject) => {
			plus.io.resolveLocalFileSystemURL("_doc/" + fileName + '.txt', function(entry) {
				///读取文件  
				entry.file(function(file) {
						var fileReader = new plus.io.FileReader();
						fileReader.readAsText(file, 'utf-8');
						fileReader.onloadend = function(evt) {
							//console.log("内容:" + evt.target.result);
							resolve(evt.target.result)
						}
					});
			},function(err){
				//console.log('读取失败')
				reject({
					status:500,
					message:"找不到Kkeystore"
				})//失败的回调
			})
			
			
		})
		
		//#endif
	},
	fileWriter:(writeData,fileName)=>{
		
		//写入文件
		//#ifdef APP-PLUS
		
		return new Promise((resolve,reject) => {
			
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(success) {
				success.root.getFile(fileName, {       //查找account这个文件，有就打开，没有就创建一个 
					create: true
				}, function(fileEntry) {
					var Path = fileEntry.toURL(); //获取当前文件的路径
					//console.log(Path, '当前路径');
					fileEntry.createWriter(function(data) {   //对文件进行写入操作
						data.write(writeData);
						resolve({
							status:200
						})
					}, function(e) {
						//console.log('写入失败')
						reject({
							status:500
						})
					})
				})
			}, function(e) {
				//console.log('我是调用失败的回调') 
					reject({
						status:500
					})//失败的回调
			})
			
		})
		//#endif
	}
}