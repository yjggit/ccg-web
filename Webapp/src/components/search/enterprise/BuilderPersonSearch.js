import React, { PureComponent } from 'react';
import { message, Select, Row, Col, Table, Card, Form, Input, Button, Tooltip } from 'antd';
import '../../../css/antd.css';
import { stringify } from 'qs';
import styles from '../../../css/StandardTableList.less';
import './BuilderPersonSearch.css';
import request from '../../../utils/request';
import genelink from '../../../utils/linkutil';
import Utils from "../../../utils/appUtils";
import emitter from "../../../event";

const FormItem = Form.Item;
const Option = Select.Option;

class BuilderPersonSearch extends PureComponent {

  state = {
    list: [],
    pagination: {},
    perCertOptions: [],
    loading: false,
    // certLevelOptions: [],
  };

  componentDidMount() {
    let level = Utils.getUserType();
    let isValid = Utils.isValid();
    let isUser = Utils.isUser();
    if(isUser) {
      this.setState({ userLevel: isValid ? level : 0 });
    }else {
      this.setState({ userLevel: -1});
    }
    this.eventEmitter = emitter.addListener("updateUserLevel", (level) => {
      this.setState({
        userLevel: level
      });
    });
    this.fetchSearchList();
    this.fetchPersonCertType();
  }
  fetchPersonCertType = () => {
    let REQUEST_URL = "/api/person/certType";
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.c4)
  }

  fetchPersonCertLevel = (typeId) => {
    if (typeId == 8) {
      let REQUEST_URL = "/api/person/certLevel/" + typeId;
      request(REQUEST_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }, (data) => {
        this.setState({
          certLevelOptions: data
        })
      })
    }
  }

  c4 = (data) => {
    // console.log(data)
    // let convertData = JSON.stringify(data).split('personCertTypeId').join('value').split('personCertTypeName').join('label');
    // let jsonData = JSON.parse(convertData);
    data.map(function (value, key) {
      let isleaf = { isLeaf: false };
      return Object.assign(value, isleaf);
    });
    this.setState({
      perCertOptions: data,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchSearchList();
  }

  handlePersonSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    message.config({
      top: 380,
    });
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      const { personName, certTypeId, builderName, certLevelName } = fieldsValue;
      if ((personName === undefined || personName === '')
        && (certTypeId === undefined || certTypeId === '')
        && (certLevelName === undefined || certLevelName === '')
        && (builderName === undefined || builderName === '')) {
        message.info('请输入查询条件');
        return;
      }

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      this.fetchSearchList(values);

    });
  }

  fetchSearchList = (params) => {
    let REQUEST_URL = `/api/person/filter?${stringify(params)}`;
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
  handleTableChange = (pagination, filtersArg, sorter) => {

    const { formValues, userLevel } = this.state;
    if(userLevel <= 0) {
      this.popUpLoginModal(userLevel);
      return;
    }
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchSearchList(params);
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    let typeId = this.props.form.getFieldValue("certTypeId");
    return (
      <div id="personSearchInput">
        <Row>
          <Form onSubmit={this.handlePersonSearch}>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="人员姓名">
                {getFieldDecorator('personName')(
                  <Input placeholder="请输入人员姓名" />
                )}
              </FormItem>
            </Col>
            {/* <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:12}} xxl={{span:6}}>
              <FormItem label="证书编号">
                {getFieldDecorator('registCertNo')(
                  <Input placeholder="请输入证书编号" />
                )}
              </FormItem>
            </Col> */}
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="企业名称">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入企业名称" />
                )}
              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="证书类别">
                {getFieldDecorator('certTypeId',
                  //{
                  // normalize: (value, prevValue, allValues) => {
                  // this.fetchPersonCertLevel(value);
                  // return value;
                  //}
                  //}
                )(
                  <Select placeholder="请选择证书类别" allowClear="true">
                    {this.state.perCertOptions.map((options) => <Option key={options.personTypeId}>{options.personTypeName}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            {/* <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} style={{ display: typeId == 8 ? '' : 'none' }}>
              <FormItem label="证书类别">
                {getFieldDecorator('certLevelName')(
                  <Select placeholder="请选择证书类别" allowClear="true">
                    {this.state.certLevelOptions.map((options) => <Option key={options.certLevelName}>{options.certLevelName}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col> */}
            <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 6 }}>
              <div className='ddgo_personnelEnquiryButtons'>
                <Button htmlType="submit" type="primary" >查询</Button>
                <Button htmlType="reset" type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }} onClick={this.handleFormReset}>重置</Button>
              </div>
            </Col>

          </Form>
        </Row>

      </div>
    );
  }

    popUpLoginModal = (level) => {
        switch (level) {
            case -1:
                emitter.emit("loginModal", true);
                break;
            case 0:
                message.info('请升级为会员！');
                break;
        }
    }

  render() {
    const { userLevel } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '姓名',
        dataIndex: 'personName',
        render: (val, row, index) => {
          return userLevel<=0 ? (
              row.sourceUrl ? <a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>{row.personName.replace(row.personName.substring(0, 1), '*')}</a> :
                  <Tooltip placement="top" title={"暂无数据来源"}>
                    <a>{row.personName.replace(row.personName.substring(0, 1), '*')}</a></Tooltip>
          ) :
              (row.sourceUrl ? <a target="_blank" href={genelink(row.sourceUrl, false)}>{row.personName}</a> :
                  <Tooltip placement="top" title={"暂无数据来源"}><a>{row.personName}</a></Tooltip>)
        }
      },
      {
        title: '证书编号',
        dataIndex: 'certNo',
        align: 'center',
        render: val => {
          return (
              <ul>
                {val.split('&').map((cert, i) => {
                  return <li key={cert + i}>&nbsp;{cert}</li>
                })}
              </ul>)
        },
      },
      {
        title: '证书类别',
        dataIndex: 'certLevelName',
        align: 'center',
        render: (val, row, index) => {
          if ((!val || val == 'null') && (!row.registMajor || row.registMajor == 'null')) {
            return <ul><li>&nbsp;</li></ul>;
          } else {
            let levels = val.split('&');
            let majors = row.registMajor.split('&');
            return <ul>{levels.map((level, i) => {
              return <li key={level + i}>&nbsp;{(level && level != "null") ? level : majors[i] != "null" ? majors[i] : ""}</li>
            })}</ul>
          }
        }
      },
      {
        title: '证书所在企业',
        dataIndex: 'builderName',
        align: 'center',
        render: (val, index) => {
          return userLevel<=0 ?
              <ul>
                {val.split('&').map((name, i) => {
                  return <li key={name + i}>&nbsp;{name=='' ? '' : name.replace(name.substring(2, 8), '******')}</li>
                })}
              </ul> :
              <ul>
                {val.split('&').map((name, i) => {
                  return <li key={name + i}>&nbsp;{name}</li>
                })}
              </ul>
        },
      },
      {
        title: '操作',
        dataIndex: 'sourceUrl',
        render: val => {
          return userLevel<=0 ?
              (val ? <a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>查看</a> : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>) :
              (val ? <a target="_blank" href={genelink(val, true)}>查看</a> : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>)
        }
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.pagination.total,
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      showTotal: () => `总共 ${this.state.pagination.total} 记录`
    };
    return (
      <Card bordered={false}>
        <div className={styles.tableListForm} style={{ marginBottom: '20px' }}>
          {this.renderForm()}
        </div>
        <div className="ddgo_personSearch_table">
          <Table
            dataSource={this.state.list}
            rowKey={record => record.key}
            // pagination={{ total: this.state.pagination.total, current: this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 条记录` }}
            pagination={paginationProps}
            loading={this.state.loading}
            columns={columns}
            onChange={this.handleTableChange}
          />
        </div>

      </Card>
    );
  }
}
BuilderPersonSearch = Form.create({})(BuilderPersonSearch)
export default BuilderPersonSearch;
