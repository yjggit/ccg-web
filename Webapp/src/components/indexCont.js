import React, { Component } from 'react';
import './indexCont.css'
import { message } from 'antd'
import { NavLink } from 'react-router-dom';
import request from '../utils/request';
import PropTypes from "proptypes";
import getlink from '../utils/linkutil'
import emitter from "../event"
import cookie from 'react-cookies'
import { stringify } from 'qs';
import massegeImage from './../images/about_img03.png'
import Utils from '../utils/appUtils';


const notifyCount = sessionStorage.getItem("notifyCount");
const permitList = [
    {
        permit: "企业资质",
        childrens: [
            "施工总承包/建筑工程", "施工总承包/市政公用工程", "施工劳务/施工劳务",
            "施工总承包/公路工程", "施工总承包/水利水电工程", "施工总承包/机电工程",
            "施工总承包/通信工程", "施工总承包/铁路工程", "施工总承包/港口与航道工程",
            "施工总承包/电力工程", "施工总承包/矿山工程", "施工总承包/冶金工程",
            "施工总承包/石油化工工程", "专业承包/地基基础工程", "专业承包/模板脚手工程",
            "专业承包/建筑机电安装工程", "专业承包/消防设施工程", "专业承包/防水防腐保温工程",
            "专业承包/起重设备安装工程", "专业承包/钢结构工程", "专业承包/建筑装修装饰工程",
            "专业承包/预拌混凝土", "专业承包/建筑幕墙工程", "专业承包/电子与智能化工程",
            "专业承包/古建筑工程", "专业承包/城市及道路照明工程", "专业承包/园林绿化",
            "专业承包/环保工程", "专业承包/公路路面工程", "专业承包/公路路基工程",
            "专业承包/桥梁工程", "专业承包/隧道工程", "专业承包/公路交通工程",
            "专业承包/水利水电机电安装工程", "专业承包/河湖整治工程", "专业承包/输变电工程",
            "专业承包/铁路电务工程", "专业承包/铁路辅轨架梁工程", "专业承包/铁路电气化工程",
            "专业承包/机场场道工程", "专业承包/航道工程", "专业承包/明航空管工程及机场弱电系统工程",
            "专业承包/机场目视助航工程", "专业承包/通航建筑物工程", "专业承包/港口与海岸工程",
            "专业承包/港行设备安装及水上交管工程", "专业承包/水工金属结构制作与安装工程", "专业承包/海洋石油工程",
            "专业承包/燃气燃烧器具安装、维修", "专业承包/特种工程", "专业承包/核工程",
        ],
    }, {
        permit: "人员证书",
        childrens: [
            "注册建造师/建造", "注册建造师/市政", "注册建造师/公路",
            "注册建造师/水利", "注册建造师/机电", "注册建造师/矿业",
            "注册建造师/铁路", "注册建造师/港航", "注册建造师/民航",
            "注册建造师/通信", "注册造价工程师/土建", "注册造价工程师/安装",
            "注册安全工程师/建造施工安全", "注册安全工程师/煤矿安全", "注册安全工程师/其他安全(交通)",
            "注册安全工程师/其他安全(水利)", "注册安全工程师/其他安全(铁路)", "注册安全工程师/其他安全(电力)",
            "注册安全工程师/其他安全(农业)", "注册安全工程师/其他安全(消防)", "注册安全工程师/其他安全(特种设备)",
            "注册安全工程师/其他安全(其他)", "注册安全工程师/其他安全(电信)", "注册安全工程师/其他安全(军工)",
            "注册安全工程师/危险物品安全(危险化学品)", "注册安全工程师/危险物品安全(民用爆破器材)", "注册安全工程师/危险物品安全(烟花爆竹)",
            "注册安全工程师/非煤矿矿山安全",
        ]
    }, {
        permit: "项目业绩",
        childrens: [
            "业绩类别/房建", "业绩类别/市政", "业绩类别/其他",
            "业绩金额", "业绩数量", "业绩时间",
            "业绩类别/房建", "业绩类别/市政", "业绩类别/其他",
            "业绩金额", "业绩数量", "业绩时间",
            "业绩类别/房建", "业绩类别/市政", "业绩类别/其他",
            "业绩金额", "业绩数量", "业绩时间",
            "业绩类别/房建", "业绩类别/市政", "业绩类别/其他",
            "业绩金额", "业绩数量", "业绩时间",
            "业绩类别/房建", "业绩类别/市政", "业绩类别/其他",
            "业绩金额", "业绩数量", "业绩时间",
        ]
    }]
class IndexCont extends Component {

    state = {
        userInfo: {},
        loginStatus: true,
        permitList: permitList,
        news: [],
        results: [],
        invites: [],
        loginAccount: cookie.load('username'),
        loginPasswd: cookie.load('passwd'),
        isRember: cookie.load('remember'),
        registAccount: '',
        registPasswd: '',
        countState: true,
        verifyCode: '',
        registRePasswd: '',
        isCheckAgreement: false,
        code: '',
        openId: '',
        count: 0,
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
                }, (data) => {
                    if (data.userId > 0) {
                        this.loginSuccess(data, false);
                    } else {
                        this.setState({ openId: data.openId });
                        // this.showBindPhone();
                        let history = this.context.router.history;
                        history.push(`/bindwxToPhone/${this.state.code}/${this.state.openId}`);
                    }
                })
            }
        }
    }
    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem("userinfo")) || {}
        let logined = (!userInfo || JSON.stringify(userInfo) === '{}') ? false : true;
        this.setState({
            userInfo: userInfo,
            loginStatus: logined
        })
        this.fetchBidInviteTop10();
        this.fetchBidResultTop10();
        // this.fetchTopNews();
        this.loadAnimate();
        this.eventEmitter = emitter.addListener("exit", () => {
            let userInfo = JSON.parse(sessionStorage.getItem("userinfo")) || {}
            let logined = (!userInfo || JSON.stringify(userInfo) === '{}') ? false : true;
            this.setState({
                userInfo: userInfo,
                loginStatus: logined
            })
        });
        let data = this.state.userInfo;
        if (notifyCount <= 1) {
            let d = new Date();
            let xx = d.getTime() + 3 * 24 * 60 * 60 * 1000;
            let title = '您的会员即将过期，过期之后将无法正常查询业务数据';
            if (xx >= data.vipEndDate && data.vipEndDate > d.getTime()) {
                this.notfiyMsg(title)
                sessionStorage.setItem('notifyCount', notifyCount + 1)
            } else if (data.vipEndDate < d.getTime()) {
                title = '您的会员已过期，过期之后将无法正常查询业务数据，请尽快续费。';
                this.notfiyMsg(title)
                sessionStorage.setItem('notifyCount', notifyCount + 1)
            }
        }
    }
    loginKeyDown = (e) => {
        if (e.keyCode == 13) {
            this.handlerLoginSubmit();
        }
    }
    registKeyDown = (e) => {
        if (e.keyCode == 13) {
            this.handlerRegistSubmit();
        }
    }

    sendUpdateUserLevel(user) {
        request(`/api/user/updateUserLevel/${user.userId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }, res => {
            // do nothing
        })
    }

    changeLoginAccount = (e) => {
        let value = e.target.value;
        this.setState({
            loginAccount: value
        })
    }
    changeLoginPasswd = (e) => {
        let value = e.target.value;
        this.setState({
            loginPasswd: value
        })
    }
    changeRegistAccount = (e) => {
        let value = e.target.value;
        this.setState({
            registAccount: value
        })
    }
    changeRegistPasswd = (e) => {
        let value = e.target.value;
        this.setState({
            registPasswd: value
        })
    }
    changeIsRember = (e) => {
        let value = e.target.checked;
        this.setState({
            isRember: value
        })
    }
    changeVerifyCode = (e) => {
        let value = e.target.value;
        this.setState({
            verifyCode: value
        })
    }
    changeRegistRePasswd = (e) => {
        let value = e.target.value;
        this.setState({
            registRePasswd: value
        })
    }
    changeIsCheckAgreement = (e) => {
        let value = e.target.checked;
        this.setState({
            isCheckAgreement: value
        })
    }
    changeLoginAccount = (e) => {
        let value = e.target.value;
        this.setState({
            loginAccount: value
        })
    }
    handlerLoginSubmit = () => {
        const { loginAccount, loginPasswd, isRember } = this.state;
        if (!loginAccount || !/^1[3|4|5|7|8|9][0-9]{9}$/.test(loginAccount)) {
            message.info('手机号填写有误，请重新填写', 1);
            return;
        }
        this.setState({
            countState: false
        })
        let fieldsValue = {
            userName: loginAccount,
            password: loginPasswd,
            remember: isRember,
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
        }, res => {
            if (res.status === 'ok') {
                this.loginSuccess(res.user, true);

            } else {
                message.warn(res.message, 1);
            }
            this.setState({
                countState: true
            })
        });
    }
    loginSuccess = (data, t) => {
        // sessionStorage.setItem("userinfo", JSON.stringify({ data }))
        // sessionStorage.setItem("userLevel", data.userLevel)
        let level = Utils.getUserType(data.userLevel)
        // 判断是否已经过期，如果已经过期则更新用户级别
        let now = new Date().getTime();
        if((level == 2 && now > data.diamondEndDate) || (level == 1 && now > data.vipEndDate)) {
            this.sendUpdateUserLevel(data);
            sessionStorage.setItem("userLevel", 1)
            data.userLevel = 1;
        } else {
            sessionStorage.setItem("userLevel", data.userLevel)
        }
        sessionStorage.setItem("userinfo", JSON.stringify({ data }))

        this.setState({
            loginStatus: true,
            userInfo: data
        })
        if (t) {
            let { loginAccount, loginPasswd, isRember } = this.state;
            if (isRember) {
                const d = new Date();
                const num = d.getDate() + 7;
                d.setDate(num);
                cookie.save('username', loginAccount, { path: '/', maxAge: d });
                cookie.save('passwd', loginPasswd, { path: '/', maxAge: d });
                cookie.save('remember', isRember, { path: '/', maxAge: d });
            } else {
                cookie.remove('username', { path: '/' });
                cookie.remove('passwd', { path: '/' });
                cookie.remove('remember', { path: '/' });
            }
        }
        emitter.emit("callMe", data.userRealName, data);
        window.location.href = "/index";
    }
    handlerRegistSubmit = () => {
        const { registAccount, registPasswd, registRePasswd, isCheckAgreement, verifyCode } = this.state;
        if (!registAccount || !/^1[3|4|5|7|8|9][0-9]{9}$/.test(registAccount)) {
            message.info('手机号填写有误，请重新填写', 1);
            return;
        }
        if (!registPasswd || '' == registPasswd) {
            message.info('密码信息有误，请重新填写', 1);
            return;
        }
        if (!registRePasswd && registPasswd !== registRePasswd) {
            message.info('确认密码信息有误，请重新填写', 1);
            return;
        }
        if (!isCheckAgreement) {
            message.info('您必须同意本协议', 1);
            return;
        }
        if (!verifyCode || '' == verifyCode) {
            message.info('请输入验证码', 1);
            return;
        }
        this.setState({
            countState: false
        })
        var fieldsValue = {
            phoneNo: registAccount,
            password: registPasswd,
            captcha: verifyCode,
        }
        fetch(`/api/user/register`, {
            credentials: 'include',
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(fieldsValue)
        })
            .then(result => result.json())
            .then(tdata => {
                this.setState({
                    countState: true
                })
                if (tdata.status === 'ok') {
                    let history = this.context.router.history;
                    let data = tdata.user;
                    sessionStorage.setItem("userinfo", JSON.stringify({ data }))
                    this.setState({
                        userInfo: data,
                        loginStatus: true
                    })
                    message.success(`恭喜您：${registAccount}，您已注册成功`, 1);
                    emitter.emit("callMe", data.userRealName, data);
                    history.push('/person');
                } else {
                    message.info(`注册失败:${tdata.message}`, 1);
                }
            });
    }
    getCaptha = () => {
        const { registAccount } = this.state;
        if (registAccount == null || registAccount == '') {
            message.info('手机号必填', 1);
            return;
        } else {
            let reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
            let flag = reg.test(registAccount)
            if (!flag) {
                message.info('手机号填写有误', 1)
                return;
            }
        }
        this.setState({
            countState: false
        })
        const params = { phoneNo: registAccount };
        fetch(`/api/user/checkUserPropRepeat?${stringify(params)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(result => result.json())
            .then(data => {
                if (data.status != 'ok') {
                    message.info('该手机号已被注册', 1);
                    this.setState({
                        countState: true
                    })
                    return;
                } else {
                    this.refs.yzm.style.backgroundColor = "#dedede";
                    this.refs.yzm.style.borderColor = "#dedede";
                    this.refs.yzm.style.color = "#666666";
                    let count = 59;
                    this.setState({ count });
                    this.interval = setInterval(() => {
                        count -= 1;
                        this.setState({ count });
                        if (count === 0) {
                            if (this.refs.yzm != undefined && this.refs.yzm != null) {
                                this.refs.yzm.style.backgroundColor = "#fff";
                                this.refs.yzm.style.borderColor = "#fc9d10";
                                this.refs.yzm.style.color = "#fc9d10";
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
                                message.info(mess, 1);
                            } else {
                                message.info('验证码已发送成功，请注意查收', 1);
                            }
                            this.setState({
                                countState: true
                            })
                        });
                }
            })
    }
    loadAnimate = () => {
        const { permitList } = this.state;
        let height = 0;
        for (let permits of permitList[0].childrens) {
            height += 25;
        }
        let builderPermitList = document.getElementById("builderPermitList");
        builderPermitList.style.cssText = `height: ${height}px;`;
        builderPermitList.firstChild.style.cssText = `position: absolute; -webkit-animation: repeat ${Math.floor(height / 50)}s infinite linear;`;
        height = 0;
        for (let permits of permitList[1].childrens) {
            height += 25;
        }
        let personCertList = document.getElementById("personCertList");
        personCertList.style.cssText = `height: ${height}px;`;
        personCertList.firstChild.style.cssText = `position: absolute; -webkit-animation: repeat ${Math.floor(height / 50)}s infinite linear;`;
        height = 0;
        for (let permits of permitList[2].childrens) {
            height += 25;
        }
        let bidResultList = document.getElementById("bidResultList");
        bidResultList.style.cssText = `height: ${height}px;`;
        bidResultList.firstChild.style.cssText = `position: absolute; -webkit-animation: repeat ${Math.floor(height / 50)}s infinite linear;`;
    }
    fetchTopNews = () => {
        request("/api/news/topNews?type=1&top=6", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (res) => {
            this.setState({
                news: res
            })
        })
    }
    fetchBidInviteTop10 = () => {
        request("/api/bid/getTop10Invite", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (res) => {
            this.setState({
                invites: res
            })
        })
    }
    fetchBidResultTop10 = () => {
        request("/api/bid/getTop10Result", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (res) => {
            this.setState({
                results: res
            })
        })
    }
    fetchBuilderPermit = () => {
        //招标资质条件
        request("/api/builder/permitList", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (res) => {
            this.setState({
                builderPermits: res
            })
        })
    }
    fetchPersonPermit = () => {
        //人员证书条件
        request("/api/person/permitList", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (res) => {
            this.setState({
                personPermits: res
            })
        })
    }
    render() {
        const { loginStatus, loginAccount, loginPasswd, registAccount, registPasswd, isRember, verifyCode, registRePasswd, isCheckAgreement, count, countState, news } = this.state;
        let endNews = news.slice(1);
        let topNews = news[0];
        return (
            <div style={{ backgroundColor: '#FFF' }} id="top">

                <div className="bg_bannerLoginBefore" style={{ 'display': loginStatus ? 'none' : 'block' }}>
                    <div className="bg_bannerLoginBeforeBox">
                        <div className="bgBigTitle">
                            <h2>欢迎使用点点go建筑业大数据平台</h2>
                            <p>资质、人员、业绩综合查询；企业、人员、业绩、信用查询；为VIP服务的招中标信息定制精准推送</p>
                        </div>
                        {/* <div className="inbgUserBox">
                            <div className="inbgLoginBox">
                                <h4>用户登录</h4>
                                <div className="inbgLoginSbumin" onKeyDown={this.loginKeyDown}>
                                    <input type="text" value={loginAccount} onChange={this.changeLoginAccount} placeholder="请输入电话号码" />
                                    <input type="password" value={loginPasswd} onChange={this.changeLoginPasswd} placeholder="请输入您的登录密码" />
                                    <div>
                                        <input type="checkbox" checked={isRember} value={isRember} onChange={this.changeIsRember} className="inbgLoginAgreement" />
                                        <span> 记住密码 </span>
                                    </div>
                                    <button onClick={countState && this.handlerLoginSubmit}> 立即登录 </button>
                                    <p>登录异常, 请清理浏览器缓存 <span> <NavLink to="/reset" >忘记密码？</NavLink></span></p>
                                </div>
                                <div className="inbgLoginWchatWay" >
                                    <div>
                                        <span>————&nbsp;&nbsp;</span>
                                        <NavLink to="/wchat"><i></i></NavLink>
                                        <span>&nbsp;&nbsp;————</span>
                                    </div>
                                    <p> 微信登录</p>
                                </div>
                            </div>
                            <div className="inbgRegisterBox">
                                <h4>新用户注册</h4>
                                <div className="inbgRegisterSbumin" onKeyDown={this.registKeyDown}>
                                    <input type="text" value={registAccount} onChange={this.changeRegistAccount} placeholder="请输入电话号码" />
                                    <div>
                                        <input type="text" value={verifyCode} onChange={this.changeVerifyCode} placeholder="请输入验证码" />
                                        <button className="getVerificationCode" ref="yzm" onClick={countState && this.getCaptha} disabled={count !== 0} >{count ? `${count} s` : '获取验证码'}</button>
                                    </div>
                                    <input type="password" value={registPasswd} onChange={this.changeRegistPasswd} placeholder="请输入您的登录密码" />
                                    <input type="password" value={registRePasswd} onChange={this.changeRegistRePasswd} placeholder="请确认您的登录密码" />
                                    <p>
                                        <input type="checkbox" value={isCheckAgreement} onChange={this.changeIsCheckAgreement} className="inbgRegisterAgreement" />
                                        <span>我已看过并接受 <NavLink to="/agreement" target="_blank">《用户协议》</NavLink></span>
                                    </p>
                                    <button onClick={countState && this.handlerRegistSubmit}>立即注册</button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="bg_bannerLoginAfterBox" style={{ 'display': loginStatus ? 'block' : 'none' }}>
                    <div>
                        <div className="bg_bannerLoginAfterImage"></div>
                        <div className="bg_bannerLoginAfterBtn">
                            <ul>
                                <li>
                                    <NavLink to={loginStatus ? "/search/builderCompositeSearch" : "/login"}>组合查询</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/builderSimpleSearch" : "/login"}>企业查询</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/builderPersonSearch" : "/login"}>人员查询</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/BuilderPerformSearch" : "/login"}>业绩查询</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/enterpriseBidInviteSearch" : "/login"}>招标公告</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/enterpriseBidResultSearch" : "/login"}>中标信息</NavLink>
                                </li>
                                <li>|</li>
                                <li>
                                    <NavLink to={loginStatus ? "/search/BuilderCreditSearch" : "/login"}>信用查询</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="gcez_comprehensive">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2>组合查询</h2>
                            <p>实时精准整合建筑数据，根据企业资质、人员、业绩、信用等条件多维度匹配工程项目，实现高价中标</p>
                        </div>
                        {/*<NavLink to={loginStatus ? "/search/builderCompositeSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/builderCompositeSearch"}  className='ddgo_index_A'>
                            <div className="gcez_comCard">
                                <div className="gcrz_title" id="gcrz_titleOne">
                                    <h4>企业资质</h4>
                                </div>
                                <div className="gcez_titleList">
                                    <div id="builderPermitList">
                                        <div className="permitList">
                                            {this.state.permitList[0].childrens.map((permits) => {
                                                const listArr = [];
                                                listArr.push(<p>{permits}</p>)
                                                return listArr;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>  
                        </NavLink>
                        {/*<NavLink to={loginStatus ? "/search/builderCompositeSearch" : "/login"} className='ddgo_index_A'>*/}
                        <NavLink to={"/search/builderCompositeSearch"} className='ddgo_index_A'>
                            <div className="gcez_comCard">
                                <div className="gcrz_title" id="gcrz_titleTwo">
                                    <h4>人员证书</h4>
                                </div>
                                <div className="gcez_titleList">
                                    <div id="personCertList">
                                        <div className="permitList">
                                            {this.state.permitList[1].childrens.map((permits) => {
                                                const listArr = [];
                                                listArr.push(<p>{permits}</p>)
                                                return listArr;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                        
                        {/*<NavLink to={loginStatus ? "/search/builderCompositeSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/builderCompositeSearch"}  className='ddgo_index_A'>
                            <div className="gcez_comCard">
                                <div className="gcrz_title" id="gcrz_titleThree">
                                    <h4>项目业绩</h4>
                                </div>
                                <div className="gcez_titleList">
                                    <div id="bidResultList">
                                        <div className="permitList">
                                            {this.state.permitList[2].childrens.map((permits) => {
                                                const listArr = [];
                                                listArr.push(<p>{permits}</p>)
                                                return listArr;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                        
                    </div>
                </div>

                <div className="gcez_project">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2>工程信息咨询服务平台</h2>
                        </div>
                        {/*<NavLink to={loginStatus ? "/search/builderSimpleSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/builderSimpleSearch"}  className='ddgo_index_A'>
                            <div className="gcez_iconList">
                                <div className="gcez_icon">
                                    <i className="gcez_iconOne"></i>
                                </div>
                                <div className="gcez_iconTitel">
                                    <h3>企业查询</h3>
                                    <p>查询企业信息，全面了解企业真实详细</p>
                                </div>
                            </div>
                        </NavLink>         

                        {/*<NavLink to={loginStatus ? "/search/builderPersonSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/builderPersonSearch"}  className='ddgo_index_A'>
                        <div className="gcez_iconList">
                            <div className="gcez_icon">
                                <i className="gcez_iconTwo"></i>
                            </div>
                            <div className="gcez_iconTitel">
                                <h3>人员查询</h3>
                                <p>查询建筑业持证人员证书种类及所在单位、注册历史记录、在建及已完成业绩等详情</p>
                            </div>
                        </div>
                        </NavLink>              
                        {/*<NavLink to={loginStatus ? "/search/BuilderPerformSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/BuilderPerformSearch"}  className='ddgo_index_A'>
                        <div className="gcez_iconList">
                            <div className="gcez_icon">
                                <i className="gcez_iconThree"></i>
                            </div>
                            <div className="gcez_iconTitel">
                                <h3>业绩查询</h3>
                                <p>全方位了解项目，合同备案、施工图审查、施工许可证、竣工验收等详细信息</p>
                            </div>
                        </div>
                        </NavLink>

                        {/*<NavLink to={loginStatus ? "/search/enterpriseBidInviteSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/enterpriseBidInviteSearch"}  className='ddgo_index_A'>
                        <div className="gcez_iconList">
                            <div className="gcez_icon">
                                <i className="gcez_iconFrou"></i>
                            </div>
                            <div className="gcez_iconTitel">
                                <h3>招标公告</h3>
                                <p>全面提供最新招标信息，了解并选择合适自己的项目投标</p>
                            </div>
                        </div>
                        </NavLink>

                        {/*<NavLink to={loginStatus ? "/search/enterpriseBidResultSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/enterpriseBidResultSearch"}  className='ddgo_index_A'>
                        <div className="gcez_iconList">
                            <div className="gcez_icon">
                                <i className="gcez_iconFive"></i>
                            </div>
                            <div className="gcez_iconTitel">
                                <h3>中标信息</h3>
                                <p>查询每日中标项目，业主、中标单位、中标金额、工程范围、工期等详情，选择合适自己的项目分包</p>
                            </div>
                        </div>
                        </NavLink>

                        {/*<NavLink to={loginStatus ? "/search/BuilderCreditSearch" : "/login"}  className='ddgo_index_A'>*/}
                        <NavLink to={"/search/BuilderCreditSearch"}  className='ddgo_index_A'>
                        <div className="gcez_iconList">
                            <div className="gcez_icon">
                                <i className="gcez_iconSix"></i>
                            </div>
                            <div className="gcez_iconTitel">
                                <h3>信用查询</h3>
                                <p>实时了解合作伙伴与竞争对手信用情况，方便与优质企业合作</p>
                            </div>
                        </div>
                        </NavLink>
                        
                    </div>
                </div>

                <div className="gcez_sale"
                     style={{background: loginStatus ? "url(" + require("./../images/gcez_adv.jpg") + ") no-repeat center top" :
                             "url(" + require("./../images/gcez_sale.jpg") + ") no-repeat center top", width: '100%', height: 320}}> </div>

                <div className="gcez_tender">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2>实时掌握 &nbsp;&nbsp; <span>最新招标</span></h2>
                        </div>
                        <div className="gcez_tenderBidsBox">
                            {this.state.invites.map(invite => {
                                return (
                                    <div className="gcez_BidsList">
                                        <h5><a href={getlink(invite.sourceUrl, true)} target="_blank">{invite.tenderTitle}</a></h5>
                                        <div>
                                            <p>{invite.pubDateStr}</p>
                                            <p>资质要求：{invite.qualificationKeyWords || '无'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="gcze_moreBtn"><NavLink to={loginStatus ? "/search/enterpriseBidInviteSearch" : "/login"}>查看更多</NavLink></div>
                    </div>
                </div>

                <div className="gcez_win">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2><span>最新中标</span>  &nbsp;&nbsp; 及时更新</h2>
                        </div>
                        <div className="gcez_winBidsBox">
                            {this.state.results.map(result => {
                                {/* console.log(result) */ }
                                return (
                                    <div className="gcez_winList">
                                        <h5><a href={getlink(result.sourceUrl, true)} target="_blank">{result.bidTitle}</a></h5>
                                        <div>
                                            <p>{result.pubDateStr}</p>
                                            <p>中标企业：{result.builderName || '无'}</p>{/**公路工程 */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="gcze_moreBtn"><NavLink to={loginStatus ? "/search/enterpriseBidResultSearch" : "/login"}>查看更多</NavLink></div>
                    </div>
                </div>

                {/* <div className="gcez_information">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2><span>行业资讯</span> &nbsp;&nbsp; 掌控业内要闻</h2>
                        </div>
                        <div className="gcez_messageBox">
                            <div className="gcez_messageList">
                                {endNews.map(neww => {
                                    return (
                                        <div>
                                            <p>行业资讯 &nbsp; | &nbsp; {`${new Date(neww.publishDate).format('yyyy/MM/dd')}`}</p>
                                            <h5><a title={neww.newsTitle} target="_blank" href={`/newsDetail/${neww.id}`} >{neww.newsTitle}</a></h5>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="gcez_maessageImage">
                                <div className='ddgo_maessageImgBox'>
                                    <img src={topNews ? `/api/news/getPic/${topNews.id}` : ''} />
                                </div>
                                <div className='ddgo_titleImgBox'>
                                    <p>行业资讯&nbsp;&nbsp;|&nbsp;&nbsp;{
                                        `${topNews ? new Date(topNews.publishDate).format('yyyy/MM/dd') : ''}`
                                    }</p>
                                    <h5>{topNews ? topNews.newsTitle : ""}</h5>
                                    <p className="gcez_ImageMore"><a title={topNews ? topNews.newsTitle : ""} target="_blank" href={topNews ? `/newsDetail/${topNews.id}` : ""} >更多-></a></p>
                                </div>
                            </div>
                        </div>
                        <div className="gcze_moreBtn"><NavLink to="/news/ClassNews">查看更多</NavLink></div>
                    </div>
                </div> */}

                <div className="gcez_contact">
                    <div className="gcez_containter">
                        <div className="gcez_bigTitle">
                            <h2>联系我们</h2>
                        </div>
                        <div className="gcez_contIconList">
                            <div>
                                <i className="gcez_contIconOne"></i>
                                <h5>公司地址</h5>
                                <p>成都市高新区环球中心E3-705</p>
                            </div>
                            <div>
                                <i className="gcez_contIconTwo"></i>
                                <h5>客服电话</h5>
                                <p>028-83383377 <br /> 199-4946-3865</p>
                            </div>
                            <div>
                                <i className="gcez_contIconThree"></i>
                                <h5>联系邮箱</h5>
                                <p>zwdc@ddgo8.com</p>
                            </div>
                            <div>
                                <i className="gcez_contIconFour"></i>
                                <h5>工作时间</h5>
                                <p>周一至周五9:00-17:30</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}
IndexCont.contextTypes = {
    router: PropTypes.object.isRequired
};
export default IndexCont;