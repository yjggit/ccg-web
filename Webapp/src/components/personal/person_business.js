import React, {Component} from 'react';
import './person_business.css'
import {Icon, message, Table} from "antd";
import request from "../../utils/request";
import CopyToClipboard from 'react-copy-to-clipboard';
import {stringify} from 'qs';

class PersonContact extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: 0,
            sumTotal: 0,
            registerTotal: 0,
            payTotal: 0,
            list: [],
            pagination: {},
        }
    }

    componentDidMount() {
        this.reachInviteesInfo();
        this.reachInvitedUserSum();
        this.reachInviteCode();
        this.reachInvitedMember({});
    }

    //根据当前用户查询该用户邀请用户总数
    reachInvitedUserSum = () => {
        request('/api/user/searchInviteUserTotal', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}, (data) => {
            console.log('inviteCode000', data);
            this.setState({
                sumTotal: data.sumTotal,
                registerTotal: data.registeredTotal,
                payTotal: data.payUserTotal,
            })
        });
    };

    //初始化用户邀请码
    initialInviteCode = () => {
        request('/api/user/inviteCode', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}, (data) => {

            console.log('inviteCode111', data);
            this.setState({
                inviteCode: data.inviteCode,
            })
        });
    };

    //获取当前用户邀请码
    reachInviteCode = () => {
        request('/api/user/searchUserInviteCode', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}, (data) => {
            console.log('inviteCode222', data);
            let code = data.inviteCode;
            if(code) {
                this.setState({
                    inviteCode: code,
                })
            }else {
                this.initialInviteCode();
            }
        });
    };

    //通过当前用户获取邀请成员列表
    reachInvitedMember = (param) => {
        this.setState({ loading: true });
        request(`/api/user/searchBeInviteUser?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}, (data) => {
            let { pageSize, current } = data.pagination;
            let startno = (current - 1) * pageSize;
            if (data.list != null) {
                data.list.map(function (value, key) {
                    let nm = { no: startno + key + 1 };
                    return Object.assign(value, nm);
                });
            }
            this.setState({
                list: data.list,
                loading: false,
                pagination: data.pagination
            })
        });
    };

    //获取被邀请人姓名电话
    reachInviteesInfo = () => {
        request('/api/user/searchByInvitePeople', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}, (data) => {
            // console.log('inviteCode333 ', data);
            this.setState({
                invitePeople: data.invitePeople,
                invitePhone: data.invitePeoplePhone,
            })
        });
    };

    handleTableChange = (pagination, filtersArg, sorter) => {
        const { type } = this.state;
        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            type: type,
        };
        if(type==0) delete params['type'];

        this.reachInvitedMember(params);
    };

    copyTo = () => {
        message.info('复制到剪切板成功！');
    };

    switchType = (type) => {
        switch (type) {
            case 1:
                this.setState({type: 1});
                this.reachInvitedMember({type: 1});
                break;
            case 2:
                this.setState({type: 2});
                this.reachInvitedMember({type: 2});
                break;
            default:
                this.setState({type: 0});
                this.reachInvitedMember();
                break;
        }
    };

    render(){
        const { list, type, inviteCode, invitePeople, invitePhone, sumTotal, registerTotal, payTotal } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'no',
            },
            {
                title: '用户姓名',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '注册时间',
                dataIndex: 'createDate',
                render: (val) => {
                    // let x = new Date(parseInt(val));
                    // return x.getFullYear() + "/" + (x.getMonth() + 1) + "/" + x.getDate();
                    return new Date(parseInt(val)).format('yyyy/MM/dd')
                }
            },
        ];

        const paginationProps = {
            // showSizeChanger: false,
            // showQuickJumper: false,
            // showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
            // ...this.state.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.pagination.total,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            showTotal: () => `总共 ${this.state.pagination.total} 记录`
        };

        return(
            <div id="personacaont">
                <h3>我的邀请码</h3>
                <div className='top2'>
                    <p>
                        {inviteCode} &nbsp;&nbsp;&nbsp;&nbsp;
                        <CopyToClipboard text={inviteCode} onCopy={this.copyTo}>
                            <Icon type="copy" />
                        </CopyToClipboard>
                    </p>

                </div>
                <h3>我的推荐人</h3>
                <div className='top2'>
                    <p>
                        推荐人：{invitePeople ? invitePeople : '暂无'}
                    </p>
                    <p>
                        联系电话：{invitePhone ? invitePhone : '暂无'}
                    </p>
                </div>

                <div className="tyt">
                    <h3>我的成员</h3>
                    <p>
                        <span style={{color: type==0 ? '#3586f1' : ''}} onClick={this.switchType}>
                            全部(<span style={{color: type==0 ? 'red' : ''}}>{sumTotal}</span>)</span>
                        <span style={{color: type==1 ? '#3586f1' : ''}} onClick={this.switchType.bind(this, 1)}>
                            已注册(<span style={{color: type==1 ? 'red' : ''}}>{registerTotal}</span>)</span>
                        <span style={{color: type==2 ? '#3586f1' : ''}} onClick={this.switchType.bind(this, 2)}>
                            已付费(<span style={{color: type==2 ? 'red' : ''}}>{payTotal}</span>)</span>
                    </p>

                </div>

                <div className='business_table'>
                    <Table
                        dataSource={list}
                        rowKey={record => record.key}
                        pagination={paginationProps}
                        loading={this.state.loading}
                        columns={columns}
                        onChange={this.handleTableChange}
                    />
                </div>

            </div>

        )
    }
}

export default PersonContact;