import React, { Component } from 'react';
import { LocaleProvider, Layout, message, Modal, Icon, Input, Upload, Tabs } from 'antd';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import 'antd-mobile/dist/antd-mobile.css';
import agreement from './components/agreementCont'
import IndexCont from './components/indexCont'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import emitter from "./event"
import PropTypes from "proptypes"
import request from './utils/request'
import ScrollToTop from './ScrollToTop';
import FooterContent from './components/footer'
import { stringify } from 'qs';
import EnteRedirect from './components/enteRedirect'
import Loadable from 'react-loadable';
import search from './components/searchCont'
import cookie from 'react-cookies'
import IndexCont2 from "./components/indexCont2";
import Utils from './utils/appUtils';
// const QRCode = require('qrcode.react');



const { TextArea } = Input;
const { Content } = Layout;
const { TabPane } = Tabs;
const MyLoadingComponent = ({ isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
};


const EnteInfo = Loadable({
  loader: () => import('./components/search/ddgo_company_details'),
  loading: MyLoadingComponent,
})
const ClassNews = Loadable({
  loader: () => import('./components/news/class_news'),
  loading: MyLoadingComponent,
})
const SingleInfo = Loadable({
  loader: () => import('./components/buildcost/singleSearch'),
  loading: MyLoadingComponent,
})
const BindWxTOPhone = Loadable({
  loader: () => import('./components/bindwxtophone/index'),
  loading: MyLoadingComponent,
})
const about = Loadable({
  loader: () => import('./components/aboutCont'),
  loading: MyLoadingComponent,
})
const help = Loadable({
  loader: () => import('./components/helpCont'),
  loading: MyLoadingComponent,
})
const reset = Loadable({
  loader: () => import('./components/resetCont'),
  loading: MyLoadingComponent,
})
const wchat = Loadable({
  loader: () => import('./components/wchatCont'),
  loading: MyLoadingComponent,
})
const news = Loadable({
  loader: () => import('./components/newsCont'),
  loading: MyLoadingComponent,
})
const build = Loadable({
  loader: () => import('./components/BuilderCostInfo'),
  loading: MyLoadingComponent,
})
// const search = Loadable({
//   loader: () => import('./components/searchCont'),
//   loading: MyLoadingComponent,
// })
const BuilderCompositeSearch = Loadable({
  loader: () => import('./components/search/enterprise/BuilderCompositeSearch'),
  loading: MyLoadingComponent,
})
const user = Loadable({
  loader: () => import('./components/vipCont'),
  loading: MyLoadingComponent,
})
const PersonInfo = Loadable({
  loader: () => import('./components/PersonInfo'),
  loading: MyLoadingComponent,
})
const PersonCont = Loadable({
  loader: () => import('./components/personCont'),
  loading: MyLoadingComponent,
})
const ChangePwd = Loadable({
  loader: () => import('./components/ChangePwd/index'),
  loading: MyLoadingComponent,
})
const UserManager = Loadable({
  loader: () => import('./components/manager/usermanager'),
  loading: MyLoadingComponent,
})
const PersonCustomize = Loadable({
  loader: () => import('./components/personal/person_customize'),
  loading: MyLoadingComponent,
})
const NewDetail = Loadable({
  loader: () => import('./components/news/newsChildren'),
  loading: MyLoadingComponent,
})
const Zhaobiao = Loadable({
  loader: () => import('./components/project/zhaobiao'),
  loading: MyLoadingComponent,
})
const Zhongbiao = Loadable({
  loader: () => import('./components/project/zhongbiao'),
  loading: MyLoadingComponent,
})
const Project = Loadable({
  loader: () => import('./components/project/project.1'),
  loading: MyLoadingComponent,
})
const ProjectNew = Loadable({
  loader: () => import('./components/project/project'),
  loading: MyLoadingComponent,
})

//手机端
// const mobilLoginCont = Loadable({
//   loader: () => import('./components/mobile/loginCont'),
//   loading: MyLoadingComponent,
// })

// const mobilLoginRegister = Loadable({
//   loader: () => import('./components/mobile/login_register'),
//   loading: MyLoadingComponent,
// })
// const mobilLoginSuc = Loadable({
//   loader: () => import('./components/mobile/loginSuccess'),
//   loading: MyLoadingComponent,
// })

// const mobilLoginInfo = Loadable({
//   loader: () => import('./components/mobile/loginInfo'),
//   loading: MyLoadingComponent,
// })

//二维码
// const mobilTwoCode = Loadable({
//   loader: () => import('./components/mobile/TwoCode'),
//   loading: MyLoadingComponent,
// })

// function isMobil() {
//   const userAgentInfo = navigator.userAgent;
//   const Agents = ["Android", "iPhone",
//     "SymbianOS", "Windows Phone",
//     "iPad", "iPod"];
//   let flag = true;
//   for (let v = 0; v < Agents.length; v++) {
//     if (userAgentInfo.includes(Agents[v])) {
//       flag = false;
//       break
//     }
//   }
//   return flag
// }

class App extends Component {

  state = {
    userinfo: {},
    userName: '',
    notifyCount: 0,
    pwdModalVisible: false,
    adminPwdModalVisible: false,
    redPacketModalVisible: false,
    adminUserName: '',
    visible: false,
    sysMaintenance: false,
    fileList: [],
    picUrls: [],
    feedbackContent: '',
    growUpTipVisiable: false,
    closeTime: 30,
    showLoginPage: true,
    logResVisible: false,
    loginAccount: cookie.load('username'),
    loginPasswd: cookie.load('passwd'),
    isRember: cookie.load('remember'),
    registAccount: '',
    registPasswd: '',
    countState: true,
    verifyCode: '',
    registRePasswd: '',
    inviteCode: '',
    isCheckAgreement: false,
    code: '',
    openId: '',
    count: 0,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      logRegVisible: false,
      redPacketModalVisible: false,
    });
  }
  componentWillMount() {
    // this.props.history.listen(route => {
    //   // console.log(route);
    //   if(route.pathname === '/search/builderCompositeSearch') {
    //     this.setState({showLoginPage: true})
    //   }else {
    //     this.setState({showLoginPage: false})
    //   }
    // });
  }

  componentDidMount() {
    // if (!isMobil()){
    //     //   // window.location.href = '/mobil-login-register'
    //     //   return <Redirect to="/mobil-login-register"/>
    //     // }
    // sessionStorage.setItem("userLevel", '-1');
    // if (this.state.logined == false) {
      this.setState({ redPacketModalVisible: true });
    // }
    let userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
    let showed = sessionStorage.getItem("showed");
    if (showed != "true") {
      this.setState({ growUpTipVisiable: true })
      let app = this;
      this.interval = setInterval(() => {
        let closeTime = app.state.closeTime;
        if (closeTime == 0) {
          this.setState({ growUpTipVisiable: false })
          clearInterval(app.interval);
          sessionStorage.setItem("showed", "true");
        } else {
          this.setState({ closeTime: closeTime - 1 })
        }
      }, 1000);
    }
    if (userInfo && userInfo.data) {
      this.setState({
        userinfo: userInfo.data,
        notifyCount: userInfo.data.notifyCount
      })
    }
    this.eventEmitter = emitter.addListener("callMe", (name, userinfot) => {
      console.log('receive callback username: ', name);
      this.setState({
        userName: name,
      });
      if (userinfot != null) {
        this.setState({
          userinfo: userinfot,
          notifyCount: userinfot.notifyCount,
        });
      }
    });
    this.eventEmitter = emitter.addListener("getNoticeCount", () => {
      this.getNoticeCount();
    });
    this.eventEmitter = emitter.addListener("adminLoginCallMe", (name) => {
      this.setState({
        adminUserName: name,
      });
    });
    //登录注册订阅监听...弹出
    this.eventEmitter = emitter.addListener("loginModal", (isShow) => {
      this.setState({
        logRegVisible: isShow, //true
      });
    });
    //定制消息的订阅监听
    // this.eventEmitter = emitter.addListener("customizedMsg", (sr) => {
    //   this.setState({
    //     notifyCount: sr,
    //   });
    // })

  }

  loginOut = () => {
    let REQUEST_URL = '/api/login/loginOut';
    let userinfo = sessionStorage.getItem("userinfo");
    if (userinfo) {
      let userObj = JSON.parse(userinfo);
      let userData = userObj.data;
      // let da = Utils.utfToUniCode(userData.userRealName);
      console.log('utfToUniCode...', userData);
      request(REQUEST_URL, {
        method: 'GET',
        headers: {
          'userName': userData.userAccount,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }, this.callback4)

    }

  }

  getNoticeCount = () => {
    if (sessionStorage.getItem("userinfo")) {
      let userinfot = sessionStorage.getItem("userinfo");
      if (userinfot != null) {
        let userObj = JSON.parse(userinfot);
        if (userObj != null && userObj.data != null) {
          let x = userObj.data.userId;
          let params = { userId: x }
          let REQUEST_URL = `/api/notice/getUnReadNoticeCount?${stringify(params)}&time` + new Date().getTime()
          request(REQUEST_URL, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }, this.noticeCountCall)
        }
      }
    }

  }
  noticeCountCall = (sr) => {
    sessionStorage.setItem("notifyNum", sr);
    this.setState({ notifyCount: sr });
  }

  callback4 = (data) => {
    if (data.status === 'ok') {
      sessionStorage.removeItem("userinfo");
      sessionStorage.removeItem("notifyNum");
      message.success('您已成功退出系统', 1);
      emitter.emit("exit");
    } else {
      message.success('您已成功退出系统', 1);
    }
    this.setState({ logined: false, userinfo: null });
    let history = this.context.router.history;
    // history.push('/toLogin');
    console.log('current history: ', history)
    if(history.location.pathname==='/person' || history.location.pathname==='/person/PersonCust' ||
      history.location.pathname==='/BuildCost/SingleInfo' || history.location.pathname==='/BuildCost/CombineInfo'
    ) {
      history.push('/toLogin');
    }
    emitter.emit("updateUserLevel", -1);
  }

  adminLoginOut = () => {
    let REQUEST_URL = '/api/admin/loginOut';
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }, this.callback3)
  }

  callback3 = (data) => {
    if (data.status === 'ok') {
      sessionStorage.removeItem("admininfo");
      message.success('您已成功退出系统', 1);
      let history = this.context.router.history;
      history.push('/index');

    } else {
      message.success('您已成功退出系统', 1);
    }
  }

  renderLoginPage() {
    const { userName, notifyCount } = this.state;
    let usernameStr = userName;
    let num = sessionStorage.getItem("notifyNum");
    console.log('notifyCount num: ', num);
    // let notifyCountStr = notifyCount || 0;
    // notifyCountStr = notifyCountStr <= 99 ? notifyCountStr : "99+";
    let notifyCountStr = num || 0;
    notifyCountStr = notifyCountStr <= 99 ? notifyCountStr : "99+";

    if (sessionStorage.getItem("userinfo")) {
      if (userName == null || userName == '') {
        let userinfot = sessionStorage.getItem("userinfo");
        if (userinfot != null) {
          let userObj = JSON.parse(userinfot);
          if (userObj != null && userObj.data != null) {
            usernameStr = userObj.data.userRealName;
          }
        }
      }
      return (
        <div className="ddgo_userLogin">
          <div className="ddgo_custom">
            <NavLink to="/PersonCustomize">
              <p>{notifyCountStr}</p>
              <i className="gcez_customIcon"></i>
            </NavLink>
          </div>
          <div className="ddgo_userName">
            <p>{usernameStr}</p>
            <ul>
              <li><NavLink to="/person" activeClassName="personLoginDo">个人中心</NavLink></li>
              {/*<li><NavLink to="/myCommunity" activeClassName="personLoginDo">我的社区</NavLink></li>*/}
              {/*<li><NavLink to="/myAccount" activeClassName="personLoginDo">我的账户</NavLink></li>*/}
              <li><NavLink to="#" activeClassName="personLoginDo" onClick={this.showChangePwd}>修改密码</NavLink></li>
              <li><NavLink to="/user" activeClassName="personLoginDo" >开通/续费</NavLink></li>
              <li onClick={this.loginOut}><NavLink to="#" activeClassName="personLoginDo" >退出</NavLink></li>
            </ul>
          </div>
        </div>
      );
    } else {
      let xx = sessionStorage.getItem("admininfo")
      if (xx) {
        let currentUserName = this.state.adminUserName;
        if (currentUserName === null || currentUserName === '') {
          let xt = JSON.parse(xx);
          currentUserName = xt.data.adminName
        }
        return (
          <div id="header_Personal">
            {currentUserName}
            <ul>
              <li><NavLink to="#" activeClassName="personLoginDo" onClick={this.showAdminChangePwd}>修改密码</NavLink></li>
              <li onClick={this.adminLoginOut}><NavLink to="#" activeClassName="personLoginDo" >退出</NavLink></li>
            </ul>
          </div>
        );
      } else {
        return (
          <div className="ddgo_loginBox">
            <p className="ddgo_logoRegister" onClick={() => { this.setState({ logRegVisible: true }) }}>登录/注册</p>
          </div>

        );
      }
    }

  }
  showAdminChangePwd = () => {
    this.setState({ adminPwdModalVisible: true })
  }

  handleAdminPwdModalVisible = () => {
    this.setState({ adminPwdModalVisible: false })
  }

  handleAdminPwdReset = (values) => {
    let xx = sessionStorage.getItem("admininfo")
    let xt = JSON.parse(xx);
    let adminIdStr = xt.data.adminId;
    const params = { ...values, adminId: adminIdStr }
    const options = {
      credentials: 'include',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(params),
    };
    request(`/api/admin/changePwd`, options, this.callback2)
  }

  callback2 = (data) => {
    if (data.status == 'ok') {
      message.success('修改密码成功', 1);
      this.setState({ adminPwdModalVisible: false })
    } else {
      message.success(`修改密码失败:${data.message}`, 1);
    }
  }

  showChangePwd = () => {
    this.setState({ pwdModalVisible: true })
  }

  handlePwdModalVisible = () => {
    this.setState({ pwdModalVisible: false })
  }

  handlePwdReset = (values) => {
    const options = {
      credentials: 'include',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ ...values }),
    };
    request(`/api/user/changeUserPwd`, options, this.callback1)
  }

  callback1 = (data) => {
    if (data.status == 'ok') {
      message.success('修改密码成功', 1);
      this.setState({ pwdModalVisible: false })
    } else {
      message.success(`修改密码失败:${data.message}`, 1);
    }
  }

  // handleCancel = () => this.setState({ visible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ file, fileList }) => {
    // console.log(fileList)
    // console.log(option)
    let maxSize = 1024 * 1024;
    if (file.size >= maxSize) {
      fileList = fileList.filter(f => f.uid != file.uid);
      message.warning("单个文件上传大小限制1MB以内！")
    }
    this.setState({ fileList: fileList })
  }

  handleOk = (e) => {
    let { fileList, userinfo, feedbackContent } = this.state;
    let urls = "";
    fileList.map(file => {
      if (file.response) {
        if (urls != "") {
          urls += ","
        }
        urls = urls + `/api/config/getPic/${file.response.message}`
      }
    })
    let param = {
      files: urls,
      userId: userinfo.userId,
      content: feedbackContent,
    }
    // stringify
    request(`/api/feedback?${stringify(param)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }, res => {
      if (res && res.status == 200) {
        message.info("反馈成功，谢谢您的建议！");
      } else {
        message.info("非常抱歉，反馈功能好像出问题了呢。")
      }
    })

    this.setState({
      visible: false,
    });
  }

  feedbackContentChange = (e) => {
    let value = e.target.value;
    if (value.length > 500) {
      value = value.slice(0, 500);
    }
    this.setState({
      feedbackContent: value
    })
  }

  callback(key) {
    console.log(key);
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
  changeInviteCode = (e) => {
    let value = e.target.value;
    this.setState({
      inviteCode: value
    })
  }
  changeIsCheckAgreement = (e) => {
    let value = e.target.checked;
    this.setState({
      isCheckAgreement: value
    })
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

  //点击登录
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
        'userName': loginAccount,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: fieldsValue
    }, res => {
      if (res.status === 'ok') {
        this.loginSuccess(res.user, true);
        // this.getNoticeCount();
      } else {
        message.warn(res.message, 1);
      }
      this.setState({
        countState: true
      })
    });
  }
  //登陆成功回调
  loginSuccess = (data, t) => {
    // sessionStorage.setItem("userinfo", JSON.stringify({ data }))
    // sessionStorage.setItem("userLevel", data.userLevel)
    let level = Utils.getUserType(data.userLevel)
    // 判断是否已经过期，如果已经过期则更新用户级别
    let now = new Date().getTime();
    if ((level == 2 && now > data.diamondEndDate) || (level == 1 && now > data.vipEndDate)) {
      this.sendUpdateUserLevel(data);
      sessionStorage.setItem("userLevel", '1')
      data.userLevel = 1;
    } else {
      sessionStorage.setItem("userLevel", data.userLevel)
    }
    sessionStorage.setItem("userinfo", JSON.stringify({ data }))

    this.setState({
      loginStatus: true,
      userInfo: data,
      logRegVisible: false,
      redPacketModalVisible: false
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
    let isValid = Utils.isValid();
    let no = isValid ? Utils.getUserType() : 0;

    emitter.emit("callMe", data.userRealName, data);
    emitter.emit("updateUserLevel", no);
    this.loginNoticeCount();
    // this.getNoticeCount();
    // window.location.href = "/index";
  }

  loginNoticeCount = () => {
    if (sessionStorage.getItem("userinfo")) {
      let userinfot = sessionStorage.getItem("userinfo");
      if (userinfot != null) {
        let userObj = JSON.parse(userinfot);
        if (userObj != null && userObj.data != null) {
          let x = userObj.data.userId;
          let params = { userId: x }
          let REQUEST_URL = `/api/notice/getUnReadNoticeCount?${stringify(params)}&time` + new Date().getTime()
          request(REQUEST_URL, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }, this.afterLoginCall)
        }
      }
    }
  }

  afterLoginCall = (sr) => {
    sessionStorage.setItem('notifyNum', sr);
    // this.setState({ notifyCount: sr }, () => window.location.href = "/index");
    this.setState({ notifyCount: sr });
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

  //点击注册
  handlerRegistSubmit = () => {
    const { registAccount, registPasswd, registRePasswd, isCheckAgreement, verifyCode, inviteCode } = this.state;
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
      invitePeople: inviteCode,
    }
    const name = Utils.utfToUniCode(registAccount);
    fetch(`/api/user/register`, {
      credentials: 'include',
      method: 'post',
      headers: {
        'userName': name,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(fieldsValue)
    })
      .then(result => result.json())
      .then(tdata => {
        this.setState({
          countState: true,
          logRegVisible: false,
          redPacketModalVisible: false
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
  //获取验证码
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
    const name = Utils.utfToUniCode(registAccount);
    fetch(`/api/user/checkUserPropRepeat?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'userName': name,
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
              'userName': name,
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

  onClickStatus = (url) => {
    if (url == '/login') {
      this.setState({ logRegVisible: true });
    }
  }

  redPacketChange = () => {
    this.setState({ logRegVisible: true });
  }

  render() {
    const { pwdModalVisible, adminPwdModalVisible, redPacketModalVisible, feedbackContent, closeTime, showLoginPage, inviteCode,
      loginAccount, loginPasswd, registAccount, registPasswd, isRember, verifyCode, registRePasswd, isCheckAgreement, count, countState, } = this.state;
    let userinfot = sessionStorage.getItem("userinfo");
    const x = (userinfot != null && userinfot != undefined && userinfot != 'null') ? "/search/builderCompositeSearch" : "/login";
    const y = (userinfot != null && userinfot != undefined && userinfot != 'null') ? "/BuildCost/SingleInfo" : "/login";
    const z = (userinfot != null && userinfot != undefined && userinfot != 'null') ? "/person/PersonCust" : "/login";
    // const f = (userinfot != null && userinfot != undefined && userinfot != 'null') ? "/forum/Forum" : "/login";
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <React.Fragment>
        {/* {
          isMobil() ?  */}
        <LocaleProvider locale={zh_CN}>
          <section className="App">
            <div className="ddgo_head">
              <div className="ddgo_headBox">
                <div className="ddgo_login">
                </div>
                <div className="ddgo_menu">
                  <div className="ddgo_loginUser">
                    {showLoginPage ? this.renderLoginPage() : <div />}
                  </div>
                  <div className="ddgo_dividerLine"></div>
                  <ul>
                    <li><NavLink to="/index" activeClassName="index_menu_li_Color" >首页</NavLink></li>
                    {/*<li><NavLink to={x} activeClassName="index_menu_li_Color">查询入口</NavLink></li>*/}
                    <li><NavLink to={"/search/builderCompositeSearch"} activeClassName="index_menu_li_Color">查询入口</NavLink></li>
                    <li onClick={this.onClickStatus.bind(this, y)}><NavLink to={y} activeClassName="index_menu_li_Color">造价信息</NavLink></li>
                    {/*<li><NavLink to={f} activeClassName="index_menu_li_Color">互动论坛</NavLink></li>*/}
                    {/* <li>小程序<div className='ddgo_wechat'></div></li> */}
                    <li><NavLink to="/user" activeClassName="index_menu_li_Color">会员尊享</NavLink></li>
                    <li onClick={this.onClickStatus.bind(this, z)}><NavLink to={z} activeClassName="index_menu_li_Color">定制专栏</NavLink></li>
                    <li><NavLink to="/about" activeClassName="index_menu_li_Color">关于我们</NavLink></li>
                    {/*<li><NavLink to="/help" activeClassName="index_menu_li_Color">帮助中心</NavLink></li>*/}
                  </ul>
                </div>
              </div>
            </div>
            <Modal
              title="修改密码"
              visible={pwdModalVisible}
              closable={false}
              footer={null}
            >
              <ChangePwd
                cancelMethod={this.handlePwdModalVisible}
                handlePwdReset={this.handlePwdReset}
              />
            </Modal>
            <Modal
              title="管理员修改密码"
              visible={adminPwdModalVisible}
              closable={false}
              footer={null}
            >
              <ChangePwd
                cancelMethod={this.handleAdminPwdModalVisible}
                handlePwdReset={this.handleAdminPwdReset}
              />
            </Modal>

            {/* 进入官网弹出红包 */}
            <Modal
              visible={userinfot ? false : redPacketModalVisible }
              // visible={this.state.redPacketModalVisible}
              display={this.state.isLoading ? 'none' : 'block'}
              className='redPacketModal'
              onCancel={this.handleCancel}
              footer={null}
            >
              <div className='redPacket' onClick={this.redPacketChange}>
                <img src={require('./images/redPacket.png')}></img>
              </div>
            </Modal>

            {/* 登录 */}
            <Modal
              visible={this.state.logRegVisible}
              wrapClassName={"ddgo_LogReg_modal"}
              footer={null}
              onCancel={this.handleCancel}
              style={{ "textAlign": "right" }}
            >
              <div className="logRegModal">
                <Tabs defaultActiveKey="1" onChange={this.callback} className='logRegBox'>
                  <TabPane tab="登录" key="1">
                    <div className="inbgLoginBox">
                      <div className="inbgLoginSbumin" onKeyDown={this.loginKeyDown}>
                        <div className='logInputBox'>
                          <Icon type="user" />
                          <input type="text" value={loginAccount} onChange={this.changeLoginAccount} placeholder="请输入电话号码" />
                        </div>
                        <div className='logInputBox'>
                          <Icon type="unlock" />
                          <input type="password" value={loginPasswd} onChange={this.changeLoginPasswd} placeholder="请输入您的登录密码" />
                        </div>
                        <div>
                          <input type="checkbox" checked={isRember} value={isRember} onChange={this.changeIsRember} className="inbgLoginAgreement" />
                          <span> 记住密码 </span>
                        </div>
                        <button onClick={countState && this.handlerLoginSubmit}> 立即登录 </button>
                        <p>登录异常, 请清理浏览器缓存 <span> <NavLink to="/reset" >忘记密码？</NavLink></span></p>
                      </div>
                      <div className="inbgLoginWchatWay" >
                        <div onClick={() => this.setState({ logRegVisible: false })}>
                          <span>————&nbsp;&nbsp;</span>
                          <NavLink to="/wchat"><i></i></NavLink>
                          <span>&nbsp;&nbsp;————</span>
                        </div>
                        <p> 微信登录</p>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="注册" key="2">
                    <div className="inbgRegisterSbumin" onKeyDown={this.registKeyDown}>
                      <div className='logInputBox'>
                        <Icon type="user" />
                        <input type="text" value={registAccount} onChange={this.changeRegistAccount} placeholder="请输入电话号码" />
                      </div>
                      <div style={{ display: "flex" }}>
                        <div className='regInputBox'>
                          <Icon type="tablet" />
                          <input type="text" value={verifyCode} onChange={this.changeVerifyCode} placeholder="请输入验证码" />
                        </div>
                        <button className="getVerificationCode" ref="yzm" onClick={countState && this.getCaptha} disabled={count !== 0} >{count ? `${count} s` : '获取验证码'}</button>
                      </div>
                      <div className='logInputBox'>
                        <Icon type="unlock" />
                        <input type="password" value={registPasswd} onChange={this.changeRegistPasswd} placeholder="请输入您的登录密码" />
                      </div>
                      <div className='logInputBox'>
                        <Icon type="unlock" />
                        <input type="password" value={registRePasswd} onChange={this.changeRegistRePasswd} placeholder="请确认您的登录密码" />
                      </div>
                      <div className='logInputBox'>
                        <Icon type="inbox" />
                        <input type="text" value={inviteCode} onChange={this.changeInviteCode} placeholder="请输入邀请码(选填)" />
                      </div>
                      <p>
                        <input type="checkbox" value={isCheckAgreement} onChange={this.changeIsCheckAgreement} className="inbgRegisterAgreement" />
                        <span>我已看过并接受 <NavLink to="/agreement" target="_blank">《用户协议》</NavLink></span>
                      </p>
                      <button onClick={countState && this.handlerRegistSubmit}>立即注册</button>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Modal>

            <React.Fragment>
              <Layout>
                <Content>
                  <ScrollToTop>
                    <Switch>
                      <Route path='/' exact render={() => (<Redirect to='/index' />)} />
                      <Route path="/index" component={IndexCont2} />
                      {/*<Route path="/loginRegister" component={IndexCont} />*/}
                      <Route path="/search" component={search}>
                        <Route path="/builderCompositeSearch" component={BuilderCompositeSearch} />
                      </Route>

                      {/*<Route path="/builderCostInfo" component={BuilderCostInfo} />*/}
                      <Route path="/BuildCost" component={build}>
                        <Route path="/SingleInfo" component={SingleInfo} />
                      </Route>

                      <Route path="/user" component={user} />

                      <Route path="/news" component={news}>
                        <Route path="/ClassNews" component={ClassNews} />
                      </Route>

                      <Route path="/about" component={about} />
                      <Route path="/help" component={help} />

                      <Route path="/PersonCustomize" component={PersonCustomize} />
                      <Route path="/login" render={() => (<Redirect to='/index' />)} />
                      {/* <Route path="/register" component={register} /> */}
                      <Route path="/agreement" component={agreement} />

                      <Route path="/reset" component={reset} />
                      <Route path="/wchat" component={wchat} />
                      <Route path="/manager" component={UserManager} />

                      <Route path="/show/ente/:id" component={EnteInfo} />
                      <Route path="/show/enteByName/:name" component={EnteRedirect} />
                      <Route path="/person" component={PersonCont} />
                      <Route path="/show/person/:id" component={PersonInfo} />
                      {/* <Route path="/show/project/:id" component={ProjectInfo} /> */}
                      <Route path="/newsDetail/:id" component={NewDetail} />
                      <Route path="/bindwxToPhone/:code/:openId" component={BindWxTOPhone} />
                      <Route path="/pub/zhaobiao/:id" component={Zhaobiao} />
                      <Route path="/pub/zhongbiao/:id" component={Zhongbiao} />
                      <Route path="/pub/project/:id" component={ProjectNew} />
                      <Route path="/pub/projectNew/:id" component={Project} />
                      {/* <Route path="/loginregister" component={login_register}/> */}
                      <Route path='/' exact render={() => (<Redirect to='/index' />)} />
                      {/* <Route path="/loginreg" component={login_reg} /> */}
                      {/* <Route path="/loginCont" component={loginCont}/> */}
                    </Switch>
                  </ScrollToTop>
                </Content>
              </Layout>
              <FooterContent />
            </React.Fragment>

            <div className='ddgo_Feedback' onClick={this.showModal}>
              <ul>
                <li><Icon type="form" /></li>
                <li></li>
                <li>意见反馈</li>
              </ul>
              <div className='consult'>
                <p><Icon type="wechat" style={{ "color": "#51C332", "fontSize": "28px" }} /></p>
                <p>详情咨询微信</p>
                <p>19949463865</p>
              </div>

            </div>
            <Modal
              title="意见反馈"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              wrapClassName={"ddgo_Feedback_box_modal"}
              maskClosable={false}
            >
              <div className='ddgo_Feedback_box'>
                <p>您好，点点go建筑业大数据平台诚挚为您服务。产品咨询、会员咨询、工程项目合作、行业广告宣传、其他类咨询请联系我们的人工客服（手机微信同号）： 199-4946-3865；服务时间：周一至周五08:30-17:30。
                    其他非工作时间段，可能存在回复不及时的情况，请您谅解。 您也可以选择在 “意见栏”留下您的姓名、电话、公司名称信息，我们的专职客服人员将尽快与您联系，商讨合作事宜。</p>
                <TextArea placeholder="请填写您的建议" onChange={this.feedbackContentChange} rows={8} />
                <p>{`${feedbackContent.length}/500`}</p>
                <div className="clearfix">
                  <Upload
                    action="/api/config/feedback/pic/"
                    listType="picture-card"
                    accept=".jpg,.jpeg,.gif,.png,.bmp"
                    fileList={fileList}
                    showUploadList={{ showPreviewIcon: false }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                </div>

              </div>

            </Modal>
            {/* 系统维护Modal */}
            <Modal
              title="系统维护"
              // visible={userinfot ? this.state.sysMaintenance : false}
              wrapClassName='vertical-center-modal'
              visible={this.state.sysMaintenance}
              // closable={false}
              maskClosable={false}
              footer={null}
              // centered={true}
              onCancel={() => this.setState({ sysMaintenance: false })}
            >
              <div className='ddgo_sys_maintenance'>
                <p>尊敬的用户,您好!</p>
                <p>本系统于2019年08月08日15:00至2019年08月08日24:00系统维护升级,2019年08月09日恢复正常使用,由此给您带来的不便,敬请谅解。</p>
              </div>
            </Modal>

            {/* <Modal
            visible={this.state.growUpTipVisiable}
            title=""
            centered={true}
            closable={true}
            footer={null}
            onCancel={() => { this.setState({ growUpTipVisiable: false }); sessionStorage.setItem("showed", "true"); }}
            onOk={() => { sessionStorage.setItem("showed", "true") }}
            wrapClassName={"ddgo_app_banner"}
          >
            <p> <span>{closeTime}</span>秒后自动关闭...</p>
            <Button className='ddgo_app_banner_button' onClick={()=>{ this.setState({ growUpTipVisiable: false });sessionStorage.setItem("showed","true"); }}>关闭</Button>
            <div className='ddgo_app_banner_img'></div>
          </Modal> */}
          </section>

        </LocaleProvider>
        {/* :
             <Switch>
               <Route path='/' exact render={() => <Redirect to="/mobileReg" />} />
               <Route path="/mobileReg" component={mobilLoginRegister} />
              <Route path="/mobileLog" component={mobilLoginCont} />
               <Route path="/mobileSuc/:userRealName?/:enteAddress?/:enterpriseName?/" component={mobilLoginSuc} />
               <Route path="/mobileLogInfo" component={mobilLoginInfo} />
               <Route path="/mobilTwoCode" component={mobilTwoCode} />

            </Switch>
         } */}
      </React.Fragment>

    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};
export default App;
