module.exports = {
	emptyValidate:(value,message)=>{
		if(value == "" || value == null || value == undefined){
			const status = {
				result:false,
				message:message + "不能为空"
			}
			return status;
		}else{
			const status = {
				result:true,
				message:value
			}
			return status;
		}
	},
}