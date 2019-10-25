import React, { Component } from 'react';
import './wchatCont.css';
import PropTypes from "proptypes"


class wchat extends Component{
    componentDidMount(){
        var WxLogin= window.WxLogin
        let obj = new WxLogin({
            id:"loginWechatCode", 
            appid: "wx4dcab06ba64465f9", 
            // appid: "wxc7312892284377df", 
            scope: "snsapi_login", 
            redirect_uri: "http://www.ddgo8.com/index",
            response_type: 'code',
            state: ""+new Date().getTime(),
            style: "",
            href: ""
          });
    }

    onClose = () => {
        let history = this.context.router.history;
        // console.log('weChat route: ', history);
        history.goBack();
    };

    render(){
        return(
            <div className="gcez_wchatImage">
                <div className="gcez_wchatBox">
                    {/* <h2>微信登录</h2> */}
                    <button onClick={this.onClose}>关闭</button>
                    <div id="loginWechatCode" className="gcez_wchatCode">
                    </div>
                    {/* <p>请使用微信扫描二维码登录"点点go平台"</p> */}
                </div>
            </div>
        )
    }
}
wchat.contextTypes = {
    router: PropTypes.object.isRequired
};
export default wchat;