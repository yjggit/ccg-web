import React, { PureComponent } from 'react';
import {  DatePicker, Select,  Tag, Tooltip, Row, Col, Table, Card, Form, Input, Button, Cascader, message } from 'antd';
import '../../../css/antd.css';
import './BuilderCompositeSearch.css'
import { stringify } from 'qs';

import styles from '../../../css/StandardTableList.less';
import request from '../../../utils/request'
import genelink from '../../../utils/linkutil';
import Utils from "../../../utils/appUtils";
const FormItem = Form.Item;

class BuilderCompositeSearch extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    builderPermitTags:[],
    personCertTags:[],
    options: [],
    perCertOptions:[],
    children:[],
    outerLocation:[],
    innerLocation:[],
    performCategory:[],
    seledLocal:-1,
    startTime:'',
	  endTime:'',
    selIsLocal:['川外', '川内'],
    targetOption5:{},
    targetOption6:{},
    targetOption7:{},
    targetOption8:{},
  };

  componentDidMount() {
    this.fetchSearchList();
    this.fetchBuilderPermitType();
    this.fetchPersonPermitType();
    this.fetchouterLocation(0);
    this.fetchinnerLocation(1);
    this.fetchPerformCategory();
  }
  
  fetchPerformCategory=()=>{
  	let REQUEST_URL = `/api/perform/category`;
    fetch(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(result => result.json())
      .then((data) => {
        this.setState({
        	performCategory:data,
        });
      });
  }

  fetchouterLocation=(val)=>{
  	let REQUEST_URL = `/api/builder/location?isLocal=${val}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c1)
  }
  c1=(data)=>{
	  this.setState({
          outerLocation:data,
        });
  }
  
  fetchinnerLocation=(val)=>{
  	let REQUEST_URL = `/api/builder/location?isLocal=${val}`;
  	request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c2)
  }
  c2=(data)=>{
        this.setState({
          innerLocation:data,
        });
  }
  
  fetchBuilderPermitType = ()=> {
    let REQUEST_URL = "/api/builder/permit";
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c3)
  }
  c3=(data)=>{
        let convertData = JSON.stringify(data).split('permitTypeId').join('value').split('permitTypeName').join('label');
        let jsonData = JSON.parse(convertData);
        jsonData.map(function(value, key){
          let isleaf={isLeaf: false};
          return Object.assign(value, isleaf);
        });
        this.setState({
          options:jsonData,
        });
  }
  
  fetchPersonPermitType = ()=> {
    let REQUEST_URL = "/api/person/permit";
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c4)
  }
  c4=(data)=>{
        let convertData = JSON.stringify(data).split('personCertTypeId').join('value').split('personCertTypeName').join('label');
      let jsonData = JSON.parse(convertData);
      jsonData.map(function(value, key){
        let isleaf={isLeaf: false};
        return Object.assign(value, isleaf);
      });
        this.setState({
          perCertOptions: jsonData,
        });
  }

  loadBuilderPermitData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;
    let len = selectedOptions.length;
    if(len == 1) {
      this.fetchBuilderPermitItem(targetOption);
    } else {
      this.fetchBuilderPermitLevel(targetOption);
    }
  };
  
  loadPersonPermitData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;
    let len = selectedOptions.length;
    if(len == 1) {
      this.fetchPersonPermitItem(targetOption);
    } else {
      this.fetchPersonPermitLevel(targetOption);
    }
  };
  
  fetchPersonPermitItem = (targetOption)=> {
    const { value } = targetOption;
    this.setState({targetOption5:targetOption});
    let REQUEST_URL = `/api/person/permit/items/${value}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c5)
  }
  c5=(data)=>{
        let convertData = JSON.stringify(data).split('personCertItemId').join('value').split('personCertItemName').join('label');
      let jsonData = JSON.parse(convertData);
      jsonData.map(function(value, key){
        let isleaf={isLeaf: false};
        return Object.assign(value, isleaf);
      });
	      this.state.targetOption5.children = jsonData;
        this.setState({
	          children:this.state.targetOption5.children,
      });
  }
  
  fetchPersonPermitLevel = (targetOption)=> {
    const { value } = targetOption;
    this.setState({targetOption6:targetOption});
    let REQUEST_URL = `/api/person/permit/levels/${value}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c6)
  }
  c6=(data,)=>{
        let convertData = JSON.stringify(data).split('personCertLevelNo').join('value').split('personCertLevelName').join('label');
        let jsonData = JSON.parse(convertData);
        jsonData.map(function(value, key){
          let isleaf={isLeaf: true};
          return Object.assign(value, isleaf);
        });
       this.state.targetOption6.children = jsonData;
        this.setState({
         children:this.state.targetOption6.children,
      });
  }
  
  fetchBuilderPermitLevel = (targetOption)=> {
    const { value } = targetOption;
    this.setState({targetOption7:targetOption});
    let REQUEST_URL = `/api/builder/permit/levels/${value}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c7)
  }
  c7=(data)=>{
        let convertData = JSON.stringify(data).split('permitLevelNum').join('value').split('permitLevelName').join('label');
      let jsonData = JSON.parse(convertData);
      jsonData.map(function(value, key){
        let isleaf={isLeaf: true};
        return Object.assign(value, isleaf);
      });
	      this.state.targetOption7.children = jsonData;
        this.setState({
	          children: this.state.targetOption7.children,
      });
  }
  
  fetchBuilderPermitItem = (targetOption)=> {
    const { value } = targetOption;
    this.setState({targetOption8:targetOption});
    let REQUEST_URL = `/api/builder/permit/items/${value}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c8)
    
  }
  c8=(data)=>{
        let convertData = JSON.stringify(data).split('permitItemId').join('value').split('permitItemName').join('label');
      let jsonData = JSON.parse(convertData);
      jsonData.map(function(value, key){
        let isleaf={isLeaf: false};
        return Object.assign(value, isleaf);
      });
	      this.state.targetOption8.children = jsonData;
        this.setState({
	          children:this.state.targetOption8.children,
      });
  }
  
  handleBuilderPermitChange = (val, selectedOptions) => {
    if (val.length === 0) {
      return;
    }
    let { builderPermitTags } = this.state;
    const SelectedKeys = selectedOptions.map(o => o.value).join('/'); // 1/1/1
    const SelectedVals = selectedOptions.map(o => o.label).join('/ '); // a/b/c
    const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
    let result = builderPermitTags.find(item => item.split(':')[0].startsWith(forSectedkey) == true); // 去除重复的项
    if(result != undefined){ // 同类型同项目有重复，不再添加
       builderPermitTags = this.state.builderPermitTags.filter(tag => tag !== result);
    } 
    const text = `${SelectedKeys}: ${SelectedVals}`;
    if (builderPermitTags.indexOf(text) === -1) {
        builderPermitTags = [...builderPermitTags, text];
        this.setState({
          builderPermitTags,
       });
    }
    this.handleBuilderPermitSearch(builderPermitTags);
    
    setTimeout(() => {
      //   //清空
      this.props.form.setFieldsValue({
        builderPermits:[],
        // dimensionKeys: [0]
      })
    }, 100);
    
  }
  
  handlePersonPermitChange = (val, selectedOptions) => {
    if (val.length === 0) {
      return;
    }
    let { personCertTags } = this.state;
    const SelectedKeys = selectedOptions.map(o => o.value).join('/');
    const SelectedVals = selectedOptions.map(o => o.label).join('/ ');
    const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
    let result = personCertTags.find(item => item.split(':')[0].startsWith(forSectedkey) == true);
    if(result != undefined){ // 同类型同项目有重复，不再添加
    	personCertTags = this.state.personCertTags.filter(tag => tag !== result);
    } 
    const text = `${SelectedKeys}: ${SelectedVals}`;
    if (personCertTags.indexOf(text) === -1) {
        personCertTags = [...personCertTags, text];
        this.setState({
          personCertTags,
        });
    }
    
    this.handlePersonPermitSearch(personCertTags);
    setTimeout(() => {
      //清空
      this.props.form.setFieldsValue({
        personPermits:[],
        // dimensionKeys: [0]
      })
    }, 100);
    
  }
  
  handleBuilderPermitSearch= (builderPermitTags) => {
	  const { personCertTags,startTime,endTime } = this.state;
      const paramTag = { builderPermits: builderPermitTags.map(tag => tag.split(':')[0]).join(',') };
      const paramCertTag = { personPermits: personCertTags.map(tag => tag.split(':')[0]).join(',') };

      const values = Object.assign(paramTag, paramCertTag,this.state.formValues);
      const param = {
      	projectStart:startTime,
      	projectEnd:endTime,
      	...values,	
      };
      this.fetchSearchList(param);
  }
  
  handlePersonPermitSearch= (personCertTags) => {
	  const { builderPermitTags,startTime,endTime } = this.state;
      const paramTag = { builderPermits: builderPermitTags.map(tag => tag.split(':')[0]).join(',') };
      const paramCertTag = { personPermits: personCertTags.map(tag => tag.split(':')[0]).join(',') };

      const values = Object.assign(paramTag, paramCertTag,this.state.formValues);
      const param = {
      	projectStart:startTime,
      	projectEnd:endTime,
      	...values,	
      };
      this.fetchSearchList(param);
  }
  
  handlePermitClose = (removedTag) => {
    const builderPermitTags = this.state.builderPermitTags.filter(tag => tag !== removedTag);
    //this.handleBuilderPermitSearch(builderPermitTags);
    this.setState({ builderPermitTags });
    this.handleBuilderPermitSearch(builderPermitTags);
  }

  handlePerCertClose = (removedTag) => {
    const personCertTags = this.state.personCertTags.filter(personCertTags => personCertTags !== removedTag);
    //this.handlePersonPermitSearch(personCertTags);
    this.setState({ personCertTags });
    this.handlePersonPermitSearch(personCertTags);
  }
  
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      builderPermitTags: [],
      personCertTags:[],
      startTime:'',
  	  endTime:'',
    });
    this.fetchSearchList();
  }
  
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        const { builderPermitTags,personCertTags,startTime,endTime } = this.state;
        const paramTag = { builderPermits: builderPermitTags.map(tag => tag.split(':')[0]).join(',') };
        const paramCertTag = { personPermits: personCertTags.map(tag => tag.split(':')[0]).join(',') };

        Reflect.deleteProperty(fieldsValue, 'builderPermits');
        Reflect.deleteProperty(fieldsValue, 'personPermits');
        Reflect.deleteProperty(fieldsValue, 'projectStart');
        Reflect.deleteProperty(fieldsValue, 'projectEnd');
        const values = Object.assign(paramTag, paramCertTag,fieldsValue);
        this.setState({
          formValues: values,
        });
        const param = {
	      	projectStart:startTime,
	      	projectEnd:endTime,
	      	...values,	
	    };
	    this.fetchSearchList(param);
      });
  }
  
  fetchSearchList=(params)=>{
    console.log(this.state.builderPermitTags)
  	let REQUEST_URL = `/api/builder/filter/composite?${stringify(params)}`;
    this.setState({ loading: true });
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c9)
  }
  c9=(data)=>{
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
  
  handleCompositeTableChange = (pagination, filtersArg, sorter) => {
      const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      projectStart:this.state.startTime,
  	  projectEnd:this.state.endTime,
      ...this.state.formValues,
    };
    this.fetchSearchList(params);
  }
  
  changeSearch = (param)=>{
    const params = {
      projectStart:this.state.startTime,
  	  projectEnd:this.state.endTime,
      ...this.state.formValues,
      ...param,
    };
    this.fetchSearchList(params);
  }
  
  handleLocationChange = (value) => {
    this.changeSearch({isLocal:this.state.seledLocal,location: value});
  }
  
  handleIsLocalChange = (value) => {
    const { form } = this.props;
    form.resetFields('location');
   this.setState({
    seledLocal: value,
   });
   this.changeSearch({isLocal: value});
    
  }
  
  handleStartDateOnChange = (value, dateString) => {
    this.setState({startTime:dateString});
  }
  handleEndDateOnChange = (value, dateString) => {
    this.setState({endTime:dateString});
  }
  
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { builderPermitTags, personCertTags, seledLocal,outerLocation,innerLocation, performCategory} = this.state;
    let enteLocation;
    if(seledLocal == 1){
      enteLocation = innerLocation;
    } else if (seledLocal == 0){
      enteLocation = outerLocation;
    } else {
    	enteLocation = [];
    }
    const locationOptions = enteLocation.map(lo => <Select.Option key={lo}>{lo}</Select.Option>);
    const performCategoryOptions = performCategory.map(lo => <Select.Option key={lo.projectTypeId}>{lo.projectTypeName}</Select.Option>);
    return (
      <div id="compositeSearchInput">
        <Row>
          <Form onSubmit={this.handleSearch}>
            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="企业资质">
              {getFieldDecorator('builderPermits')(
                    <Cascader
                      options={this.state.options}
                  	  loadData={this.loadBuilderPermitData}
                  	  onChange={this.handleBuilderPermitChange}
                      allowClear={true}
                      placeholder="请选择..." />
                  )}
              </FormItem>
            </Col>
            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="人员证书">
                  {getFieldDecorator('personPermits')(
                    <Cascader
                      options={this.state.perCertOptions}
                      loadData={this.loadPersonPermitData}
                      onChange={this.handlePersonPermitChange}
                      placeholder="请选择..." />
                    )}
                </FormItem>
            </Col>
            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="业绩类型">
                    {getFieldDecorator('projectType')(
                      <Select placeholder="请选择" allowClear="true">
                      	<Select.Option value="-1">不限</Select.Option>
                        {performCategoryOptions}
                      </Select>
                    )}
                </FormItem>
            </Col>
            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                <FormItem label="业绩金额">
                    {getFieldDecorator('projectPrice')(
                      <Input id="projectPriceInput" placeholder="请输入金额" />
                    )}
                    <span id="projectPriceSpan" style={{padding:"0 5px"}}>万元</span>
                </FormItem>
            </Col>
            <Col id="projectNum" xs={{span:24}} sm={{span:12}}  md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                <FormItem label="业绩数量" >
                  {getFieldDecorator('projectNum')(
                      <Input className="projectPriceInput" placeholder="请输入数量" />
                    )}
                </FormItem>
            </Col>
            <Col xs={{span:24}} sm={{span:12}}  md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                <FormItem label="业绩时间">
                  {getFieldDecorator('projectStart')(
                    <div>
                      <DatePicker.MonthPicker 
                        placeholder="开始日期" 
                        onChange={this.handleStartDateOnChange} />
                    </div>
                  )} 
                  <span style={{padding:"0 5px",float:"left"}}>-</span>
                  {getFieldDecorator('projectEnd')(
                    <div>
                      <DatePicker.MonthPicker 
                        placeholder="截止日期" 
                        onChange={this.handleEndDateOnChange} />
                    </div>
                  )}
                </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
              <FormItem label="川内·川外">
                {getFieldDecorator('isLocal')(
                  <Select placeholder="请选择" placeholder="请选择" onChange={this.handleIsLocalChange} allowClear="true">
                    <Select.Option value="-1">不限</Select.Option>
                    <Select.Option value="1">川内</Select.Option>
                    <Select.Option value="0">川外</Select.Option>
                </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={{span:12}} sm={{span:12}} md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
	          <FormItem label="注册地区">
	            {getFieldDecorator('location')(
	              <Select placeholder="请选择注册地区" onChange={this.handleLocationChange} allowClear="true">
	              	<Select.Option value="">不限</Select.Option>
	                {locationOptions}
	              </Select>
	            )}
	          </FormItem>
	        </Col>
            <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:21}} xl={{span:21}} xxl={{span:21}}>
                <div id="moreChoose">
                    <p className='searchBoxTitel'>已选条件：</p>
                    <div className='searchClassItem'>
                        <Col xs={{span:24}} sm={{span:24}}  md={{span:24}} lg={{span:12}} xl={{span:12}}>
                                <span>
                                    {builderPermitTags.map((tag) => {
                                        const displayTag = tag.split(':')[1];
                                        const isLongTag = displayTag.length > 20;
                                        const tagElem = (
                                          <Tag key={tag} closable afterClose={() => this.handlePermitClose(tag)}>
                                            {isLongTag ? `${displayTag.slice(0, 20)}...` : displayTag}
                                          </Tag>
                                        );
                                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                                      })}
                                </span>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}}  md={{span:24}}  lg={{span:12}} xl={{span:12}}>
                            <span>
                              {personCertTags.map((tag) => {
                                const displayTag = tag.split(':')[1];
                                const isLongTag = displayTag.length > 20;
                                const tagElem = (
                                  <Tag key={tag} closable afterClose={() => this.handlePerCertClose(tag)}>
                                    {isLongTag ? `${displayTag.slice(0, 20)}...` : displayTag}
                                  </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                              })}
                            </span>
                        </Col>
                    </div>
                </div>
            </Col>
            <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:3}} xl={{span:3}} xxl={{span:3}}>
              <span className={styles.submitButtons}>
                  <Button style={{ marginLeft: 8 ,marginTop:5 ,backgroundColor:'#348bda',color:'#fff' }} htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 ,marginTop:5 ,backgroundColor:'#f29700',color:'#fff' }} onClick={this.handleFormReset}>重置</Button>
              </span>
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
      const isLocal = ['川外', '川内'];
      let location;
      if(this.state.selIsLocal == 0){
          location = this.state.outerLocation.map(function(value,key){
              return {text:value,value:value};
          });
      } else {
          location = this.state.innerLocation.map(function(value,key){
              return {text:value,value:value};
          });
      }

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '企业名称',
        dataIndex: 'builderName',
        render: (text, row, index) => (
          <a target="_blank" href={genelink('/show/ente/' + row.builderId,false)}>{row.builderName}</a>
        ),
      },
      {
        title: '法定代表人',
        dataIndex: 'legalPerson',
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'builderIDCard',
      },
      {
        title: '属地',
        dataIndex: 'location',
      },
      {
        title: '操作',
        dataIndex: 'builderId',
        render: val => (
          <a target="_blank" href={genelink('/show/ente/' + val,false)}>查看</a>
        ),
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableListForm} style={{marginBottom:'20px'}}>
          {this.renderForm()}
        </div>

        <div id="compositeSearch">
          <Table
            dataSource={this.state.list}
            rowKey={record => record.key}
            loading={this.state.loading}
            pagination={{ total: this.state.pagination.total, current:this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 条记录` }}
            columns={columns}
            onChange={this.handleCompositeTableChange}
          />
        </div>
      </Card>
    );
  }
}
BuilderCompositeSearch = Form.create({})(BuilderCompositeSearch)
export default BuilderCompositeSearch;