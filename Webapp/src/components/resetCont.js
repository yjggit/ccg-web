import React, { Component } from 'react';
import './resetCont.css'
import {NavLink} from 'react-router-dom';
import {message} from 'antd';
import { stringify } from 'qs';
import request from '../utils/request';
import PropTypes from "proptypes"

class reset extends Component{
    state={
        phone: '',
        verifyCode: '',
        passwd: '',
        rePasswd: '',
        checked: true,
        count: 0,
        accountStatus: false,
        loginCount: 0,
    }

    getVerifyCode = () => {
        let account = this.state.phone;
         if(account==null||account==''){
            message.info('手机号必填',1);
            this.setState({
                accountStatus:false, 
            })
            return;
         }else {
            let reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
         	let flag = reg.test(account)
         	if(!flag){
         		message.info('手机号填写有误',1)
         		this.setState({
                    accountStatus:false, 
                })
                return ;
         	}
        }
        const params = { phoneNo: account };
        fetch(`/api/user/checkUserPropRepeat?${stringify(params)}`,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
        .then(result=>result.json())
        .then(data=>{
            if (data.status == 'ok') {
                message.info('该手机号未被注册',1);
                this.setState({
                    accountStatus:false, 
                })
                return;
            }else{
                this.setState({
                    accountStatus:true, 
                })
                this.refs.yzm.style.backgroundColor="#b1b1b1";
                this.refs.yzm.style.borderColor="#b1b1b1";
                let count = 59;
                this.setState({ count });
                this.interval = setInterval(() => {
                    count -= 1;
                    this.setState({ count });
                    if (count === 0) {
                        if(this.refs.yzm!=undefined&&this.refs.yzm!=null){
        	        		this.refs.yzm.style.backgroundColor="#4090f8";
        	        		this.refs.yzm.style.borderColor="#4090f8";
        	        	}
                        clearInterval(this.interval);
                    }
                }, 1000);
                fetch(`/api/user/getCaptcha?${stringify(params)}`,{
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    }
                })
                .then(result=>result.json())
                .then(data=>{
                    if (data.status != 'ok') {
                        let mess = data.message;
                        let msg = `${mess}`;
                        message.info(msg,1);
                    }else{
                        message.info('验证码已发送成功，请注意查收',1); 
                    }
               });   
            }
        })
    }

    keyDown = (event) =>{
        if(event.keyCode == 13){
            // this.handlerLogin();
          }
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
            verifyCode: value
        })
    }
    changePasswd = (event) => {
        let value = event.target.value;
        this.setState({
            passwd: value
        })
    }
    changeRePasswd = (event) => {
        let value = event.target.value;
        this.setState({
            rePasswd: value
        })
    }

    handlerReset = () => {
        console.log(this.state)
        let {phone, verifyCode, passwd, rePasswd, accountStatus} = this.state;
        if(!accountStatus){
            message.info('手机号填写有误',1);
            return;
        }
        if(!verifyCode || '' === verifyCode){
            message.info('验证码为必填项',1);
            return;
        }
        if(!passwd || '' === passwd){
            message.info('密码为必填项',1);
            return;
        }
        if(!rePasswd || passwd !== rePasswd){
            message.info('两次密码不一致',1);
            return;
        }

        let fieldsValue={
            phoneNo: phone,
            captcha:verifyCode,
            password: passwd,
           };
           this.setState({loginCount:1})
            const options = {
              credentials: 'include',
              method:'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
              },
              body:JSON.stringify({...fieldsValue}),
            };
            request(`/api/user/forgetUserPwd`,options,this.handleSuccess)    
    }

    handleSuccess=(data)=>{
        this.setState({loginCount:0})
        if(data.status==='ok'){
          message.info("修改密码成功",1);
          let history = this.context.router.history;
          history.push('/login');
          }else{
            message.info("修改密码失败："+data.message,1);
          }
    }

    render(){
        return(
            <div class="gcez_resetBgImage">
                <div class="gcez_resetBox">
                    <h2>重置密码</h2>
                    <div class="gcez_resetSbumin">
                        <input value={this.state.phone} onChange={this.changePhone} type="text" maxLength="11" placeholder="请输入电话号码" />
                        <div>
                            <input value={this.state.verifyCode} onChange={this.changeVerifyCode} type="text" maxLength="4" placeholder="请输入验证码" />
                            <button ref="yzm" disabled={this.state.count !== 0} onClick={this.state.count==0 && this.getVerifyCode}>{this.state.count ? `${this.state.count} s` : '获取验证码'}</button>
                        </div>
                        <input value={this.state.passwd} onChange={this.changePasswd} type="password" placeholder="请输入新密码"/>
                        <input value={this.state.rePasswd} onChange={this.changeRePasswd} type="password" placeholder="请确认新密码"/>
                        <button onClick={this.state.loginCount==0&&this.handlerReset} class="gcez_resetConfirm">确认</button>
                        <button class="gcez_resetReturn"><NavLink to="/login">返回登录</NavLink ></button>
                    </div>
                
                </div>
            </div>
        )
    }
}
reset.contextTypes = {
    router: PropTypes.object.isRequired
};
export default reset;