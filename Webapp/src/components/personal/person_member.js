import React, { Component } from 'react';
import './person_member.css';
import emitter from "../../event";
import request from '../../utils/request';

import { stringify } from 'qs';
import { message, Row, Col, Table, Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class PersonMenber extends Component {
  state = {
    userId: 0,
    enteId: 0,
    list: [],
    pagination: {},
    loading: true,
    currentUserLevel: 1,
    userType: 1
  };

  componentDidMount() {
    this.eventEmitter = emitter.addListener("reloadMemberList", () => {
      console.log("callback reloadMemberList");
      this.handleFormReset()
    });

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
    if (data != null) {
      this.setState({
        userId: data.userId,
        enteId: data.enteId,
        currentUserLevel: data.userLevel,
        userType: data.userType
      });
      this.fetchTableList({
        enteId: data.enteId,
      });
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        enteId: this.state.enteId,
      };

      this.setState({
        formValues: values,
      });

      this.fetchTableList({ ...values });
    });
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({ enteId: this.state.enteId, });
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
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="memberList">
        <h3>员工列表</h3>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row>
            <Col xs={{ span: 7 }} md={{ span: 7 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem >
                {getFieldDecorator('phoneNo')(
                  <Input placeholder="请输入电话" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 7 }} md={{ span: 7 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem >
                {getFieldDecorator('userRealName')(
                  <Input placeholder="请输入姓名" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 10 }} md={{ span: 10 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <span>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8, backgroundColor: '#f29700', color: '#fff' }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  selectUser = (val) => {

    if (this.state.currentUserLevel === 1) {
      message.success('您无权选择用户', 1);
      return;
    } else if(this.state.userType == 1) {
      message.success('个人用户无权选择用户', 1);
      return;
    }

    const values = {
      userId: val,
      userLevel: this.state.currentUserLevel,
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
    if (data.status === 'ok') {
      message.success('设置级别成功', 1);
      if (this.props.reloadMethod) {
        this.props.reloadMethod();
      }
      this.fetchTableList({ enteId: this.state.enteId, userLevel: 0, });
    } else {
      message.success(`设置级别失败:${data.message}`, 1);
    }
  }

  render() {
    // 1普通会员，2 vip会员1年，3 vip会员2年，4 vip会员3年，5 钻石会员1年，6 钻石会员2年，7 钻石会员3年
    const vipLevel = ['普通会员', 'vip会员1年', 'vip会员2年', 'vip会员3年', '钻石会员1年', '钻石会员2年', '钻石会员3年']
    const { currentUserLevel } = this.state;
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
        title: '电话',
        dataIndex: 'phoneNo',
        render(val) {
          const title = val;
          if (val != null && val.length > 25) {
            const showT = `${val.substring(0, 25)}...`;
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
            return vipLevel[val - 1];
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'userId',
        render: (val, record) => {
          if (record.userLevel === currentUserLevel) {
            return "---"
          } else {
            return <a><span onClick={() => this.selectUser(record.userId)} >添加</span></a>
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
      <div id="personMember">
        {this.renderSimpleForm()}
        <Table
          dataSource={this.state.list}
          rowKey={record => record.key}
          pagination={paginationProps}
          loading={this.state.loading}
          columns={columns}
          onChange={this.handleCompositeTableChange}
        />
      </div>

    );
  }

}
PersonMenber = Form.create({})(PersonMenber)
export default PersonMenber;