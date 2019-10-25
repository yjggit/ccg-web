import { message } from 'antd';
import Utils from "./appUtils";
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options,callback) {
	options.credentials='include';
	let name = Utils.utfToUniCode('游客');
	let userinfo = sessionStorage.getItem("userinfo");
	if(userinfo) {
		let userObj = JSON.parse(userinfo);
		let userData = userObj.data;
		name = Utils.utfToUniCode(userData.userRealName);
	}
	if(options.headers.userName) {

	}else {
		options.headers.userName = name;
	}
	   fetch(url, options)
		      .then(result => result.json())
		      .then((data) => {
		    	if(data!=null&&data.code!=null&&data.code===9898){
		    		 message.success('您的账号已在其他地方登录或登录已过期，请重新登录',function(){
						sessionStorage.removeItem("userinfo");
						sessionStorage.removeItem("admininfo");
						 sessionStorage.removeItem("notifyNum");
						window.location.href="/login";
					 });

		    		return ;

		    	}else if(data!=null&&data.code!=null&&data.code===9899){
		    		 message.success('您无权限查看该页面',1);
			    	 return ;

			    	}
		    	else{
		    		callback(data);
		    	}
 });
}
