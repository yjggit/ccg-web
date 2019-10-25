import React, { PureComponent } from 'react';
import {  message, Row, Col,Modal, Table, Form, Input, Button } from 'antd';
import InvoiceShow from '../showinvoice/InvoiceShow';
import { stringify } from 'qs';

import request from '../../utils/request';
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


class NoticeInfo extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    modalVisible:false,
    editItem:{},
    useId:'',
  };

  componentDidMount() {
		let userId = null;
        let userinfot = sessionStorage.getItem("userinfo") ;
     	  if(userinfot!=null&&userinfot!=undefined){
     		  let userObj = JSON.parse(userinfot);
     			if(userObj){
     				userId = userObj.data.userId;
     			}
     	 }
      
     	  if(userId===null||userId===undefined){
     		  return ;
     	  }
	  
    this.fetchTableList({
    	userId:userId,
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    const { form } = this.props;

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const values = {
        startDate,
        endDate,
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      this.fetchTableList({...values});
    });
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({});;
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
    if(params==undefined){
      params={};
    }
    console.log('params:', params);
    let REQUEST_URL = `/api/notice/listNotice?${stringify(params)}`;
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
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({});;
  }
 
  handleShowClick = (item)=>{
	  this.setState({modalVisible:true,editItem:item});
  }
  handleCancel = ()=>{
	  this.setState({modalVisible:false,editItem:{}});
  }
  handleDoInvoice =(record) =>{
	  let userinfo = sessionStorage.getItem("userinfo") ;
	  let userObj = JSON.parse(userinfo);
	  var params={
			  userId:userObj.data.userId,
			  appId:record.id,
	  }
	    let REQUEST_URL = `/api/invoice/doInvoiceApply`;
	    this.setState({ loading: true });
	    request(REQUEST_URL, {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify(params)
	    },this.c2)
	  
  }
  c2=(data)=>{
	  if(data.status==='ok'){
		  this.fetchTableList();
	  }else{
		  message.success(`${data.message}`,1)
	  }
  }
  handleRejectInvoice =(record) =>{
	  let userinfo = sessionStorage.getItem("userinfo") ;
	  let userObj = JSON.parse(userinfo);
	  var params={
			  userId:userObj.data.userId,
			  appId:record.id,
	  }
	    console.log('params:', params);
	    let REQUEST_URL = `/api/invoice/doRejectInvoiceApply`;
	    this.setState({ loading: true });
	    fetch(REQUEST_URL, {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body:JSON.stringify(params)
	    },this.c3)
	  
  }
  c3=(data)=>{
	  if(data.status==='ok'){
		  this.fetchTableList();
	  }else{
		  message.success(`${data.message}`,1)
	  }
  }
  
  render() {
	  
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '通知标题',
        dataIndex: 'noticeTitle',
        render(val,record) {
          const title = val;
          if ( val.length > 40) {
            const showT = `${val.substring(0,40)}...`;
            return <a title={val} href={record.sourceUrl} target="_blank" ><span title={title}>{showT}</span></a>;
          } else {
            return <a title={val} href={record.sourceUrl} target="_blank" ><span title={title}>{val}</span></a>;
          }
        },
      },
       {
           title: '产生时间',
           dataIndex: 'createDate',
           render:(val) =>{
        	     let d = new Date(val);
        		 let dateStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" ";
        		 return  dateStr;
           }
      },
      {
          title: '操作',
          dataIndex: 'id',
          render: (val,record) => {
            return <span> <a title="查看"  onClick={() => this.handleShowClick(record)} >查看</a> / <a title="删除"  onClick={() => this.handleDoInvoice(record)} >删除</a>&nbsp;/&nbsp;  <a title="拒开"  onClick={() => this.handleRejectInvoice(record)} >拒开</a> </span>
          },
        },
    ];

    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      ...this.state.pagination,
    };
    const {modalVisible,editItem} = this.state;
    return (
    <div>
		    <Form onSubmit={this.handleSearch} layout="inline">
			    <Row>
			      <Col span={12} >
			        <FormItem label="通知标题:">
			          {getFieldDecorator('noticeTitle')(
			            <Input placeholder="通知标题"  />
			          )}
			        </FormItem>
			      </Col>
			      <Col span={12}>
			      <span>
			      <Button type="primary" htmlType="submit">查询</Button>
			      <Button style={{ marginLeft: 8 ,backgroundColor:'#f29700',color:'#fff' }} onClick={this.handleFormReset}>重置</Button>
			    </span>
			      </Col>
			    </Row>
		   </Form>	
           <Table
              dataSource={this.state.list}
              rowKey={record => record.key}
              pagination={paginationProps}
              loading={this.state.loading}
              columns={columns}
              onChange={this.handleCompositeTableChange}
            />
	        <Modal
	        title="查看"
	        visible={modalVisible}
	        onCancel={this.handleCancel}
	        footer={[
	            <Button key="关闭" onClick={this.handleCancel}>关闭</Button>,
	          ]}
	      >
	        <InvoiceShow
	          item={editItem}
	        />
	      </Modal>
        </div>
    );
  }
}
NoticeInfo = Form.create({})(NoticeInfo)
export default NoticeInfo;