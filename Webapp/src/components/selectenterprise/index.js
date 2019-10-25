import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { Row, Col, Card, Form, Input, Button, Table } from 'antd';
import './index.css'
import request from '../../utils/request'
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class SelectEnterprise extends PureComponent {
  state = {
    formValues: {},
    selectedRowKeys: [],
    list: [],
    pagination: {},
    loading: true,
  };
  fetchTableList = (params) => {
    let requestUrl = "/api/builder/filter/simple";
    let userinfot = sessionStorage.getItem("admininfo");
    if (userinfot != null && userinfot != undefined) {
      requestUrl = "/api/builder/admin/ccgBuilder";
    }

    let REQUEST_URL = `${requestUrl}?${stringify(params)}`;
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
    this.setState({
      list: data.list,
      loading: false,
      pagination: data.pagination
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchTableList({ isLocal: 1 });
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
      isLocal: 1,
    };
    if (sorter && sorter.field) {
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

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({
    });
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRows);
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  handleSelectedSubmit = () => {
    this.props.setEnteprise();
    this.setState({ selectedRowKeys: [] });
    const { form } = this.props;
    form.resetFields();
    this.fetchTableList({});
  }

  handleSearch = (e) => {
    e.preventDefault();


    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        isLocal: 1,
      };

      this.setState({
        formValues: values,
      });

      this.fetchTableList({
        ...values
      });
    });
  }
  cancel = () => {
    this.props.cancelMethod();
    this.props.form.setFieldsValue({
      enterpriseName: '',
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="SelectEnterpriseSearch">
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row>
            <Col span={18}>
              <FormItem label="企业名称">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入企业名称" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Button style={{ marginLeft: 4 }} type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>

        </Form>

      </div>
    );
  }

  renderTable() {
    const paginationProps = {
      ...this.state.pagination,
    };
    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '企业名称',
        dataIndex: 'builderName',
      }, {
        title: '法定代表人',
        dataIndex: 'legalPerson',
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div id="SelectEnterpriseTable">
        <Table
          dataSource={this.state.list}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          pagination={paginationProps}
          loading={this.state.loading}
          columns={columns}
          onChange={this.handleStandardTableChange}
        />
        <div id="SelectEnterpriseBut">
          <Button key="submit" type="primary" onClick={this.handleSelectedSubmit}> 保存</Button>
          <Button onClick={this.cancel}>取消 </Button>
        </div>
      </div>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    return (
      <Card bordered={false}>
        <div >
          <div>
            {this.renderForm()}
            {this.renderTable()}
          </div>
        </div>
      </Card>
    );
  }
}
SelectEnterprise = Form.create({})(SelectEnterprise)
export default SelectEnterprise;
