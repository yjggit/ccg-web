import React, { PureComponent } from 'react';
import {DatePicker, Select, InputNumber, Row, Col, Table, Card, Form, Input, Button, message, Tooltip} from 'antd';
import '../../../css/antd.css';
import moment from 'moment';
import { stringify } from 'qs';
import './EnterpriseBidresult.css'

import styles from '../../../css/StandardTableList.less';
import request from '../../../utils/request';
import genelink from '../../../utils/linkutil';
import Utils from "../../../utils/appUtils";
import emitter from "../../../event";

const Option = Select.Option;
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class EnterpriseBidresult extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    startDate: '',
    endDate: '',
    locations: [],
    sources: [],
    aptitude: [],
    aptitudeData: [],
    locationData: [],
    userLevel: -1,
  };

  componentDidMount() {
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
    this.fetchTableList({});
    this.fetchSourceURL();
    this.fetchLocations();
    request('/api/pub/dicttype/query/aptitudeType', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      let aptitudeData = {};
      res.data.map(aptitude => {
        aptitudeData[aptitude.id] = aptitude.title
      })
      this.setState({
        aptitude: res.data.filter(d => d.id !== 10005),
        aptitudeData: aptitudeData
      })
    })
  }

  fetchLocations = () => {
    request("/api/builder/builderLocation?isLocal=1", {
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
      this.setState({ locations: res, locationData: locationData })
    });
  }

  fetchSourceURL = () => {
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
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    const { form } = this.props;

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      fieldsValue["startDate"] = null;
      fieldsValue["endDate"] = null;
      const values = {
        issueStart: startDate,
        issueEnd: endDate,
        ...fieldsValue,
        startPrice: fieldsValue['startPrice'] ? fieldsValue['startPrice'] * 10000 : 0,
        endPrice: fieldsValue['endPrice'] ? fieldsValue['endPrice'] * 10000 : 0,
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
    this.fetchTableList({});;
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

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      issueStart: this.state.startDate,
      issueEnd: this.state.endDate,
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
    let REQUEST_URL = `/api/bid/result?${stringify(params)}`;
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
    // this.props.form.resetFields();
    this.fetchTableList({});
  }
  handleStartDateOnChange = (value, dateString) => {
    this.setState({ startDate: dateString });
  }
  handleEndDateOnChange = (value, dateString) => {
    this.setState({ endDate: dateString });
  }
  renderNumberFormatW = (num, num2 = 10000) => {
    if (/^[0-9.]*$/.test(num)) {
      if (!num || num < 0) {
        return '0万元';
      }
      return (parseInt(num) / num2) + "万元";
    } else {
      return num;
    }
  }

  string2Tooltips = (price) => {
    if (!price) return '';
    const str = this.renderNumberFormatW(price);
    const isLongTag = str.length > 12;
    const tagElem = isLongTag ? `${str.slice(0, 12)}...` : str;
    return isLongTag ? <Tooltip title={str} >{tagElem}</Tooltip> : tagElem;
  }

  disabledDate = (date) => {
    // 1514736000000
    return date && (date.valueOf() < 1514736000000 || date.valueOf() > new Date().getTime());
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { startDate, endDate, aptitude } = this.state;
    let dateFormat = 'YYYY-MM-DD';
    // let startDateStr = startDate;
    // let endDateStr = endDate;
    // if (startDateStr == null || startDateStr == '') {
    //   const bef = 1296000000;
    //   let now = new Date();
    //   const beforefifteen = now.getTime() - bef;
    //   const beforeDate = new Date(beforefifteen);
    //   startDateStr = beforeDate.getFullYear() + "-" + (beforeDate.getMonth() + 1) + "-" + beforeDate.getDate();
    //   endDateStr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    // }
    return (
        <div className='ddgo_acceptanceOfBid_Search'>
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="项目名称">
                  {getFieldDecorator('bidTitle')(
                      <Input placeholder="请输入项目名称信息关键字" />
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="中标企业">
                  {getFieldDecorator('builderName')(
                      <Input placeholder="请输入中标企业名称关键字" />
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="资质类型">
                  {getFieldDecorator('aptitude')(
                      <Select placeholder="请选择资质类型" allowClear="true">
                        {aptitude.map((source, key) => <Option key={source.id}>{source.title}</Option>)}
                      </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="川内地区">
                  {getFieldDecorator('location')(
                      <Select placeholder="请选择地区" allowClear="true">
                        {this.state.locations.map((location, key) => <Option key={location.localId}>{location.localName}</Option>)}
                      </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="金额(万元)">
                  <div className='ddgo_acceptanceOfBid_AmountRange'>
                    {getFieldDecorator('startPrice')(
                        <InputNumber min={1} step={1} placeholder="请输入" />
                    )}
                    <span style={{ lineHeight: "32px", float: "left" }}>&nbsp;-&nbsp;</span>
                    {getFieldDecorator('endPrice')(
                        <InputNumber min={1} step={1} placeholder="请输入" />
                    )}
                  </div>

                </FormItem>
              </Col>
              <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                <FormItem label="发布日期">
                  <div className='ddgo_acceptanceOfBid_Time'>
                    {getFieldDecorator('startDate')(
                        <DatePicker
                            format={dateFormat}
                            disabledDate={this.disabledDate}
                            placeholder="开始"
                            onChange={this.handleStartDateOnChange} />
                    )}
                    <span style={{ lineHeight: "32px", float: "left" }}>&nbsp;-&nbsp;</span>
                    {getFieldDecorator('endDate')(
                        <DatePicker placeholder="截止"
                                    format={dateFormat}
                                    disabledDate={this.disabledDate}
                                    onChange={this.handleEndDateOnChange} />
                    )}
                  </div>

                </FormItem>
              </Col>
              <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 6 }}>
                <div className='ddgo_acceptanceOfBidButton'>
                  <Button htmlType="submit" type="primary">查询</Button>
                  <Button htmlType="reset" type="danger" onClick={this.handleFormReset} style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>

        </div>
    );
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
    let { locationData, aptitudeData, userLevel } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '中标信息',
        dataIndex: 'bidTitle',
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
        title: '中标企业',
        dataIndex: 'builderName',
        align: 'center',
        render(val, record) {
          const title = val;
          if (val != null && val.length > 25) {
            const showT = `${val.substring(0, 25)}...`;
            // return <a href={genelink(`/show/enteByName/${val}`, false)} title={title} target="_blank">
            //   {userLevel<=0 ? showT.replace(title.substring(2, 8), '******') : showT}</a>;

              return userLevel<=0 ? <a target="_blank" onClick={() => {
                      switch (userLevel) {
                          case -1:
                              emitter.emit("loginModal", true);
                              break;
                          case 0:
                              message.info('请升级为会员！');
                              break;
                      }
                  }}>{showT.replace(title.substring(2, 8), '******')}</a> :
                  <a href={genelink(`/show/enteByName/${val}`, false)} title={title} target="_blank">{showT}</a>

          } else {
            // return <a href={genelink(`/show/enteByName/${val}`, false)} title={title} target="_blank">
            //   {userLevel<=0 ? val.replace(val.substring(2, 8), '******') : val}</a>;

              return userLevel<=0 ? <a target="_blank" onClick={() => {
                      switch (userLevel) {
                          case -1:
                              emitter.emit("loginModal", true);
                              break;
                          case 0:
                              message.info('请升级为会员！');
                              break;
                      }
                  }}>{title.replace(val.substring(2, 8), '******')}</a> :
                  <a href={genelink(`/show/enteByName/${val}`, false)} title={title} target="_blank">{val}</a>
          }

        },
      }, {
        title: '资质类型',
        dataIndex: 'aptitudeId',
        render: (val, row) => {
          return aptitudeData[val]
        }
      },
      {
        title: '地区',
        dataIndex: 'locationId',
        render: (val, row) => {
          return locationData[val]
        }
      },
      {
        title: '金额',
        dataIndex: 'money',
        render: (val, row) => {
          return this.string2Tooltips(val)
        }
      }, {
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
      showTotal: (total, range) => ` 总共 ${total}条`,
      // 第${range[0]}到${range[1]}条
      ...this.state.pagination,
    };
    return (
        <Card bordered={false} >
          <div style={{ marginBottom: 30 }}>
            {this.renderSimpleForm()}
          </div>
          <div className="ddgo_enterpriseBidresult_table">
            <Table
                dataSource={this.state.list}
                rowKey={record => record.key}
                pagination={paginationProps}
                loading={this.state.loading}
                columns={columns}
                onChange={this.handleCompositeTableChange}
            />
          </div>
        </Card>
    );
  }
}

EnterpriseBidresult = Form.create({})(EnterpriseBidresult)
export default EnterpriseBidresult;
