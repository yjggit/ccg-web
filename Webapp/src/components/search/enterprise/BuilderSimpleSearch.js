import React, { PureComponent } from 'react';
import { Select, Row, Col, Table, Card, Form, Input, Button, message } from 'antd';
import '../../../css/antd.css';
import { stringify } from 'qs';
import styles from '../../../css/StandardTableList.less';
import "./BuilderSimpleSearch.css"
import request from '../../../utils/request';
import genelink from '../../../utils/linkutil';
import Utils from "../../../utils/appUtils";
import emitter from "../../../event";
const FormItem = Form.Item;
class BuilderSimpleSearch extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    outerLocation:[],
    innerLocation:[],
    builderCategory:[],
    seledLocal:-1,
  };

  componentDidMount() {
    let level = Utils.getUserType();
    let isValid = Utils.isValid();
    let isUser = Utils.isUser();
    if(isUser) {
      this.setState({ userLevel: isValid ? level : 0 });
    }else {
      this.setState({ userLevel: -1 });
    }
    this.eventEmitter = emitter.addListener("updateUserLevel", (level) => {
      this.setState({
        userLevel: level
      });
    });
    this.fetchSearchList();
    this.fetchBuilderCategory();
    this.fetchOuterLocation(0);
    this.fetchInnerLocation(1);
  }

  fetchSearchList=(params)=>{
  	let REQUEST_URL = `/api/builder/filter/simple?${stringify(params)}`;
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

  fetchOuterLocation=(val)=>{
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
	          outerLocation:data,
	        });
  }

  fetchInnerLocation=(val)=>{
  	let REQUEST_URL = `/api/builder/location?isLocal=${val}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c3)
  }
  c3=(data)=>{
	   this.setState({
	          innerLocation:data,
	        });
  }
  fetchBuilderCategory=()=>{
  	let REQUEST_URL = `/api/builder/category`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },this.c4)
  }
  c4=(data)=>{
	     this.setState({
	        	builderCategory:data,
	        });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { userLevel } = this.state;
    if(userLevel <= 0) {
      this.popUpLoginModal(userLevel);
      return;
    }
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...values,
      };

      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }

      this.setState({
        formValues: values,
      });

      this.fetchSearchList(params);
    });

    // const params = {
    //   currentPage: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    // this.fetchSearchList(params);
  }

  handleIsLocalChange = (value) => {
      const { form } = this.props;
      form.resetFields('location');
      this.setState({
          seledLocal: value,
      });

      form.validateFields((err, fieldsValue) => {
          if (err) return;
          const params = {
              ...fieldsValue,
              isLocal: value,
          };
          // console.log('params passed in:', params);
          this.fetchSearchList(params);
      });

      // const params = {
      //     ...this.state.formValues,
      //     isLocal: value,
      // };

  };

  handleLocationChange = (value) => {
    this.changeSearch({isLocal:this.state.seledLocal,location: value});
  }

  changeSearch = (param)=>{
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
        if (err) return;

        this.setState({
          formValues: fieldsValue,
        });

        const params = {
            ...fieldsValue,
            ...param,
        };

       this.fetchSearchList(params);
      });
  }

  handleSimpleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

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

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchSearchList();
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { seledLocal,outerLocation,innerLocation,builderCategory} = this.state;
    let enteLocation;
    if(seledLocal == 1){
    	enteLocation = innerLocation;
    } else if (seledLocal == 0){
    	enteLocation = outerLocation;
    } else {
    	enteLocation = [];
    }
    const locationOptions = enteLocation.map(lo => <Select.Option key={lo}>{lo}</Select.Option>);
   return (
      <div id="simpleSearchInput">
        <Row>
          <Form onSubmit={this.handleSimpleSearch}>
            <Col md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:6}}>
              <FormItem label="企业名称">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:6}}>
              <FormItem label="企业类型">
                {/*<Input disabled="disabled" placeholder="施工企业"/>*/}
                {getFieldDecorator('builderType')(
                  <Select initialValue="-1"  placeholder="请选择" allowClear="true">
                  	<Select.Option value="-1">不限</Select.Option>
                  	{builderCategory.map(category => <Select.Option key={category.builderTypeId}>{category.builderTypeName}</Select.Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:6}}>
              <FormItem label="川内川外">
                {getFieldDecorator('isLocal')(
                  <Select  placeholder="请选择" onChange={this.handleIsLocalChange} allowClear="true">
                  	<Select.Option value="-1">不限</Select.Option>
                    <Select.Option value="1">川内</Select.Option>
                    <Select.Option value="0">川外</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={{span:12}} lg={{span:12}} xl={{span:8}} xxl={{span:6}}>
              <FormItem label="注册地区">
              {getFieldDecorator('location')(
                <Select  placeholder="请选择" onChange={this.handleLocationChange} allowClear="true">
                  <Select.Option value="-1">不限</Select.Option>
                  {locationOptions}
                </Select>
              )}
              </FormItem>
            </Col>
            <Col md={{span:24}} lg={{span:24}} xl={{span:8}} xxl={{span:24}}>
              <div className='ddgo_enterpriseQuery_buttons'>
                <Button htmlType="submit" type="primary">查询</Button>
                <Button htmlType="submit" type="danger"  style={{backgroundColor:'#e98d19', bordercolor:'#e98d19',color:'#fff',boxShadow:'#e98d19' }} onClick={this.handleFormReset}>重置</Button>
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
    console.info('render qiye search!!!!');
    const { userLevel }= this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '企业名称',
        dataIndex: 'builderName',
        align: 'center',
        render: (text, row, index) => {
          return userLevel<=0 ? (<a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>
                {row.builderName.replace(row.builderName.substring(2, 8), '******')}</a>) :
              (<a target="_blank" href={genelink('/show/ente/' + row.builderId, false)}>{row.builderName}</a>)
        }
      },
      {
        title: '法定代表人',
        dataIndex: 'legalPerson',
        render: (text, row) => {
          return userLevel<=0 ? (<span>{row.legalPerson.replace(row.legalPerson.substring(0, 1), '*')}</span>) : (<span>{row.legalPerson}</span>)
        }
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'builderIDCard',
        render: (text, row) => {
          return userLevel<=0 ? (<span>{row.builderIDCard.replace(row.builderIDCard.substring(5, 11), '******')}</span>) : (<span>{row.builderIDCard}</span>)
        }
      },
      {
        title: '属地',
        dataIndex: 'location',
      },
      {
        title: '操作',
        dataIndex: 'builderId',
        render: val => {
          return userLevel<=0 ? (<a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>查看</a>):
              (<a target="_blank" href={genelink('/show/ente/' + val, false)}>查看</a>)
        }
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.pagination.total,
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      //showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      showTotal: () => `总共 ${this.state.pagination.total} 记录`
    };

    return (
      <Card bordered={false}>
        <div className={styles.tableListForm} style={{marginBottom:'20px'}}>
          {this.renderSimpleForm()}
        </div>
        <div className="ddgo_simpleSearch_table">
          <Table
            dataSource={this.state.list}
            rowKey={record => record.key}
            // pagination={{ total: this.state.pagination.total, current:this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 记录` }}
            pagination={paginationProps}
            loading={this.state.loading}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>

      </Card>
    );
  }
}
BuilderSimpleSearch = Form.create({})(BuilderSimpleSearch)
export default BuilderSimpleSearch;
