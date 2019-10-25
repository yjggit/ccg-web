import React, { Component } from 'react';
import './personCont.css'
import { Icon } from 'antd';
import { NavLink, Route, Switch } from 'react-router-dom';
import PersonBasic from './personal/person_basic';
import PersonSelectMenber from './personal/person_select_member';   //成员管理
import PersonInvoice from './personal/person_invoice';  //发票管理
import PersonCust from './personal/person_cust';  //定制
import PersonContact from './personal/person_contact';  //联系
import PersonBusiness from './personal/person_business';  //业务
import NoticeInfo from './personal/person_notice';  //联系
import request from '../utils/request'

import emitter from "../event"

class PersonCont extends Component {

    state = {
        userName: '',
        userLevel: 0,
        isEnteAdmin: 0,
        enteId: 0,
        userType: 1,
    }
    componentWillUnmount() {
    }
    componentWillMount() {
        this.eventEmitter = emitter.addListener("callPersonConst", (name) => {
            this.setState({
                userName: name,
            })
        });
        let userId = null;
        let userinfot = sessionStorage.getItem("userinfo");
        if (userinfot != null && userinfot != undefined) {
            let userObj = JSON.parse(userinfot);
            if (userObj != null && userObj.data != null) {
                userId = userObj.data.userId;
            }
        }
        if (userId === null || userId === undefined) {
            return;
        }
        request(`/api/user/currentUser/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.callback1)
    }
    callback1 = (data) => {
        if (data == null || data == undefined) {
            sessionStorage.removeItem("userinfo");
        } else {
            this.setState({ userName: data.userRealName, userLevel: data.userLevel, isEnteAdmin: data.isEnterAdmin, enteId: data.enteId, userType: data.userType });
        }
    }

    render() {
        const vipLevel = ['普通会员', 'vip会员1年', 'vip会员2年', 'vip会员3年', '钻石会员1年', '钻石会员2年', '钻石会员3年']
        const { userName, userLevel } = this.state;
        let le = userLevel;
        if (le >= 1) {
            le = userLevel - 1;
        }
        return (
            <section id='personCont'>
                <div>
                    <div id='personTitel'>
                        <div>
                            <p>{userName}</p>
                            <p>{vipLevel[le]}</p>
                        </div>
                        <ul>
                            <li><NavLink activeClassName="personActive" to="/person/personIndex"> <Icon type="idcard" /> 基本信息 </NavLink>
                            </li>
                            <li style={{ display: this.state.isEnteAdmin > 1 && this.state.enteId > 1 && this.state.userType == 2 ? 'block' : 'none' }}><NavLink activeClassName="personActive" to="/person/personMember" > <Icon type="team" /> 成员管理</NavLink>
                            </li>
                            <li style={{ display: this.state.isEnteAdmin > 1 && this.state.enteId > 1 && this.state.userType == 2 ? 'block' : 'none' }}><NavLink activeClassName="personActive" to="/person/personInvoice" ><Icon type="profile" /> 发票管理</NavLink>
                            </li>
                            <li><NavLink activeClassName="personActive" to="/person/PersonCust"><Icon type="tags-o" />我的定制</NavLink>
                            </li>
                            <li><NavLink activeClassName="personActive" to="/person/personBusiness"><Icon type="bar-chart" />我的业务</NavLink>
                            </li>
                            <li><NavLink activeClassName="personActive" to="/person/personContact"><Icon type="customer-service" />联系我们</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div id='personResult'>
                        <Switch>
                            <Route path="/person/personIndex" component={PersonBasic} />
                            <Route path="/person/PersonCust" component={PersonCust} />
                            <Route path="/person/personMember" component={PersonSelectMenber} />
                            <Route path="/person/personContact" component={PersonContact} />
                            <Route path="/person/personBusiness" component={PersonBusiness} />
                            <Route path="/person/personInvoice" component={PersonInvoice} />
                            <Route path="/person/notice" component={NoticeInfo} />
                            <Route path="/" component={PersonBasic} />
                        </Switch>
                    </div>
                </div>
            </section>
        )
    }
}

export default PersonCont;