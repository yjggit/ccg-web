import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message, DatePicker } from 'antd';
import CosUserTable from '../cosusertable/index';
import CosUserCreateForm from '../cosusercreateform/index';
import { stringify } from 'qs';
import "./index.css"

import styles from './UserInfo.less';
import request from '../../../utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class UserList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editItem: {},
    editType: '新增用户',
    data: {},
    loading: false,
    params: {},
    startDate: '',
    endDate: '',
    roleList: [],
    roleMenuList: []
  };

  componentDidMount() {
    this.fetchTableList();
    this.fetchRoleList();
  }
  fetchTableList = (params = {}) => {
    if (params == undefined) {
      params = {};
    }
    let REQUEST_URL = `/api/user/admin/listUsers?${stringify(params)}`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.c1)
  }
  c1 = (data) => {
    const { pageSize, current } = data.pagination;
    const startno = (current - 1) * pageSize;
    if (data.list != null) {
      data.list.map(function (value, key) {
        let nm = { no: startno + key + 1 };
        return Object.assign(value, nm);
      });
    }
    this.setState({ data, loading: false });
    console.log(data)
  }
  //获取角色列表
  fetchRoleList = () => {
    let REQUEST_URL = `/api/role/search`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.getRoleList)
  }
  getRoleList = (data) => {
    this.setState({ roleList: data, loading: false });
  };

  handleStartDateOnChange = (value, dateString) => {
    this.setState({ startDate: dateString });
  }
  handleEndDateOnChange = (value, dateString) => {
    this.setState({ endDate: dateString });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    const { startDate, endDate } = this.state;
    if (startDate !== '') {
      params.startDate = startDate;
    }
    if (endDate !== '') {
      params.endDate = endDate;
    }
    this.setState({ params });
    this.fetchTableList(params);
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      startDate: '',
      endDate: '',
    });
    this.fetchTableList({});
    try {
      document.getElementsByClassName('ant-calendar-picker-clear')[0].click();
    } catch (e) {

    }
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  removeUser = () => {
    const { selectedRows } = this.state;
    const params = {
      userIds: selectedRows.map(row => row.userId).join(','),
    };
    const defaultOptions = {
      credentials: 'include',
      method: 'post',
      body: { ...params },
    };
    const newOptions = { ...defaultOptions, };
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
    request(`/api/user/admin/removeUser`, newOptions, this.c2)
  }
  c2 = (data) => {
    this.setState({
      selectedRows: [],
    });
    if (data.status === 'ok') {
      message.success('删除成功');
      this.handleModalVisible(false);
      this.componentDidMount();
    } else {
      message.success('删除失败');
    }
  }
  handleMenuClick = (e) => {
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove': this.removeUser()
        break;
      default:
        break;
    }
  }
  handleEditClick = (record) => {
    if (record.userLevel > 4) {
      record.vipEndDate = record.diamondEndDate
    }
    console.log('点编辑后', record);
    this.setState({
      modalVisible: true,
      editItem: record,
      editType: '编辑用户',
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleSearch = (e) => {
    e.preventDefault();


    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      const { startDate, endDate } = this.state;
      if (startDate !== '') {
        values.startDate = startDate;
      }
      if (endDate !== '') {
        values.endDate = endDate;
      }
      this.fetchTableList(values);
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      editType: '新增用户',
      modalVisible: !!flag,
      editItem: {},
    });
  }
  aflerAddCall = (res) => {
    console.log(res);
    if (res.status === 'ok') {
      message.success('操作成功');
      this.setState({
        // editItem: {},
        // editType: '新增用户',
      });
      const { params } = this.state;
      console.log('操作成功后', params);
      this.fetchTableList(params);
    } else {
      message.success('操作失败');
    }
  };
  handleAddSubmitAdmin = (values) => {
    console.log('submit values', values);
    // this.handleModalVisible(false);
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
    console.log('new options', newOptions);
    newOptions.body = JSON.stringify(newOptions.body);
    request(`/api/user/admin/addUser`, newOptions, this.aflerAddCall);

  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    let dateFormat = 'YYYY-MM-DD';
    return (
      <div id="usersListSearch">
        <Row>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="手机号码">
                {getFieldDecorator('phoneNo')(
                  <Input placeholder="请输入手机号" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="真实姓名">
                {getFieldDecorator('userName')(
                  <Input placeholder="请输入真实姓名" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="所属公司">
                {getFieldDecorator('enterpriseName')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="用户类型">
                {getFieldDecorator('userType')(
                  <Select placeholder="请选择" >
                    {/*1： 个人用户，2：企业用户 */}
                    <Option value="1">个人用户</Option>
                    <Option value="2">企业用户</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="用户等级">
                {getFieldDecorator('userLevel')(
                  <Select placeholder="请选择" >
                    {/* 会员级别（1普通会员，2 vip会员1年，3 vip会员2年，4 vip会员3年，5 钻石会员1年，6 钻石会员2年，7 钻石会员3年） */}
                    <Option value="1">普通用户</Option>
                    <Option value="2">VIP会员 1 年</Option>
                    <Option value="3">VIP会员 2 年</Option>
                    <Option value="4">VIP会员 3 年</Option>
                    <Option value="5">钻石会员 1 年</Option>
                    <Option value="6">钻石会员 2 年</Option>
                    <Option value="7">钻石会员 3 年</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="管理员">
                {getFieldDecorator('isEnterAdmin')(
                  <Select placeholder="请选择" >
                    <Option value="2">是</Option>
                    <Option value="1">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="注册时间">
                {getFieldDecorator('date')(
                  <span> <DatePicker
                    format={dateFormat} placeholder="起始"
                    onChange={this.handleStartDateOnChange} /> <span style={{ padding: "0 5px" }}>-</span>
                    <DatePicker
                      placeholder="截止"
                      format={dateFormat}
                      onChange={this.handleEndDateOnChange} />
                  </span>
                )}
              </FormItem>
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <Button type="primary" style={{ marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)}>
                新建用户
                </Button>
            </Col>

          </Form>
        </Row>

      </div>

    );
  }

  renderAdvancedForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">

      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { loading, data, selectedRows, modalVisible, editItem, editType, roleList } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">批量删除</Menu.Item>
      </Menu>
    );

    return (
      <div id="addUsers">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator} style={{ marginBottom: 15 }}>

              {
                selectedRows.length > 0 && (
                  <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                    <Menu.Item key="remove">批量删除</Menu.Item>
                  </Menu>

                )
              }
            </div>
            <CosUserTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              handleEditClick={this.handleEditClick}
            />
          </div>
        </Card>
        <Modal
          title={editType}
          visible={modalVisible}
          closable
          footer={null}
          className='userModal'
          onCancel={this.handleModalVisible.bind(this, false)}
        >
          <CosUserCreateForm
            cancelMethod={this.handleModalVisible}
            submitMethod={this.handleAddSubmitAdmin}
            dispatch={this.props.dispatch}
            item={editItem}
            data={roleList}
          />
        </Modal>
      </div>
    );
  }
}
UserList = Form.create({})(UserList)
export default UserList


