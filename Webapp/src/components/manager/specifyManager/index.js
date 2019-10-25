import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message } from 'antd';
import SpecifyManagerTable from '../specifyManagerTable/index';
import SpecifyManagerForm from '../specifyManagerForm/index';
import SpecifyAddCompanyManagerForm from '../specifyAddCompanyManagerForm/index';
import { stringify } from 'qs';
import "./index.css"

import styles from './specifyInfo.less';
import request from '../../../utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class SpecifyList extends PureComponent {
  state = {
    modalVisible: false,
    addCompanyVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editItem: {},
    editType: '新增更新',
    data: {},
    loading: false,
    params: {},
    startDate: '',
    endDate: '',
  };

  componentDidMount() {
    this.fetchTableList();
  }
  fetchTableList = (params = {}) => {
    if (params == undefined) {
      params = {};
    }
    let REQUEST_URL = `/api/update/admin/listUpdates?${stringify(params)}`;
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
  }
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
      fetchIds: selectedRows.map(row => row.fetchId).join(','),
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
    request(`/api/update/admin/removeUpdate`, newOptions, this.c2)
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
    this.setState({
      modalVisible: true,
      editItem: record,
      editType: '编辑更新',
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
      modalVisible: !!flag,
      editType: '新增更新',
      editItem: {},
    });
  }
  handleAddCompanyModalVisible = (flag) => {
    this.setState({
      addCompanyVisible: !!flag,
    });
  }
  aflerAddCall = (res) => {
    console.log(res);
    if (res.status === 'ok') {
      message.success('操作成功');
      this.setState({
        editItem: {},
        editType: '新增更新',
      });
      const { params } = this.state;
      this.fetchTableList(params);
    } else {
      message.success('操作失败');
    }
  };
  handleAddSubmitAdmin = (values) => {
    this.handleModalVisible(false);
    const otions = {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({
        builderName: values.builderName,
        builderNames: values.builderNames,
        fileKey: values.fileKey
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      }
    };
    request(`/api/update/admin/addUpdate`, otions, this.aflerAddCall);  

  }

  handleAddCompanySubmitAdmin = (values) => {
    this.handleAddCompanyModalVisible(false);
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
    request(`/api/update/admin/addCompany`, newOptions, this.aflerAddCall);

  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="usersListSearch">
        <Row>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <FormItem label="企业名称">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入企业名称" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <Button type="primary" style={{ marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)}>
                添加更新
                </Button>
              <Button type="primary" style={{ marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleAddCompanyModalVisible(true)}>
                添加公司
                </Button>
            </Col>

          </Form>
        </Row>

      </div>

    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { loading, data } = this.state;
    const { selectedRows, modalVisible, addCompanyVisible, editItem, editType } = this.state;

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
            <SpecifyManagerTable
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
          closable={false}
          footer={null}
        >
          <SpecifyManagerForm
            cancelMethod={this.handleModalVisible}
            submitMethod={this.handleAddSubmitAdmin}
            dispatch={this.props.dispatch}
            item={editItem}
          />
        </Modal>
        <Modal
          title={'新增公司'}
          visible={addCompanyVisible}
          closable={false}
          footer={null}
        >
          <SpecifyAddCompanyManagerForm
            cancelMethod={this.handleAddCompanyModalVisible}
            submitMethod={this.handleAddCompanySubmitAdmin}
            dispatch={this.props.dispatch}
          />
        </Modal>
      </div>
    );
  }
}
SpecifyList = Form.create({})(SpecifyList)
export default SpecifyList


