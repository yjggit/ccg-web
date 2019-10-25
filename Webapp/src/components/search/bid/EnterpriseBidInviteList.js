import React, { PureComponent } from 'react';
import {Cascader, Select, DatePicker, Row, Col, Table, Card, Form, Input, Button, message} from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import './EnterpriseBidInviteList.css';
import request from '../../../utils/request'
import genelink from '../../../utils/linkutil'
import Utils from "../../../utils/appUtils";
import emitter from "../../../event";

const Option = Select.Option;
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
class EnterpriseBidInviteList extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    startDate: '',
    endDate: '',
    locations: [],
    sources: [],
    options: [],
    formValues: {},
    locationData: {},
    userLevel: -1,
  };

  componentDidMount() {
    this.fetchTableList({
    });
    request("/api/builder/builderLocation", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      let locationData = {};
      res.map((lo) => {
        locationData[lo.localId] = lo.localName;
      })
      this.setState({ locationData: locationData })
    });
    request("/api/builder/builderLocation?isLocal=1", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      this.setState({ locations: res })
    });
    request('/api/bid/sourceWebsite', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      this.setState({
        sources: res
      })
    })
    request('/api/pub/dicttype/query/aptitudeType', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      let data = res.data;
      data.map(d => {
        if (d.children.length > 0) {
          d.children.map(c => {
            if (c.title === '不限') {
              c.id = 0;
              return c;
            }
          })
        }
      })
      data = JSON.stringify(data).split('title').join("label").split("id").join('value');
      this.setState({
        options: JSON.parse(data)
      })
    });

    let level = Utils.getUserType();
    let isValid = Utils.isValid();
    let isUser = Utils.isUser();
    //没登录时，即游客绕过"过期"判断
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

  }
  handleStartDateOnChange = (value, date) => {
    this.setState({ startDate: date });
  }
  handleEndDateOnChange = (value, date) => {
    this.setState({ endDate: date });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { startDate, endDate, options } = this.state;
    const { form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      fieldsValue["startDate"] = null;
      fieldsValue["endDate"] = null;
      const values = {
        issueStart: startDate,
        issueEnd: endDate,
        ...fieldsValue,
        aptitude: fieldsValue['requstPermit'] ? fieldsValue['requstPermit'][0] : '',
        industry: fieldsValue['requstPermit'] ? fieldsValue['requstPermit'][1] : '',
      };

      this.setState({
        formValues: values,
      });
      console.log(values)
      this.fetchTableList({ ...values });
    });
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      startDate: null,
      endDate: null,
    });
    this.fetchTableList({});
  }

  handleCompositeTableChange = (pagination, filtersArg, sorter) => {
    const { formValues, userLevel } = this.state;
    if(userLevel <= 0) {
      this.popLoginModal(userLevel);
      return;
    }
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    console.log(formValues)
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      issueStart: this.state.startDate,
      issueEnd: this.state.endDate,
      ...formValues,
      ...filters,
      aptitude: formValues['requstPermit'] ? formValues['requstPermit'][0] : '',
      industry: formValues['requstPermit'] ? formValues['requstPermit'][1] : '',
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
    console.log(params)
    let REQUEST_URL = `/api/bid/invitation?${stringify(params)}`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.callback);

  }
  callback = (data) => {
    console.log(data)
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

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      startDate: null,
      endDate: null,
    });
    this.fetchTableList({});;
  }
  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  }

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = false;
    targetOption.children = targetOption.children;
  }

  disabledDate = (date) => {
    // 1514736000000
    return date && (date.valueOf() < 1514736000000 || date.valueOf() > new Date().getTime());
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { startDate, endDate } = this.state;
    let dateFormat = 'YYYY-MM-DD';
    return (
        <div className='ddgo_callForBids_search'>
          {/* <button onClick={()=>{window.location.href = "http://www.pzhggzy.cn/jyxx/jsgcZbggDetail?guid=2b7e600c-fe4a-46ba-a0cd-2834f392bb8a&isOther=false&type=1"}}>http://www.pzhggzy.cn/jyxx/jsgcZbggDetail?guid=2b7e600c-fe4a-46ba-a0cd-2834f392bb8a&isOther=false&type=1</button> */}
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="信息名称:">
                  {getFieldDecorator('inviteTitle')(
                      <Input placeholder="请输入招标信息关键字" />
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 5 }}>
                <FormItem label="资质类型">
                  {getFieldDecorator('requstPermit')(
                      <Cascader
                          options={this.state.options}
                          loadData={this.loadData}
                          onChange={this.onChange}
                          changeOnSelect
                          placeholder="请选择..."
                      />
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 5 }}>
                <FormItem label="地区">
                  {getFieldDecorator('location')(
                      <Select placeholder="请选择地区" allowClear="true">
                        {this.state.locations.map((location, key) => <Option key={location.localId}>{location.localName}</Option>)}
                      </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                <FormItem label="发布日期">
                  <div className='ddgo_callForBidsTime'>
                    {getFieldDecorator('startDate')(
                        <DatePicker
                            format={dateFormat}
                            placeholder="起始日期"
                            disabledDate={this.disabledDate}
                            onChange={this.handleStartDateOnChange} />
                    )}
                    <span style={{ lineHeight: "32px", float: "left" }}>&nbsp;-&nbsp;</span>
                    {getFieldDecorator('endDate')(
                        <DatePicker
                            placeholder="截止日期"
                            format={dateFormat}
                            disabledDate={this.disabledDate}
                            onChange={this.handleEndDateOnChange} />
                    )}
                  </div>
                </FormItem>
              </Col>
              {/* <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:12}} xxl={{span:8}}>
                    <FormItem label="来源网站">
                        {getFieldDecorator('sourceURL')(
                          <Select placeholder="请选择来源网站" allowClear="true">
                          {this.state.sources.map((source, key) => <Option key={source.id}>{source.websiteName}</Option>)}
                          </Select>
                      )}
                    </FormItem>
                </Col> */}
              <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 8 }} xxl={{ span: 24 }}>
                <div className='ddgo_callForBidsButton'>
                  <Button htmlType="submit" type="primary">查询</Button>
                  <Button htmlType="submit" type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }} onClick={this.handleFormReset}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
    )
  }

  popLoginModal = (level) => {
    switch (level) {
      case -1:
        emitter.emit("loginModal", true);
        break;
      case 0:
        message.info('请升级为会员！');
        break;
    }
  };

  render() {
    let { locationData, userLevel } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '信息名称',
        dataIndex: 'tenderTitle',
        render(val, record) {
          const title = val;

          let srcWeb = record.sourceWeb === 'http://www.sccin.com.cn';
          let s1 = record.pubDateStr;
          s1 = new Date(s1.replace(/-/g, "/"));
          let s2 = new Date();
          let days = s2.getTime() - s1.getTime();
          let time = parseInt(days / (1000 * 60 * 60 * 24));
          let url = 'http://www.sccin.com.cn/InvestmentInfo/ZhaoBiao/' + record.sourceId;

          if (val.length > 40) {
            const showT = `${val.substring(0, 40)}...`;

            if(userLevel<=0) {
              return (<a target="_blank" onClick={() => {
                switch (userLevel) {
                  case -1:
                    emitter.emit("loginModal", true);
                    break;
                  case 0:
                    message.info('请升级为会员！');
                    break;
                }
              }}>{showT}</a>)
            }else {
              return time <= 20 && srcWeb ? <a rel="noreferrer" title={val} href={genelink(url, true)} target="_blank" ><span title={title}>{showT}</span></a> :
                  <a rel="noreferrer" title={val} href={genelink(record.sourceUrl, true)} target="_blank" ><span title={title}>{showT}</span></a>;
            }

          } else {
            if(userLevel<=0) {
              return (<a target="_blank" onClick={() => {
                switch (userLevel) {
                  case -1:
                    emitter.emit("loginModal", true);
                    break;
                  case 0:
                    message.info('请升级为会员！');
                    break;
                }
              }}>{val}</a>)
            }else {
              return time <= 20 && srcWeb ? <a rel="noreferrer" title={val} href={genelink(url, true)} target="_blank" ><span title={title}>{val}</span></a> :
                  <a rel="noreferrer" title={val} href={genelink(record.sourceUrl, true)} target="_blank" ><span title={title}>{val}</span></a>;
            }
          }
        },
      },
      {
        title: '资质类型',
        dataIndex: 'qualificationKeyWords',
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
        title: '地区',
        dataIndex: 'locationId',
        render: (val, row) => {
          return isNaN(parseInt(val)) ? val : locationData[val];
        }
      },
      {
        title: '发布日期',
        dataIndex: 'pubDateStr',
      },
      {
        title: '查看',
        dataIndex: 'sourceUrl',
        render: (val, record) => {
          let srcWeb = record.sourceWeb === 'http://www.sccin.com.cn';
          let s1 = record.pubDateStr;
          s1 = new Date(s1.replace(/-/g, "/"));
          let s2 = new Date();
          let days = s2.getTime() - s1.getTime();
          let time = parseInt(days / (1000 * 60 * 60 * 24));
          let url = 'http://www.sccin.com.cn/InvestmentInfo/ZhaoBiao/' + record.sourceId;

          if(userLevel<=0) {
            return (<a target="_blank" onClick={this.popLoginModal.bind(this, userLevel)}>查看</a>)
          }else {
            return time <= 20 && srcWeb ? <a rel="noreferrer" title={val} href={genelink(url, true)} target="_blank">查看</a> :
                <a rel="noreferrer" title={val} href={genelink(val, true)} target="_blank">查看</a>;
          }

        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `总共 ${total}条`,
      // 第${range[0]}到${range[1]}条
      ...this.state.pagination,
    };
    return (
        <Card bordered={false}>
          <div>
            <div style={{ marginBottom: 30 }}>
              {this.renderSimpleForm()}
            </div>
            <div className="ddgo_enterpriseBidInvite_table">
              <Table
                  dataSource={this.state.list}
                  rowKey={record => record.key}
                  pagination={paginationProps}
                  loading={this.state.loading}
                  columns={columns}
                  onChange={this.handleCompositeTableChange}
              />
            </div>
          </div>
        </Card>
    );
  }
}
EnterpriseBidInviteList = Form.create({})(EnterpriseBidInviteList)
export default EnterpriseBidInviteList;
