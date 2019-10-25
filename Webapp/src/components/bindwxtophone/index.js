import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { message, notification, Icon } from 'antd';
import emitter from "../../event"
import PropTypes from "proptypes";
import './index.css';

import { stringify } from 'qs';
import request from '../../utils/request';

class BindWxTOPhone extends Component {
    state = {
        accountStatus: false,
        phone: '',
        captcha: '',
        count: 0,
        loginCount: 0,
        code: '',
        openId: '',
    }

    componentDidMount() {
        const openId = this.props.match.params.openId;
        const code = this.props.match.params.code;
        this.setState({
            openId: openId,
            code: code
        })
        console.log(this.state)
    }

    getVerifyCode = () => {
        let account = this.state.phone;
        if (account == null || account == '') {
            message.info('手机号必填', 1);
            this.setState({
                accountStatus: false,
            })
            return;
        } else {
            let reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
            let flag = reg.test(account)
            if (!flag) {
                message.info('手机号填写有误', 1)
                this.setState({
                    accountStatus: false,
                })
                return;
            }
        }
        const params = { phoneNo: account };
        fetch(`/api/user/getUserByWxOpenId/${this.state.openId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result => result.json())
            .then(data => {
                if (data && data.userId > 0) {
                    message.info('该手机号已被注册', 1);
                    this.setState({
                        accountStatus: false,
                    })
                    return;
                } else {
                    this.setState({
                        accountStatus: true,
                    })
                    this.refs.yzm.style.backgroundColor = "#b1b1b1";
                    this.refs.yzm.style.borderColor = "#b1b1b1";
                    let count = 59;
                    this.setState({ count });
                    this.interval = setInterval(() => {
                        count -= 1;
                        this.setState({ count });
                        if (count === 0) {
                            if (this.refs.yzm != undefined && this.refs.yzm != null) {
                                this.refs.yzm.style.backgroundColor = "#4090f8";
                                this.refs.yzm.style.borderColor = "#4090f8";
                            }
                            clearInterval(this.interval);
                        }
                    }, 1000);
                    fetch(`/api/user/getCaptcha?${stringify(params)}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(result => result.json())
                        .then(data => {
                            if (data.status != 'ok') {
                                let mess = data.message;
                                let msg = `${mess}`;
                                message.info(msg, 1);
                            } else {
                                message.info('验证码已发送成功，请注意查收', 1);
                            }
                        });
                }
            })
    }

    changePhone = (event) => {
        let value = event.target.value;
        this.setState({
            phone: value
        })
    }
    changeVerifyCode = (event) => {
        let value = event.target.value;
        this.setState({
            captcha: value
        })
    }

    bindWxToPhone = () => {
        let { phone, captcha, accountStatus } = this.state;
        if (!accountStatus) {
            message.info('手机号填写有误', 1);
            return;
        }
        if (!captcha || '' === captcha) {
            message.info('验证码为必填项', 1);
            return;
        }
        this.setState({ loginCount: 1 })
        let fieldsValue = {
            phoneNo: phone,
            captcha: captcha,
            code: this.state.code,
            openId: this.state.openId
        };
        let option = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fieldsValue)
        }
        request(`/api/user/addWxCodeToPhoneNo`, option, this.handleBindSuccess);
    }

    handleBindSuccess = (data) => {
        this.setState({ loginCount: 0 })
        if (data.status === 'ok') {
            fetch(`/api/user/getUserByWxOpenId/${this.state.openId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(result => result.json())
                .then(data => {
                    if (data.userId > 0) {
                        this.loginSuccess(data, false);
                    } else {
                        message.info("微信登录失败", 1);
                    }
                });
            message.info("绑定成功", 1);
        } else {
            message.info("绑定失败：" + data.message, 1);
        }
    };

    loginSuccess = (data, t) => {
        console.log(data)
        let history = this.context.router.history;
        sessionStorage.setItem("userinfo", JSON.stringify({ data }))
        let d = new Date();
        let xx = d.getTime() + 3 * 24 * 60 * 60 * 1000;
        let title = '您的会员即将过期，过期之后将无法正常查询业务数据';
        if (xx >= data.vipEndDate && data.vipEndDate > d.getTime()) {
            this.notfiyMsg(title)
        } else if (data.vipEndDate < d.getTime()) {
            title = '您的会员已过期，过期之后将无法正常查询业务数据，请尽快续费。';
            this.notfiyMsg(title)
        }
        emitter.emit("callMe", data.userRealName, data);
        history.push('/');
    }

    notfiyMsg = (msg) => {
        notification.open({
            message: '过期提示',
            description: msg,
            icon: <Icon type="smile-circle"
                style={{ color: '#108ee9' }} />,
        });
    }

    render() {
        const { count, loginCount } = this.state;
        return (
            <div className="gcez_BindPhoneBgImage" >
                <div className="gcez_BindPhonetBox" >
                    <h2 > 绑定手机号码 </h2> <div className="gcez_BindPhoneSbumin">
                        <input type="text"
                            value={this.state.phone}
                            onChange={this.changePhone}
                            placeholder="请输入电话号码" />
                        <div >
                            <input type="text"
                                value={this.state.captcha}
                                onChange={this.changeVerifyCode}
                                placeholder="请输入验证码" />
                            <button ref="yzm"
                                onClick={count === 0 && this.getVerifyCode} > {count ? `${count} s` : '获取验证码'} </button> </div>
                        <button className="gcez_BindPhoneButton"
                            onClick={loginCount == 0 && this.bindWxToPhone} > 确认绑定 </button>
                        <button className="gcez_BindPhoneReturn" > < NavLink to="/login" > 返回登录 </NavLink ></button >
                    </div>
                </div>
            </div>
        )
    }
}
BindWxTOPhone.contextTypes = {
    router: PropTypes.object.isRequired
};
export default BindWxTOPhone;