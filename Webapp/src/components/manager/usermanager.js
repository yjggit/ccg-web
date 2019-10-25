import React, { Component } from 'react';
import { message, Menu, Icon, Button } from 'antd';
import { NavLink, Route, Switch } from 'react-router-dom';
import UserInfo from './userman/index';
import SpecifyList from './specifyManager/index';
import InvoiceManageList from './invoice/index';
import NewsManageList from './newsmanage/index';
import ConfigInfo from './configInfo/index';
import LogsList from './logman/index';
import CompanyInfo from './companyInfo';
import AchievementInfo from './achievementInfo';
import RoleManagement from './roleManagement/RoleManagement';
import MenuManagement from './menuManagement/MenuManagement';
import roleMenuManagement from './roleMenuManagement/roleMenuManagement';
import BusinessInfo from "./businessInfo";
import PlatformMonitorSys from "./platformMonitorSys";
import UserLogCat from "./userLogCat";

import Welcome from './welcome';
import emitter from "../../event"
import './usermanager.css'
import request from '../../utils/request';

const { SubMenu } = Menu;

class UserManager extends Component {
    state = {
        mode: 'inline',
        theme: 'light',
        username: '',
        password: '',
        buttondisable: true,
        loginstate: false,
    }

    changeMode = (value) => {
        this.setState({
            mode: value ? 'vertical' : 'inline',
        });
    }

    changeTheme = (value) => {
        this.setState({
            theme: value ? 'dark' : 'light',
        });
    }
    userNameOnChange = (e) => {
        this.setState({
            username: e.target.value,
        });
    }
    passwordOnChange = (e) => {
        this.setState({
            password: e.target.value,
        });
    }

    keyDown = (e) => {
        if (e.keyCode == 13) {
            this.handleSubmit(e);
        }
    }

    handleSubmit = (e) => {
        let userName = this.refs.userName.value;
        let password = this.refs.password.value;
        if (userName === null || userName === '') {
            message.info('请输入账号', 1);
            return;
        }
        if (password == null || password === '') {
            message.info('请输入密码', 1);
            return;
        }
        let fieldsValue = {
            userName,
            password,
        };
        if (this.refs.loginbtn) {
            this.refs.loginbtn.style.backgroundColor = "#2279c9";
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
        this.setState({ username: fieldsValue.userName, password: fieldsValue.password, buttondisable: false });
        request(`/api/admin/login`, newOptions, this.handleLoginRes)
    }
    handleLoginRes = (data) => {
        this.setState({ loading: false, buttondisable: false });
        //跳转到主页面，写session
        if (data.status === 'ok') {
            this.loginSuccess(data.adminInfo, true);
        } else {
            this.setState({ buttondisable: true })
            if (this.refs.loginbtn) {
                this.refs.loginbtn.style.backgroundColor = "#348bda";
            }
            message.success(`${data.message}`);
        }
    }
    loginSuccess = (data, t) => {
        sessionStorage.setItem("admininfo", JSON.stringify({ data }))
        this.setState({ loginstate: true });
        emitter.emit("adminLoginCallMe", data.adminName);
    }

    render() {
        const { username, password, buttondisable, loginstate } = this.state;
        let currentUserName = '';
        let loginstatestr = loginstate;
        let adminType = 0;
        let xx = sessionStorage.getItem("admininfo")
        if (xx != null) {
            loginstatestr = true;
            let adminObj = JSON.parse(xx);
            if (adminObj != null && adminObj.data != null) {
                adminType = adminObj.data.adminType;
            }
        }
        if (loginstatestr == false) {
            return (
                <div id="userMangerPage">
                    <div id="mangerLoginBox">
                        <h2>账号登录</h2>
                        <div id="mangerNum" onKeyDown={this.keyDown}>
                            <input type="text" id="userName" ref="userName" placeholder="用户名" value={username}
                                onChange={this.userNameOnChange} />
                            <input type="password" id="password" ref="password" placeholder="密码" value={password}
                                onChange={this.passwordOnChange} />
                            <button ref="loginbtn" type="submit" onClick={buttondisable && this.handleSubmit}>登录
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div id='mangerCont'>
                        <div id='mangerTitel'>

                            {
                                (adminType === 1 || adminType === 2) && (<ul>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/UserInfo">
                                            用户管理
                                        </NavLink></li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/logInfo">
                                            日志管理
                                        </NavLink></li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/companyInfo">
                                            公司管理
                                        </NavLink></li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/achievementInfo">
                                            业绩管理
                                        </NavLink></li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/userLogCat">
                                            用户日志管理
                                        </NavLink></li>
                                    {/*<li>*/}
                                    {/*    <NavLink activeClassName="mangerTitelA" to="/manager/platformMonitorSys">*/}
                                    {/*        平台监控管理*/}
                                    {/*    </NavLink></li>*/}
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/businessInfo">
                                            业务管理
                                        </NavLink></li>
                                    <li>
                                        <Menu
                                            mode="inline"
                                        >
                                            <SubMenu
                                                key="sub1"
                                                style={{ "color": "#232323" }}
                                                className="authorSub"
                                                title={
                                                    <span>
                                                        <span style={{ "marginLeft": "10px" }}>权限管理</span>
                                                    </span>
                                                }
                                            >
                                                <Menu.Item key="1" className="authorMenu">
                                                    <NavLink activeClassName="mangerTitelA" to="/manager/roleManagement">
                                                        角色管理
                                                    </NavLink>
                                                </Menu.Item>
                                                <Menu.Item key="2" className="authorMenu">
                                                    <NavLink activeClassName="mangerTitelA" to="/manager/menuManagement">
                                                        菜单管理
                                                    </NavLink>
                                                </Menu.Item>
                                                <Menu.Item key="3" className="authorMenu">
                                                    <NavLink activeClassName="mangerTitelA" to="/manager/roleMenuManagement">
                                                        角色菜单权限管理
                                                    </NavLink>
                                                </Menu.Item>
                                            </SubMenu>
                                        </Menu>
                                    </li>
                                </ul>)

                            }
                            {
                                (adminType === 1 || adminType === 3) && (<ul>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/SpecifyInfo">
                                            更新管理
                                            </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/news">
                                            资讯管理
                                            </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/config">
                                            系统配置
                                            </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/companyInfo">
                                            公司管理
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="mangerTitelA" to="/manager/achievementInfo">
                                            业绩管理
                                        </NavLink>
                                    </li>
                                </ul>
                                )
                            }
                            {
                                (adminType === 4) && (<ul>
                                        <li>
                                            <NavLink activeClassName="mangerTitelA" to="/manager/userLogCat">
                                                用户日志管理
                                            </NavLink></li>
                                        <li>
                                            <NavLink activeClassName="mangerTitelA" to="/manager/businessInfo">
                                                业务管理
                                            </NavLink></li>
                                    </ul>
                                )
                            }

                        </div>
                        <div id='mangerTitelResult'>
                            <Switch>
                                <Route path="/manager/UserInfo" component={UserInfo} />
                                <Route path="/manager/SpecifyInfo" component={SpecifyList} />
                                <Route path="/manager/logInfo" component={LogsList} />
                                <Route path="/manager/InvoiceManageList" component={InvoiceManageList} />
                                <Route path="/manager/news" component={NewsManageList} />
                                <Route path="/manager/config" component={ConfigInfo} />
                                <Route path="/manager/companyInfo" component={CompanyInfo} />
                                <Route path="/manager/achievementInfo" component={AchievementInfo} />
                                <Route path="/manager/businessInfo" component={BusinessInfo} />
                                <Route path="/manager/platformMonitorSys" component={PlatformMonitorSys} />
                                <Route path="/manager/userLogCat" component={UserLogCat} />
                                <Route path="/manager/roleManagement" component={RoleManagement} />
                                <Route path="/manager/menuManagement" component={MenuManagement} />
                                <Route path="/manager/roleMenuManagement" component={roleMenuManagement} />
                                <Route path="/" component={Welcome} />
                            </Switch>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default UserManager;
