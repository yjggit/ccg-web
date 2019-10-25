import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { message, notification, Icon } from 'antd';
import PropTypes from "proptypes";
import request from '../../utils/request';
import emitter from "../../event"
import cookie from 'react-cookies'
import './loginCont.css'

class login extends Component {
    state = {
        username: cookie.load('username'),
        passwd: cookie.load('passwd'),
        remember: cookie.load('remember'),
        code: '',
        openId: '',
    }
    componentWillMount() {
        let uri = document.location.href;
        let code = null;
        let idx = uri.indexOf('code=');
        if (idx > -1) {
            let xidx = uri.indexOf("&");
            if (xidx == -1) {
                xidx = uri.length;
            }
            code = uri.substring(idx + 5, xidx);
            this.setState({ code });
            if (code != null && code.length > 0) {
                request(`/api/user/getUserByWxCode/${code}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }, this.c1)
            }
        }
    }
    c1 = (data) => {
        if (data.userId > 0) {
            this.loginSuccess(data, false);
        } else {
            this.setState({ openId: data.openId });
            // this.showBindPhone();
            let history = this.context.router.history;
            history.push(`/bindwxToPhone/${this.state.code}/${this.state.openId}`);
        }
    }

    usernameChange = (e) => {
        let value = e.target.value;
        this.setState({
            username: value
        })
    }

    passwdChange = (e) => {
        let value = e.target.value;
        this.setState({
            passwd: value
        })
    }

    handlerLogin = () => {
        console.log("1");
        let app = this;
        let fieldsValue = {
            userName: app.state.username,
            password: app.state.passwd,
            remember: app.state.remember,
            type: 'account',
        };
        fieldsValue = JSON.stringify(fieldsValue);
        request(`/api/login/account`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: fieldsValue

        },  this.handleLoginRes);
        
    }

    handleLoginRes = (data) => {
        console.log("123")
        if (data.status === 'ok') {
            this.loginSuccess(data.user, true);
            console.log(data)
            let history = this.context.router.history;
              history.push(`/mobileSuc/${data.user.userRealName}/${data.user.enteAddress}/${data.user.enterpriseName}`);

        } else {
            message.warn(data.message, 1);
        }
    }

    keyDown = (event) => {
        if (event.keyCode == 13) {
            this.handlerLogin();
        }
    }

    notfiyMsg = (msg) => {
        notification.open({
            message: '过期提示',
            description: msg,
            icon: < Icon type="smile-circle"
                style={
                    { color: '#108ee9' }
                }
            />,
        });
    }

    loginSuccess = (data, t) => {
        let history = this.context.router.history;
        sessionStorage.setItem("userinfo", JSON.stringify({ data }))
        let d = new Date();
        let xx = d.getTime() + 3 * 24 * 60 * 60 * 1000;
        // let title = '您的会员即将过期，过期之后将无法正常查询业务数据';
        // if (xx >= data.vipEndDate && data.vipEndDate > d.getTime()) {
        //     this.notfiyMsg(title)
        // } else if (data.vipEndDate < d.getTime()) {
        //     title = '您的会员已过期，过期之后将无法正常查询业务数据，请尽快续费。';
        //     this.notfiyMsg(title)
        // }
        if (t) {
            if (this.state.remember) {
                const d = new Date();
                const num = d.getDate() + 7;
                d.setDate(num);
                cookie.save('username', this.state.username, { path: '/', maxAge: d });
                cookie.save('passwd', this.state.passwd, { path: '/', maxAge: d });
                cookie.save('remember', this.state.remember, { path: '/', maxAge: d });
            } else {
                cookie.remove('username', { path: '/' });
                cookie.remove('passwd', { path: '/' });
                cookie.remove('remember', { path: '/' });
            }
        }
        emitter.emit("callMe", data.userRealName, data);
        history.push('/');
    }

    render() {
        return (
            <div className="gcez_loginBgImage" >
                <div className="gcez_loginPageBox" >
                    <div className="gcez_loginList" >
                        <h2>欢迎登录</h2>
                    </div>
                    <div className="gcez_loginSbumin"
                        onKeyDown={this.keyDown} >
                        <input type="text" placeholder="请输入手机号码" value={this.state.username} onChange={this.usernameChange} />
                        <input type="password" placeholder="请输入您的登录密码" value={this.state.passwd} onChange={this.passwdChange} />
                        <div>
                            <input type="checkbox" checked={this.state.checked} onChange={this.changeChecked} className="gcez_agreement" />
                            <span> 记住密码 </span>
                        </div>
                        <button onClick={this.handlerLogin}> 立即登录 </button>
                        <p id="login_but" ><NavLink to="/mobileReg">去注册 » </NavLink></p>
                        {/* <p>如登录出现异常, 请清理浏览器缓存。 <span> <NavLink to="/reset" >忘记密码？</NavLink></span></p> */}
                    </div>
                    {/* <div className="gcez_loginWchatWay" >
                        <div>
                            <NavLink to="/wchat"><i></i></NavLink>
                        </div>
                        <p> 微信登录</p>
                    </div> */}
                </div>
            </div>
        )
    }
}
login.contextTypes = {
    router: PropTypes.object.isRequired
};
export default login;