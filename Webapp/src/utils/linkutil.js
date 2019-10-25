/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function genelink(url,issource) {
	var targeturl=url;
	//  let userinfot = sessionStorage.getItem("userinfo");
	// 	if(userinfot!=null){
			// let userObj = JSON.parse(userinfot);
			// if(userObj!=null&&userObj.data!=null){
			// 	var userLevel = userObj.data.userLevel;
			// 	 let cur = userObj.data.vipEndDate;
			// 	 let now = new Date().getTime();
			// 	 //不论是普通用户还是vip用户，日期过期了，则跳转到VIP
			// 	 if(cur<now){
			// 		 targeturl="/user";
			// 	 }else{
			// 		//普通用户
			// 		if(userLevel===1){
			// 			//来源数据，则不可点击
			// 			if(issource){
			// 				targeturl="javascript:void(0);";
			// 			}else{
			// 			}
			// 		}
			// 	 }
			// }else{
			// 	targeturl="javascript:void(0);";
			// }
		// }else{
		// 	targeturl="javascript:void(0);";
		// }
		return targeturl;
}
