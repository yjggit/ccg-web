import React, { Component } from 'react';
import {NavLink, Route, Switch, Redirect} from 'react-router-dom';
import { message, Modal } from 'antd';
import './login_register.css';
import { stringify } from 'qs';
import PropTypes from "proptypes"
import request from '../../utils/request';

class LoginRegister extends Component {

    constructor() {
        super();
    };

    state = {
        accountStatus: false,
        count: 0,
        pwdStatus: false,
        conpwdStatus: false,
        buttondisable: false,

        loading: false,
        visible: false,
        isMobile: true
    }

    onGetCaptcha = () => {
        let account = this.refs.account.value;
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
                        accountStatus: false,
                    })
                    return;
                } else {
                    this.setState({
                        accountStatus: true,
                    })
                    this.refs.yzmbtn.style.backgroundColor = "#a9b0bd";
                    let count = 59;
                    this.setState({ count });
                    this.interval = setInterval(() => {
                        count -= 1;
                        this.setState({ count });
                        if (count === 0) {
                            if (this.refs.yzmbtn != undefined && this.refs.yzmbtn != null) {
                                this.refs.yzmbtn.style.backgroundColor = "#348bda";
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
            });
    };

    toLogin = () => {
        this.props.redirectLogin();
    }
    accountChange = (e) => {
        this.setState({
            buttondisable: false,
        })

        let account = e.target.value;
        if (account == null || account == '') {
            message.info('手机号为必填项', 1);
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
            }

        }
        const params = { phoneNo: account };

        request(`/api/user/checkUserPropRepeat?${stringify(params)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.c1)
    }
    c1 = (data) => {
        if (data.status != 'ok') {
            message.info('该手机号已被注册', 1);
            this.setState({
                accountStatus: false,
            })
        } else {
            this.setState({
                accountStatus: true,
            })
        }
    }
    checkPasswordInput = (e) => {
        this.setState({
            buttondisable: false,
        })
        let pwd = e.target.value;
        if (pwd == null || pwd == '') {
            this.setState({
                pwdStatus: false,
            })
            message.info('密码为必填项', 1);
            return;
        } else if (pwd.length < 6) {
            message.info('密码长度不低于6', 1);
            this.setState({
                pwdStatus: false,
            })
        } else {
            this.setState({
                pwdStatus: true,
            })
        }
    };
    checkpasswordRepeat = (e) => {
        this.setState({
            buttondisable: false,
        })
        let pwd = e.target.value;

        if (pwd == null || pwd == '') {
            this.setState({
                conpwdStatus: false,
            })
            message.info('确认密码为必填项', 1);
            return;
        }
        let confirmPassword = this.refs.password.value;
        if (pwd !== confirmPassword) {
            this.setState({
                conpwdStatus: false,
            })
            message.info('两次密码输入不一致', 1);
            return;
        } else {
            this.setState({
                conpwdStatus: true,
            })
        }

    };
    protoCheck = (e) => {
        this.setState({
            buttondisable: false,
        })
        let checked = e.target.checked;
        console.log("checked:" + checked);

    };

    regiserUser = (e) => {

        let account = this.refs.account.value;
        let yzm = this.refs.yzm.value;
        let password = this.refs.password.value;
        let confirmPassword = this.refs.confirmPassword.value;
        let protoCheck = this.refs.checkbox.checked;
        const { accountStatus, pwdStatus, conpwdStatus } = this.state;
        if (!accountStatus) {
            message.info('账号信息有误，请重新填写', 1);
            return;
        }
        if (!pwdStatus) {
            message.info('密码信息有误，请重新填写', 1);
            return;
        }
        if (!conpwdStatus) {
            message.info('确认密码信息有误，请重新填写', 1);
            return;
        }
        if (!protoCheck) {
            message.info('您必须同意本协议', 1);
            return;
        }
        var fieldsValue = {
            phoneNo: account,
            password,
            captcha: yzm,
        }

        const defaultOptions = {
            credentials: 'include',
            method: 'post',
            body: { ...fieldsValue },
        };
        const newOptions = { ...defaultOptions, };
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
        this.setState({
            buttondisable: true,
        })
        fetch(`/api/user/register`, newOptions)
            .then(result => result.json())
            .then(data => this.rgiserSuccess(account, data));
    }
    rgiserSuccess = (account, tdata) => {
        if (tdata.status === 'ok') {
            let history = this.context.router.history;
            let data = tdata.user;
            console.log(data)
            sessionStorage.setItem("userinfo", JSON.stringify({ data }))
            message.success(`恭喜您：${account}，您已注册成功`, 1);
            history.push(`/mobileSuc/${data.userRealName}/${data.enteAddress}/${data.enterpriseName}`);

        } else {
            message.info(`注册失败:${tdata.message}`, 1);
        }


    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    keyDown = (event) => {
        if (event.keyCode == 13) {
            this.regiserUser();
        }
    }

    render() {
        const { buttondisable, count, visible } = this.state;
        return (
            <div id="login_reg">
                <div id="login_register" onKeyDown={this.keyDown}>
                    <h2>欢迎成为会员</h2>
                    <div>
                        <input type="text" c id="account" ref="account" placeholder="请输入手机号" onBlur={this.accountChange} />
                        <div>
                            <input type="text" id="yzm" ref="yzm" placeholder="请输入验证码" />
                            <button ref="yzmbtn" onClick={count == 0 && this.onGetCaptcha}>{count ? `${count} s` : '获取验证码'}</button>
                        </div>
                        <input type="password" ref="password" id="password" placeholder="请输入密码" onBlur={this.checkPasswordInput} />
                        <input type="password" ref="confirmPassword" id="confirmPassword" placeholder="请确认密码" onBlur={this.checkpasswordRepeat} />
                        <p>
                            <input type="checkbox" ref="checkbox" id="checkBox" onClick={this.protoCheck} />
                            我已看过并接受
                        <span onClick={this.showModal} className="usersText">《用户协议》</span>
                            <Modal
                                visible={visible}
                                title="《用户协议》"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                maskClosable={true}
                                width={740}
                                footer={[
                                ]}
                            >
                                <p className="userAgreement">欢迎您使用四川智网多彩科技有限公司的点点go平台服务！（以下简称“智网多彩科技”，也简称“点点go”）</p>
                                <h3 className="userAgreement">一.引言</h3>
                                <h4 className="userAgreement">1.1.宗旨</h4>
                                <p className="userAgreement">四川智网多彩科技有限公司所开发、运营的大数据软件平台点点go是一款致力于运用互联网大数据分析，服务于建筑行业、解决建筑企业信息不对称、盘活企业沉淀资产、提高企业效益的资源共享信息平台。</p>
                                <h4 className="userAgreement">1.2.协议</h4>
                                <p className="userAgreement">1.2.1为使用点点go平台服务（以下简称“本服务”），您应当阅读并遵守《用户协议》（以下简称:本协议）。本协议自开始使用网站，并成为网站的会员时即产生法律效力。智网多彩科技可能会更新协议内容，并通过网站公告来通知用户。更新结果将在智网多彩科技通知之日起生效。协议包括点点go网站内容的使用政策、隐私政策。您在使用点点go提供的服务之前，请您务必审慎阅读、充分理解各条款内容，以及开通或使用某项服务的单独协议、规则。如您不同意本协议公约或随时对其的修改，您可以主动取消点点go提供的服务；您一旦使用本服务，即视为您已了解并完全同意本服务公约各项内容，并成为点点go的用户（以下简称“用户”）。
                                1.2.2智网多彩科技有权在必要时可修改用户协议，如果不同意所改动的内容，用户有权停止使用网络服务。如果用户继续使用网络服务，则视为接受服务条款的变动。
                                1.2.3智网多彩科技保留修改或中断服务的权利。对于任何网络服务的修改、中断或终止而造成的任何损失，智网多彩科技无需对用户或第三方承担任何责任。
                            </p>
                                <h3 className="userAgreement">二. 会员服务条款及义务</h3>
                                <h4 className="userAgreement">2.1. 服务资格</h4>
                                <h5 className="userAgreement">为使用“服务”，您同意:</h5>
                                <p className="userAgreement">2.1.1 您必须满足18岁，请未成年人（18岁以下）勿向本网站提供任何个人资料或使用本服务。</p>
                                <p className="userAgreement">2.1.2智网多彩科技有根据法律法规或在合理状况下限制您使用“服务”的权利。</p>
                                <h4 className="userAgreement">2.2.会员资格</h4>
                                <p className="userAgreement">2.2.1用户账号、密码及完成本服务的注册程序之后，您将拥有一个账号及密码。保护账号及密码机密安全，是您的责任。您应对所有用您的账号及密码的使用情况负完全的责任。您同意∶</p>
                                <p className="userAgreement">2.2.1.1您的账号或密码遭到未获授权的使用，或者发生其他任何安全问题时，您将立即通知点点go；</p>
                                <p className="userAgreement">2.2.1.2一个账户同时只能在一台设备上使用。用户每次使用完毕，请安全退出并把您的账号关掉。如您未能依前述规定行事，对于任何人利用该账号及密码及您不当操作所进行的任何行为造成的任何后果，您应负完全的责任。因此而产生的任何损失或损害，点点go不承担任何责任。</p>
                                <h4 className="userAgreement">2.3.成为会员</h4>
                                <p className="userAgreement">2.3.1您必须先填写真实、准确信息注册成为点点go用户。您所填写的内容与个人资料必须真实有效，否则我们有权拒绝您的申请或撤销您的会员资格，并不予任何赔偿或退还会员服务费。会员的个人资料发生变化时，应及时修改注册的个人资料，否则由此造成的会员权利不能全面有效行使的责任由会员自己承担，点点go有权因此取消您的会员资格，并不予退还会员费或其他任何形式的任何赔偿。</p>
                                <p className="userAgreement">2.3.2用户可通过各种已有和未来新增的渠道成为点点go用户，通过点点go提示的方式进行支付，成为会员。在用户使用具体某种方式成为会员时，须阅读并确认接受相关的服务条款和使用方法。智网多彩科技在此声明：未授权任何第三方销售点点go会员，也未在任何第三方平台销售点点go会员，任何通过点点go渠道外购买的账户，智网多彩科技有权回收，并有权追究其法律责任。</p>
                                <p className="userAgreement">2.3.3点点go会员账号所有权归智网多彩科技所有，会员拥有点点go账号的有限使用权。成为会员后，您有权利不接受本服务，可联系客服取消会员服务，已经产生的服务费由用户自行承担。</p>
                                <h4 className="userAgreement">2.4.服务说明及账号查询</h4>
                                <p className="userAgreement">2.4.1当会员使用本服务时，会员的使用行为视为其对服务的服务条款以及智网多彩科技在服务中发出各类公告的同意。</p>
                                <p className="userAgreement">2.4.2您应自行负责妥善且正确地保管、使用、维护您在点点go申请取得的账户、账户信息及账户密码。非因智网多彩科技原因致使您账户密码泄漏以及因您保管、使用、维护不当造成损失的，智网多彩科技无须承担与此有关的任何责任。</p>
                                <p className="userAgreement">2.4.3智网多彩科技不对您因第三方的行为或不作为造成的损失承担任何责任，包括但不限于支付服务和网络接入服务、任意第三方的侵权行为。</p>
                                <p className="userAgreement">2.4.4一旦您成为点点go会员，即视为您认可服务标明之价格；成为会员后，服务即时生效。会员的增值服务标准以点点go网站上标注的详细资费标价为准。您可以通过登录会员中心免费查询您的账号信息详情。</p>
                                <h4 className="userAgreement">2.5会员的义务</h4>
                                <p className="userAgreement">2.5.1会员服务有固定的服务使用期限，您一旦成为会员即视为认可它的服务使用期限。会员服务仅限于申请账号自行使用；会员服务期内不能在点点go账号之间转移，禁止赠与、借用、转让或售卖。否则智网多彩科技有权在未经通知会员的情况下取消转让账户、受让账户的会员服务资格，由此带来的损失由会员自行承担。</p>
                                <p className="userAgreement">2.5.2若会员的行为持续违反本协议或违反国家相关法律法规，或智网多彩科技认为会员行为有损点点go或他人的声誉及利益，我们有权取消该会员的会员资格而无须给与任何补偿。</p>
                                <p className="userAgreement">2.5.3点点go内所有的数据来源于已公开的信息，仅供用户查询之用。用户不能将相关信息用于买卖、交换等用途，若由此引起的任何纠纷由行为人承担，智网多彩科技不承担任何责任。</p>
                                <h4 className="userAgreement">2.6. 服务通知</h4>
                                <p className="userAgreement">点点go会通过发布在网站上的通告向新用户介绍本服务的各种功能及数据更新信息。</p>
                                <h3 className="userAgreement">三.免责声明与其它担保</h3>
                                <h4 className="userAgreement">3.1.免责声明</h4>
                                <p className="userAgreement">3.1.1智网多彩科技对由于政府禁令、现行生效的适用法律或法规的变更、火灾、地震、动乱、战争、停电、通讯线路中断、黑客攻击、计算机病毒侵入或发作、电信部门技术调整、因政府管制而造成网站的暂时性关闭等任何影响网络正常运营的不可预见、不可避免、不可克服和不可控制的事件（“不可抗力事件”），以及他人蓄意破坏、智网多彩科技工作人员的疏忽或不当使用，正常的系统维护、系统升级，或者因网络拥塞而导致本网站不能访问而造成的本网站所提供的信息及数据的延误、停滞或错误，以及使用者由此受到的一切损失不承担任何责任。</p>
                                <p className="userAgreement">3.1.2使用点点go的“服务”时，您可能会看到不准确、不完整、过时、有误导性、非法、冒犯性或有害的内容或信息。智网多彩科技难以审查所有内容或信息是否属于上述情况。我们平台仅就用户提交的查询请求做识别应答，查询到的内容是否相符由用户负责掌握和判断。我们平台没有义务对于查询结果本身的真实性进行分辨或核验。平台返回的数据结果，不构成我们对任何人之明示或暗示的观点或保证。查询的结果请以官方网站公布为准。故，您同意，我们不对第三方 (包括其他用户) 提供的内容或信息负责，也不对您因使用或参考该内容或信息而造成的损失负责。如您认为点点go网站上存在上述内容或信息的，请及时根据法律法规规定的程序通知智网多彩科技，以便及时处理。</p>
                                <p className="userAgreement">3.1.3点点go会根据法律规定或政府相关政策要求提供您的个人信息。</p>
                                <p className="userAgreement">3.1.4 因网络状况、通讯线路、第三方网站等任何原因而导致您不能正常使用点点go。</p>
                                <p className="userAgreement">3.1.5点点go在各服务条款及声明中列明的使用方式或免责情形。</p>

                                <h4 className="userAgreement">3.2.无担保</h4>
                                <h5 className="userAgreement">3.2.1 “智网多彩科技”无法保证包括但不限以下事项∶</h5>
                                <p className="userAgreement">3.2.1.1本服务完全符合您的要求；</p>
                                <p className="userAgreement">3.2.1.2本服务不受干扰、及时提供、安全可靠或不会出错；</p>
                                <p className="userAgreement">3.2.1.3使用本服务取得之结果正确可靠；。</p>
                                <p className="userAgreement">3.2.1.4用户经由本服务取得之任何产品、服务、资讯或其他信息符合您的期望；</p>
                                <p className="userAgreement">3.2.1.5本服务中的软件任何错误都得到更正。</p>
                                <p className="userAgreement">3.2.1.6不对用户在本服务中相关数据的删除和储存失败负责；</p>
                                <p className="userAgreement">3.2.1.7由于不可抗拒因素可能引起的用户信息丢失、泄露等风险；</p>
                                <p className="userAgreement">3.2.1.8用户发布的内容被他人转发、分享，因此等传播可能带来的风险和责任；</p>
                                <p className="userAgreement">由于网络信号不稳定、网络带宽小等网络因素，所引起的登录失败、资料同步不完整、页面打开速度慢等风险</p>
                                <h5 className="userAgreement">3.2.2</h5>
                                <p className="userAgreement">是否使用本服务应由您自行考量且自负风险，因任何资料之下载而导致的您电脑系统之任何损坏或数据流失等后果，由您自行承担。</p>

                                <h5 className="userAgreement">3.2.3</h5>
                                <p className="userAgreement">您至智网多彩科技或经由本服务取得的任何建议或信息，无论是书面或口头形式，除非本服务条款有明确规定，将不构成本服务条款以外之任何保证。
                                当您同意该协议时，默认您已经同意以上无担保条款。
                            </p>

                                <h3 className="userAgreement">四.服务终止</h3>
                                <p className="userAgreement">4.1. 用户或智网多彩科技可根据实际情况中断服务。</p>
                                <p className="userAgreement">4.2. 智网多彩科技不需对任何个人或第三方负责而中断服务。用户若反对任何服务条款的建议或对后来的条款修改有异议，或对本服务不满，用户可有以下的追索权：</p>
                                <p className="userAgreement">4.2.1不再使用本服务；</p>
                                <p className="userAgreement">4.2.2通告点点go停止该用户的服务。</p>
                                <p className="userAgreement">4.3.结束本服务后，用户使用本服务的权利马上终止。同时，点点go不再对用户承担任何义务。</p>
                                <h3 className="userAgreement">五. 会员纠纷</h3>
                                <p className="userAgreement">智网多彩科技保留权利，但没有责任监督、处理您和其他会员之间的纠纷。</p>
                                <h3 className="userAgreement">六. 用户行为</h3>
                                <h4 className="userAgreement">6.1.应做事项</h4>
                                <p className="userAgreement">如果您同意该项协议，则默认您遵守以下内容：</p>
                                <p className="userAgreement">6.1.1遵守法律、法规及有关部门规章的；</p>
                                <p className="userAgreement">6.1.2提供准确信息，并及时更新信息；</p>
                                <p className="userAgreement">6.1.3在档案使用真实姓名；</p>
                                <p className="userAgreement">6.1.4以专业的态度使用“服务”。</p>

                                <h4 className="userAgreement">6.2.禁止事项</h4>
                                <p className="userAgreement">如果您同意该项协议，则默认您承诺不做以下行为：</p>
                                <p className="userAgreement">6.2.1上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息（包括但不限于图片、文字、视频、链接、音乐等）：</p>
                                <p className="userAgreement">6.2.1.1反对宪法所确定的基本原则的；</p>
                                <p className="userAgreement">6.2.1.2危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
                                <p className="userAgreement">6.2.1.3损害国家荣誉和利益的；</p>
                                <p className="userAgreement">6.2.1.4煽动民族仇恨、民族歧视、破坏民族团结的；</p>
                                <p className="userAgreement">6.2.1.5破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
                                <p className="userAgreement">6.2.1.6散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
                                <p className="userAgreement">6.2.1.7散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
                                <p className="userAgreement">6.2.1.8侮辱或者诽谤他人，侵害他人合法权利的；</p>
                                <p className="userAgreement">6.2.1.9含有虚假、欺诈、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、与公序良俗不符或其它道德上令人反感的内容；</p>
                                <p className="userAgreement">6.2.1.10含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的。</p>
                                <p className="userAgreement">6.2.2为任何非法目的而使用网络服务系统；</p>
                                <p className="userAgreement">6.2.3恶意注册点点go账号；</p>
                                <p className="userAgreement">6.2.4利用本服务从事以下活动：</p>
                                <p className="userAgreement">6.2.4.1未经书面允许，进入计算机信息网络或者使用计算机信息网络资源的；</p>
                                <p className="userAgreement">6.2.4.2未经书面允许，对计算机信息网络功能进行删除、修改或者增加的；</p>
                                <p className="userAgreement">6.2.4.3未经书面允许，进入计算机信息网络中对存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</p>
                                <p className="userAgreement">6.2.4.4故意制作、传播计算机病毒（包括木马）等破坏性程序，盗取其他用户账户、密码、隐私、操控他人电脑的；</p>
                                <p className="userAgreement">6.2.4.5其他危害计算机信息网络安全的行为。</p>
                                <p className="userAgreement">6.2.5未经书面允许，利用点点go平台从事广告发布、变相广告、口碑营销、产品销售、传销等行为。</p>
                                <p className="userAgreement">6.2.6对点点go相关服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于任何其它商业目的。</p>
                                <p className="userAgreement">6.2.7为点点go的竞争同行回应职位、招揽用户，或用此方法寻求与发布职位的雇主联络业务。</p>
                                <p className="userAgreement">6.2.8未经智网多彩科技同意，给公布信息的个人或公司发电子邮件、打电话、寄信或以其他方式进行擅自接触。</p>

                                <h3 className="userAgreement">七、知识产权声明</h3>
                                <p className="userAgreement">7.1.智网多彩科技是本软件的知识产权权利人，本网站（www.ddgo8.com）的一切著作权、商标权、专利权、商业秘密等知识产权，以及与本软件相关的所有信息内容（包括但不限于文字、图片、音频、视频、图表、界面设计、电子文档、版面框架、有关数据等）的所有知识产权（包括但不限于版权、商标权、专利权、商业秘密）及相关权利，均归智网多彩科技所有。</p>
                                <p className="userAgreement">7.2.未经智网多彩科技书面同意，任何个人或组织不得为任何商业或非商业目的的任何第三方实施、利用、转让上述知识产权；否则，智网多彩科技将依法追究法律责任。</p>

                                <h3 className="userAgreement">八．用户隐私</h3>
                                <p className="userAgreement">智网多彩科技绝对尊重用户的个人隐私权，绝不会公开、编辑、透漏用户的任何资料给第三方，除非有法律和政府的强制规定或是用户本人的同意。</p>
                                <h3 className="userAgreement">九．法律管辖与适用</h3>
                                <p className="userAgreement">9.1.本协议的生效、履行、解释及争议的解决均适用中华人民共和国法律；您同意有关本协议以及使用点点go的服务产生的争议交由四川智网多彩科技有限公司住所地法院以诉讼方式解决。</p>
                                <p className="userAgreement">9.2.您理解并同意，根据服务的升级，我们有权对本协议进行更改。我们会在我们的网站及相关软件产品中公告相关的更改，请您随时予以关注。在本协议修改之后，您继续使用点点go及相关服务的行为，将表示您已经同意并接受了本协议的更改。</p>
                                <h3 className="userAgreement">十. 其他</h3>
                                <p className="userAgreement">10.1本协议条款的最终解释权归四川智网多彩科技有限公司所有。</p>
                                <p className="userAgreement">10.2本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。（正文完）</p>
                                <p className="userAgreement">您确认已仔细阅读以上条款，同时完全接受以上条款的内容。</p>


                            </Modal>
                        </p>
                        <button className="but" type="button" onClick={!buttondisable && this.regiserUser}>确认注册</button>
                    </div>
                    <p id="register_but" ><NavLink to="/mobileLog">去登录 » </NavLink></p>
                </div>
            </div>

        )
    }
}
LoginRegister.contextTypes = {
    router: PropTypes.object.isRequired
};
export default LoginRegister;