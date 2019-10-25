import React, { Component } from 'react';
import { Radio , Tabs, message,InputNumber, Row, Col, Table, Card, Form, Input, Button } from 'antd';
import '../../../css/antd.css';
import './BuilderCreditSearch.css'

import styles from '../../../css/StandardTableList.less';
import { stringify } from 'qs';

import request from '../../../utils/request';
import genelink from '../../../utils/linkutil';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class BuilderCreditSearch extends Component {

  state = {
    list: [],
    pagination: {},
    formValues: {},
    loading: false,
    rankType: 1,
    creditType: 1,
  };

  componentDidMount() {
    this.fetchSearchList({
      creditType: 1,
      rankType: 1,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchSearchList({
	    creditType: this.state.creditType,
	    rankType: this.state.rankType,
	  });
  }
  
  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;
    message.config({
      top: 380,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        creditType: this.state.creditType,
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      this.fetchSearchList(values);
    });
  }
  
  handleTableChange = (pagination) => {
    const { formValues, creditType } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      creditType: creditType,
      ...formValues,
    };

    this.fetchSearchList(params);
  }

  changeSearch = (param)=>{
    const { form } = this.props;
    
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        const values = Object.assign(param);
        this.setState({
          formValues: values,
        });
        
        const params = {
	      ...values,
	    };

       this.fetchSearchList(params);
      });
  }

  handleTabChange = (activeKey) => {
    this.setState({
      creditType: activeKey,
      pagination: {},
    });
    this.handleFormReset();
    this.changeSearch({creditType: activeKey, rankType: 1});
  }

  onRankTypeChange = (e) => {
    this.setState({
      rankType: e.target.value,
    });
    this.changeSearch({creditType: this.state.creditType, rankType: e.target.value});
  }
    
  fetchSearchList=(params)=>{
  	let REQUEST_URL = `/api/builder/credit/rank?${stringify(params)}`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c1)
  }
  c1=(data)=>{
	  const { pageSize, current } = data.pagination;
	    const startno = (current - 1) * pageSize;
	    if ( data.list != null) {
	      data.list.map(function(value, key){
	        let nm={no:startno+key+1};
	        return Object.assign(value, nm);
	      });
	    }
      this.setState({
        list: data.list,
        loading: false,
        pagination: data.pagination
      }); 
  }
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="creditSearchInput">
        <Row>
          <Form onSubmit={this.handleSearch}>
            <Col xs={{span:24}}  sm={{span:24}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="企业名称">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入企业名称" />
                )}
              </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="排名范围">
                {getFieldDecorator('startRank')(
                  <InputNumber min={1} defaultValue={1} step={1} placeholder="" />
                )}
                <span style={{padding:"0 5px"}}>-</span>
                {getFieldDecorator('endRank')(
                  <InputNumber  min={1} defaultValue={1} step={1} placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="信用得分">
                {getFieldDecorator('startScore')(
                  <InputNumber  min={1} defaultValue={1} step={1} placeholder="" />
                )}
                <span style={{padding:"0 5px"}}>-</span>
                {getFieldDecorator('endScore')(
                  <InputNumber  min={1} defaultValue={1} step={1} placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}} id="creditChooseToday">
              <FormItem label="">
                {getFieldDecorator('rankType', {initialValue:1})(
                  <RadioGroup onChange={this.onRankTypeChange}>
                    <Radio value={1}>今日排名</Radio>
                    <Radio value={2}>60日排名</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8,backgroundColor:'#f29700',color:'#fff' }} onClick={this.handleFormReset}>重置 </Button>
              </span>
            </Col>
          </Form>
        </Row>
     
    </div>
    );
  }

  render() {

    const { list, pagination, loading } = this.state;
    
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '企业名称',
        dataIndex: 'builderName',
        render: (text, row, index) => (
          <a target="_blank" href={genelink('http://pt.cdcc.gov.cn:8024/Integrity/ComprehensiveOrder/ConstructCompanInfoPage.aspx?id=' + row.creditGuid + "&CompanyGuid="+row.builderGuid+'&tps=sgszCertType',true)}>{row.builderName}</a>
        ),
      },
      {
        title: '今日排名',
        dataIndex: 'rankIndex',
      },
      {
        title: '今日得分',
        dataIndex: 'totalScore',
      },
      {
        title: '60日排名',
        dataIndex: 'averageIndex',
      },
      {
        title: '60日得分',
        dataIndex: 'averageScore',
      },
      {
        title: '发布日期',
        dataIndex: 'visiableTime',
      },
      {
        title: '查看',
        render: (text, row, index) => (
          <a target="_blank" href={genelink('http://pt.cdcc.gov.cn:8024/Integrity/ComprehensiveOrder/ConstructCompanInfoPage.aspx?id=' + row.creditGuid + "&CompanyGuid="+row.builderGuid+'&tps=sgszCertType',true)}>查看</a>
        ),
      },
    ];
    const { pageSize, current } = pagination;
    const startno = (current - 1) * pageSize;
    if ( list != null) {
      list.map(function(value, key){
        let nm={no:startno+key+1};
        return Object.assign(value, nm);
      });
    }
    return (
      <Card bordered={false}>
        <Tabs
          onChange={this.handleTabChange}
          defaultActiveKey="1"
          type="card"
        >
          <TabPane tab="施工-房建" key="1">
          </TabPane>
          <TabPane tab="施工-市政" key="2">
          </TabPane>
        </Tabs>
        {this.renderForm()}
        <div id="creditSearch">
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={{ total: this.state.pagination.total, current:this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 条记录` }}
            onChange={this.handleTableChange}
            locale = {locale}
          />
        </div>
      </Card>
    );
  }
}
BuilderCreditSearch = Form.create({})(BuilderCreditSearch)
export default BuilderCreditSearch;