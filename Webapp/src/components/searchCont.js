import React, { Component } from 'react';
import './searchCont.css'
import { Icon, Badge } from 'antd';

import {  NavLink,Route, Switch } from 'react-router-dom';

import BuilderCompositeSearch from './search/ddgo_comprehensive_search';
import BuilderSimpleSearch from './search/enterprise/BuilderSimpleSearch';
import BuilderPersonSearch from './search/enterprise/BuilderPersonSearch';
import BuilderPerformSearch from './search/enterprise/BuilderPerformSearch';
import BuilderCreditSearch from './search/ddgo_credit_search';
import EnterpriseBidInviteSearch from './search/bid/EnterpriseBidInviteList';
import EnterpriseBidresult from './search/bid/EnterpriseBidresult';

class Search extends Component{


    render(){
        return(
            <div>
                 <div id='searchCont'>
                    <div id='searchTitel'>
                        <ul>
                            <li>
                                <NavLink to="/search/builderCompositeSearch"  activeClassName="changeColor">
                                    <Icon type="appstore-o" />
                                    组合查询
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/builderSimpleSearch">
                                    <Icon type="home"/>
                                    企业查询
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/builderPersonSearch">
                                    <Icon type="contacts"/>
                                    人员查询
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/enterpriseBidInviteSearch">
                                    <Icon type="flag"/>
                                    {/*<Badge style={{marginLeft: 20}} count={<span>免费</span>}>*/}
                                    招标公告
                                    {/*</Badge>*/}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/enterpriseBidResultSearch">
                                    <Icon type="schedule"/>
                                    {/*<Badge style={{marginLeft: 20}} count={<span>免费</span>}>*/}
                                    中标信息
                                    {/*</Badge>*/}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/BuilderPerformSearch">
                                    <Icon type="dot-chart"/>
                                    业绩查询
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="changeColor" to="/search/BuilderCreditSearch">
                                    <Icon type="like-o"/>
                                    信用查询
                                </NavLink>
                            </li>
                        </ul>

                    </div>
                    <div id='searchResult'>
                        <Switch>
                            <Route path="/search/builderPersonSearch" component={BuilderPersonSearch} />
                            <Route path="/search/builderSimpleSearch" component={BuilderSimpleSearch} />
                            <Route path="/search/builderPerformSearch" component={BuilderPerformSearch} />
                            <Route path="/search/builderCreditSearch" component={BuilderCreditSearch} />
                            <Route path="/search/enterpriseBidInviteSearch" component={EnterpriseBidInviteSearch} />
                            <Route path="/search/enterpriseBidResultSearch" component={EnterpriseBidresult} />
                            <Route path="/" eaxct component={BuilderCompositeSearch} />
                        </Switch>
                    </div>
                </div>
            </div>


        )
    }
}

export default Search;
