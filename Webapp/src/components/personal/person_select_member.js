import React, { Component } from 'react';
import './person_select_member.css';
import { stringify } from 'qs';
import { message, Table, Form } from 'antd';
import PersonMenber from './person_member';
import emitter from "../../event"
import request from '../../utils/request';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class PersonSelectMenber extends Component {
  state = {
    userId: 0,
    enteId: 0,
    list: [],
    pagination: {},
    loading: true,
    currentUserLevel: 0,
    queryUserLevel: 0
  };

  componentDidMount() {
    let userId = null;
    let userinfot = sessionStorage.getItem("userinfo");
    if (userinfot != null && userinfot != undefined) {
      let userObj = JSON.parse(userinfot);
      if (userObj !== null && userObj.data !== null) {
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
    }, this.c1)
  }
  c1 = (data) => {
    this.setState({
      userId: data.userId,
      enteId: data.enteId,
      currentUserLevel: data.userLevel,
    });
    this.fetchTableList({
      enteId: data.enteId,
      userLevel: data.userLevel,
    });
  }

  handleCompositeTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchTableList({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...params,
    });
  }

  fetchTableList = (params = {}) => {
    if (params === undefined) {
      params = {};
    }
    const enteId = params.enteId;
    const userLevel = params.userLevel;
    if ((enteId !== null && enteId === 0) || userLevel === 0) {
      this.setState({ loading: false })
      return;
    }
    let REQUEST_URL = `/api/user/listUsers?${stringify(params)}`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.c2)
  }
  c2 = (data) => {
    const { pageSize, current } = data.pagination;
    const startno = (current - 1) * pageSize;
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
    });
  }
  handlereload = () => {
    this.fetchTableList({ enteId: this.state.enteId, userLevel: this.state.currentUserLevel, });
  }
  cancelLevel = (val) => {
    const values = {
      userId: val,
      userLevel: 1,
      managerId: this.state.userId,
    };

    const defaultOptions = {
      credentials: 'include',
      method: 'post',
      body: { ...values },
    };
    const newOptions = { ...defaultOptions, };
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
    request(`/api/user/changeUserLevel`, newOptions, this.c3)

  }
  c3 = (data) => {
    if (data.status == 'ok') {
      message.success('设置级别成功', 1);
      this.fetchTableList({ enteId: this.state.enteId, userLevel: this.state.currentUserLevel, });
      emitter.emit("reloadMemberList");
    } else {
      message.success(`设置级别失败:${data.message}`, 1);
    }
  }

  render() {
    const vipLevel = ['普通会员', 'vip会员1年', 'vip会员2年', 'vip会员3年', '钻石会员1年', '钻石会员2年', '钻石会员3年']
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '姓名',
        dataIndex: 'userRealName',
        render(val, record) {
          const title = val;
          if (val.length > 40) {
            const showT = `${val.substring(0, 40)}...`;
            return <span title={title}>{showT}</span>;
          } else {
            return <span title={title}>{val}</span>;
          }
        },
      },
      {
        title: '会员级别',
        dataIndex: 'userLevel',
        render(val) {
          if (val >= 1) {
            return vipLevel[val - 1];
          } else {
            return vipLevel[val];
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'userId',
        render: (val, record) => {
          if (val === this.state.userId) {
            return "---"
          } else {
            return <a><span onClick={() => this.cancelLevel(record.userId)}>取消</span> </a>
          }
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      ...this.state.pagination,
    };
    return (
      <div id="personSelectMem">
        <h3>已绑定成员</h3>

        <Table
          dataSource={this.state.list}
          rowKey={record => record.key}
          pagination={paginationProps}
          loading={this.state.loading}
          columns={columns}
          onChange={this.handleCompositeTableChange}
        />
        <PersonMenber reloadMethod={this.handlereload} />
      </div>


    );
  }
}
PersonSelectMenber = Form.create({})(PersonSelectMenber)
export default PersonSelectMenber;