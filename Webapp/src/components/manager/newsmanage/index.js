import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message } from 'antd';
import NewsTable from '../newstable/index';
import NewsCreateForm from '../newscreateform/index';
import { stringify } from 'qs';
import "./index.css"

import styles from './index.less';
import request from '../../../utils/request';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class NewsManageList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editItem: {},
    editType: '新增新闻',
    data: {},
    loading: false,
    params: {},
  };

  componentDidMount() {
    this.fetchTableList();
  }
  fetchTableList = (params = {}) => {
    if (params == undefined) {
      params = {};
    }
    let REQUEST_URL = `/api/news/listNews?${stringify(params)}`;
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
    this.setState({ data, loading: false });
    const { pageSize, current } = data.pagination;
    const startno = (current - 1) * pageSize;
    if (data.list != null) {
      data.list.map(function (value, key) {
        let nm = { no: startno + key + 1 };
        return Object.assign(value, nm);
      });
    }
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
    this.setState({ params });
    this.fetchTableList(params);
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({});
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  removeUser = () => {
    const { selectedRows } = this.state;
    const params = {
      newsIds: selectedRows.map(row => row.id).join(','),
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
    request(`/api/news/admin/removeNews`, newOptions, this.c2)
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
      editType: '编辑',
    });
  }

  handleSelectRows = (rows) => {
    console.log(rows);
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

      this.fetchTableList(values);
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      editType: '新增',
      editItem: {},
    });
  }
  aflerAddCall = (res) => {
    console.log(res);

  };
  handleAddSubmitAdmin = (values) => {
    this.handleModalVisible(false);
    const defaultOptions = {
      credentials: 'include',
      method: 'post',
      body: { ...values },
    };
    const newOptions = { ...defaultOptions, };
    /*newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };*/
    // newOptions.body = JSON.stringify(newOptions.body);
    console.log(newOptions);
    let formData = new FormData();
    formData.append('pic', values.file);
    formData.append('id', values.id === undefined ? 0 : values.id);
    formData.append('newsTitle', values.newsTitle);
    formData.append('newsType', values.newsType);
    formData.append('newsSource', values.newsSource);
    formData.append('newsContent', values.newsContent);
    formData.append('newsStatus', values.newsStatus);
    request(`/api/news/admin/addNews`, {
      method: 'post',
      credentials: 'include',
      body: formData,
    }, this.c3)

  }
  c3 = (res) => {
    if (res.status === 'ok') {
      message.success('操作成功');
      this.fetchTableList({});
      this.setState({
        editItem: {},
        editType: '新增新闻',
      });

    } else {
      message.success('操作失败');
    }
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="newsListSearch">
        <Row>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
              <FormItem label="咨讯标题">
                {getFieldDecorator('newsTitle')(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
              <FormItem label="咨讯类型">
                {getFieldDecorator('newsType')(
                  <Select>
                    <Option value="1">行业资讯</Option >
                    <Option value="2">平台动态</Option >
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
              <Button type="primary" style={{ marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)} onClick={() => this.handleModalVisible(true)}>
                新建资讯
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
    const { selectedRows, modalVisible, editItem, editType } = this.state;

    return (
      <div className="addNewsSeach">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator} style={{ marginBottom: 15 }}>
              {/* <Button type="primary" style={{marginRight:10}} onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
              {
                selectedRows.length > 0 && (
                  // <span>
                  //   <Dropdown overlay={menu}>
                  //     <Button>
                  //       更多操作 <Icon type="down" />
                  //     </Button>
                  //   </Dropdown>
                  // </span>
                  <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                    <Menu.Item key="remove">批量删除</Menu.Item>
                  </Menu>
                )
              }
            </div>
            <NewsTable
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
          key={new Date().getTime()}
        >
          <NewsCreateForm
            cancelMethod={this.handleModalVisible}
            submitMethod={this.handleAddSubmitAdmin}
            dispatch={this.props.dispatch}
            item={editItem}
          />
        </Modal>
      </div>
    );
  }
}
NewsManageList = Form.create({})(NewsManageList)
export default NewsManageList


