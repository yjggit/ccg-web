import React, { PureComponent } from 'react';
import {Select, message, Row, Col,Modal, Table, Card, Form, Input, Button,  } from 'antd';
import InvoiceShow from '../../showinvoice/InvoiceShow';
import { stringify } from 'qs';
import request from '../../../utils/request';
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class InvoiceManageList extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    modalVisible:false,
    editItem:{},
  };

  componentDidMount() {
    this.fetchTableList({
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
    const { form, dispatch } = this.props;
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
    let REQUEST_URL = `/api/invoice/listInvoinceApply/?${stringify(params)}`;
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchTableList({});;
  }
 

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col span={8}>
            <FormItem label="开票公司:">
              {getFieldDecorator('applyEnteName')(
                <Input placeholder="请输入申请开票公司名称"  />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="发票抬头">
              {getFieldDecorator('invHeader')(
                <Input placeholder="请输入发票抬头信息"  />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
          <FormItem label="申请人姓名">
          {getFieldDecorator('userName')(
            <Input placeholder="请输入发票开票申请人名字"  />
          )}
        </FormItem>
        </Col>
        </Row>
        <Row>
        <Col span={8}>
          <FormItem label="发票状态:">
            {getFieldDecorator('invStatus')(
            	<Select placeholder="请选择" style={{ width: '60%' }}>
                     <Select.Option value="1">申请中</Select.Option>
                     <Select.Option value="2">已开票</Select.Option>
                     <Select.Option value="3">已拒开</Select.Option>
                </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="发票税号">
            {getFieldDecorator('inNo')(
              <Input placeholder="请输入发票税号"  />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
        <span>
        <Button type="primary" htmlType="submit">查询</Button>
        <Button style={{ marginLeft: 8 ,backgroundColor:'#f29700',color:'#fff' }} onClick={this.handleFormReset}>重置</Button>
      </span>
        </Col>
      </Row>
    </Form>
    )
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
	    console.log('params:', params);
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
	  
	  const forType=['公司','个人'];
	  const invType=['增值税普通发票','增值税专用发票'];
	  const invStatusMap=['申请中','已开票','已拒开'];
	 
	  
	  
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '发票抬头',
        dataIndex: 'invHeader',
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
        title: '发票税号',
        dataIndex: 'inNo',
        render(val) {
          const title = val;
          if(val != null && val.length > 25 ) {
            const showT = `${val.substring(0,25)}...`;
            return <span title={title}>{showT}</span>;
          } else {
            return <span title={title}>{val}</span>;
          }
        },
      },
      {
        title: '申请公司',
        dataIndex: 'applyEnteName',
      },
      {
          title: '申请金额',
          dataIndex: 'invMoney',
          render:(val) =>{
        	  return "￥"+val+"元"
          }
       },
      {
          title: '申请人',
          dataIndex: 'userName',
      },
       {
            title: '状态',
            dataIndex: 'invStatus',
            render:(val) =>{
            	if(val===1){
            		return "申请中"
            	}else if(val===2){
            		return "已开票"
            	}else if(val===3){
            		return "已拒开"
            	}
            }
       },
       {
           title: '申请时间',
           dataIndex: 'applyDate',
           render:(val) =>{
        	     let d = new Date(val);
        		 let dateStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        		 return  dateStr;
           }
      },
      {
        title: '查看',
        dataIndex: 'id',
        render: (val,record) => (
          <a title="查看"  onClick={() => this.handleShowClick(record)} >查看</a>
        ),
      }, {
          title: '操作',
          dataIndex: 'id',
          render: (val,record) => {
            if(record.invStatus===1){
            	 return <span> <a title="开票"  onClick={() => this.handleDoInvoice(record)} >开票</a>&nbsp;/&nbsp;  <a title="拒开"  onClick={() => this.handleRejectInvoice(record)} >拒开</a> </span>
            }else{
            	 return "---"	
            }
          },
        },
    ];

    const { options, perCertOptions } = this.props;
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      ...this.state.pagination,
    };
    const {modalVisible,editItem} = this.state;
    return (
    <div>
      <Card bordered={false}>
          <div>
          <div style={{marginBottom:30}}>
              {this.renderSimpleForm()}
            </div>
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
InvoiceManageList = Form.create({})(InvoiceManageList)
export default InvoiceManageList;