import React, { PureComponent } from 'react';
import {
    DatePicker,
    InputNumber,
    Select,
    message,
    Row,
    Col,
    Table,
    Card,
    Form,
    Input,
    Button,
    Modal,
    Tooltip
} from 'antd';
import '../../../css/antd.css';
import './BuilderPerformSearch.css'
import Utils from '../../../utils/appUtils';
import styles from '../../../css/StandardTableList.less';
import { stringify } from 'qs';
import request from '../../../utils/request'
import genelink from '../../../utils/linkutil';
import emitter from "../../../event";

const FormItem = Form.Item;
class BuilderPerformSearch extends PureComponent {

  state = {
    list: [],
    pagination: {},
    performCategory: [],
    loading: false,
    visible: false,
    reset: false,
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
    this.fetchSearchList({projectStatus: '0,1,2'});//初始化传入业绩状态为中标业绩 '0'
    this.fetchPerformCategory();
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      reset: true,
    });
    this.fetchSearchList({projectStatus: '0,1,2'});
  }

  fetchPerformCategory = () => {
    let REQUEST_URL = `/api/perform/category`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, data => {
      this.setState({
        performCategory: data,
      });
    })
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

  handleSearch = (e) => {
    e.preventDefault();
    if (this.state.userLevel !== 2) {
      this.setState({
        visible: true
      })
      return;
    }
    const { form } = this.props;
    message.config({
      top: 380,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let { projectType, projectNo, builderName, projectName, startPrice, endPrice, projectStart, projectEnd, projectLeader, projectStatus, leaderType } = fieldsValue;
      if ((projectType === undefined)
          // && (!this.state.reset)
        && (projectNo === undefined || projectNo === '')
        && (projectName === undefined || projectName === '')
        && (builderName === undefined || builderName === '')
        && (startPrice === undefined || startPrice === '')
        && (endPrice === undefined || endPrice === '')
        && (projectStart === undefined || projectStart === '')
        && (projectEnd === undefined || projectEnd === '')
        && (projectLeader === undefined || projectLeader === '')
        && (projectStatus.length === 0)) {
        message.info('请输入查询条件');
        return;
      }
      fieldsValue.startPrice = (startPrice || 0) * 10000;
      fieldsValue.endPrice = (endPrice || 0) * 10000;
      const values = {
        ...fieldsValue,
        projectStatus: projectStatus.length>0 ? projectStatus.toString() : '0,1,2',
        projectStart: fieldsValue['projectStart'] ? fieldsValue['projectStart'].format('YYYY-MM') : '',
        projectEnd: fieldsValue['projectEnd'] ? fieldsValue['projectEnd'].format('YYYY-MM') : '',
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      delete values.leaderType;
      // if(projectStatus.length===0) delete values.projectStatus;

      this.setState({
        formValues: values,
      });

      console.log('handle Search params: ', values);

      this.fetchSearchList(values);
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    if(this.state.userLevel<=0) {
      this.popUpLoginModal(this.state.userLevel);
      return;
    }
    console.log('perform userLL', this.state.userLevel)
    if (this.state.userLevel !== 2) {
      this.setState({
        visible: true
      })
      return;
    }
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      projectStatus: '0,1,2',
      ...formValues,
    };
    if(formValues == ""){
      params.projectStatus =  '0,1,2'
    }

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchSearchList(params);
  }

  handleStartDateOnChange = (value, dateString) => {
    value = dateString;
    // this.setState({startTime:dateString});
  }
  handleEndDateOnChange = (value, dateString) => {
    value = dateString;
  }

  fetchSearchList = (params) => {
    let REQUEST_URL = `/api/perform/filter?${stringify(params)}`;
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
  growUpTip = (e) => {
    e.preventDefault();
    window.open("/user");
  }
  handleOk = (e) => {
    e.preventDefault();
    this.setState({ visible: false })
    window.open("/user");
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({ visible: false })
  }

  disabledDate = (date) => {
    // 1356969600000 2013/1/1 上午12:00:00
    return date && (date.valueOf() < 1356969600000 || date.valueOf() > new Date().getTime());
  }

  changeLeaderType = (value) => {
    console.log('leader type', value);
    this.setState({leaderType: value})
  }

  changeProjectLeader = (e) => {
    let value = e.target.value;
    this.setState({ projectLeader: value });
  }

  changeProjectSituation = (value) => {
    console.log('projectStatus:', value);// [0, 1, 2]

  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { performCategory, leaderType } = this.state;
    const performCategoryOptions = performCategory.map(lo => <Select.Option key={lo.projectTypeId}>{lo.projectTypeName}</Select.Option>);
    return (
      <div className="ddgo_performance_search">
        <Form onSubmit={this.handleSearch}>
          {/* <div className="ddgo_performance_blackModal" >
            <button className="ddgo_performance_blackModal_but" onClick={this.growUpTip}>升级为钻石会员</button>
          </div> */}
          <Row style={{"display": "flex", "flex-wrap" : "wrap", "flex-direction": "row"}}>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="项目名称">
                {getFieldDecorator('projectName')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="项目类别">
                {getFieldDecorator('projectType')(
                  <Select placeholder="请选择" allowClear="true">
                    <Select.Option value="">不限</Select.Option>
                    {performCategoryOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="金额(万元)">
                <div className='ddgo_achievement_AmountRange'>
                  {getFieldDecorator('startPrice')(
                    <InputNumber min={1} step={1} placeholder="请输入" />
                  )}
                  <span style={{ lineHeight: "32px"}}>&nbsp;-&nbsp;</span>
                  {getFieldDecorator('endPrice')(
                    <InputNumber min={1} step={1} placeholder="请输入" />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="承建单位">
                {getFieldDecorator('builderName')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="项目时间">
                <div className='ddgo_Project_Time' style={{"display": "flex"}}>
                  {getFieldDecorator('projectStart')(
                    <DatePicker.MonthPicker
                      disabledDate={this.disabledDate}
                      placeholder="开始" />
                  )}
                  <span style={{lineHeight:"32px",float:"left"}}>&nbsp;-&nbsp;</span>
                    {getFieldDecorator('projectEnd')(
                        <DatePicker.MonthPicker
                          style={{"width": "100%"}}
                          placeholder="截止" />
                    )}
                </div>

              </FormItem>
            </Col>
            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem >
                <div className='ddgo_achievement_principal'>
                  {getFieldDecorator('leaderType', {initialValue: '0'})(
                      <Select onChange={this.changeLeaderType}>
                        <Select.Option value="0">项目负责人</Select.Option>
                        <Select.Option value="1" disabled >技术负责人</Select.Option>
                      </Select>
                  )}
                  <span style={{ lineHeight: "32px", }}>&nbsp;:&nbsp;</span>
                  {getFieldDecorator('projectLeader')(
                      <Input placeholder="请输入" onChange={this.changeProjectLeader} />
                  )}
                </div>
              </FormItem>
            </Col>
            {/*<Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 4 }} xxl={{ span: 3 }}>*/}
            {/*  <FormItem >*/}
            {/*    {getFieldDecorator('projectLeader')(*/}
            {/*        <Input placeholder="请输入" onChange={this.changeProjectLeader} />*/}
            {/*    )}*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}


            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <FormItem label="业绩状态">
                <div className='ddgo_Project_Time'>
                  {getFieldDecorator('projectStatus', {initialValue: []})(
                      <Select placeholder="请选择" mode="multiple" onChange={this.changeProjectSituation}>
                        <Select.Option key={0} value={0}>中标业绩</Select.Option>
                        <Select.Option key={1} value={1}>在建业绩</Select.Option>
                        <Select.Option key={2} value={2}>完工业绩</Select.Option>
                      </Select>
                  )}
                </div>
              </FormItem>
            </Col>

            <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
              <div className="ddgo_performance_searchButtons">
                <Button htmlType="submit" type="primary">查询</Button>
                <Button type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }} onClick={this.handleFormReset}>重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

    jump2SourceOrDDgo = (item) => {
        // console.log(item);
        const {userLevel} = this.state;
        let toSource = item.domain_id == 16 || item.domain_id == 15 || item.domain_id == 14 || item.domain_id == 4 || item.domain_id == 6;
        if(toSource) {
            //item.sourceUrl
            return userLevel<=1 ? (
                item.sourceUrl ? <a style={{fontSize: '16px'}} onClick={this.popUpLoginModal.bind(this, userLevel)}>{item.projectName}</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>) :
                (item.sourceUrl ? <a style={{fontSize: '16px'}} target="_blank" href={item.sourceUrl}>{item.projectName}</a>
                    : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>)
        }else{
            //ddgo
            return userLevel<=1 ? (
                item.url ? <a style={{fontSize: '16px'}} onClick={this.popUpLoginModal.bind(this, userLevel)}>{item.projectName}</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>) :
                (item.url ? <a style={{fontSize: '16px'}} target="_blank" href={`/pub/projectNew/${item.url}`}>{item.projectName}</a>
                    : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>)
        }

    }

    jump2SourceOrDDgo2 = (item) => {
        // console.log(item);
        const {userLevel} = this.state;
        let toSource = item.domain_id == 16 ||item.domain_id == 15 || item.domain_id == 14 || item.domain_id == 4 || item.domain_id == 6;
        if(toSource) {
            //item.sourceUrl
            return userLevel==0 ? (
                item.sourceUrl ? <a style={{fontSize: '16px'}} onClick={() => message.info('请先升级会员！')}>查看</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>) :
                (item.sourceUrl ? <a style={{fontSize: '16px'}} target="_blank" href={item.sourceUrl}>查看</a>
                    : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>)
        }else{
            //ddgo
            return userLevel==0 ? (
                item.url ? <a style={{fontSize: '16px'}} onClick={() => message.info('请先升级会员！')}>查看</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>) :
                (item.url ? <a style={{fontSize: '16px'}} target="_blank" href={`/pub/projectNew/${item.url}`}>查看</a>
                    : <Tooltip placement="top" title={"暂无数据来源"}><a>查看</a></Tooltip>)
        }

    }

  popUpLoginModal = (level) => {
    switch (level) {
      case -1:
        emitter.emit("loginModal", true);
        break;
      case 0:
        this.setState({visible: true});
        break;
      case 1:
        this.setState({visible: true});
        break;
    }
  }

  render() {
    // const type = ['房屋建筑', '市政工程', '其他'];
    let { userLevel } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        render: (text, row, index) => (
          /*<a target="_blank" href={genelink(row.sourceUrl, true)}>{row.projectName}</a>*/
            this.jump2SourceOrDDgo(row)
          // <a target="_blank" href={`/pub/projectNew/${row.url}`}>{row.projectName}</a>
        ),
      },
      {
        title: '承建单位',
        dataIndex: 'builderName',
        align: 'center',
        render: (text, row) => {
          return userLevel<=0 ? (<span>{row.builderName.replace(row.builderName.substring(2, 8), '******')}</span>) : (<span>{row.builderName}</span>)
        }
      },
      // {
      //   title: '项目编码',
      //   dataIndex: 'projectNo',
      //  },
      //  {
      //   title: '项目类别',
      //   dataIndex: 'projectType',
      //   render: val => (
      //     type[val]
      //   ),
      //  },
      {
        title: '项目负责人',
        dataIndex: 'projectLeader',
        align: 'center',
        render: (text, row) => {
          let name = row.projectLeader ? row.projectLeader.replace(row.projectLeader.substring(0, 1), '*') : '';
          return userLevel<=0 ? (<span>{name}</span>) : (<span>{row.projectLeader}</span>)
          // return <span>{row.projectLeader ? row.projectLeader.replace(row.projectLeader.substring(0, 1), '*') : ''}</span>
        }
      },
      // {
      //   title: '技术负责人',
      //   dataIndex: 'teachLeader',
      //   align: 'center',
      // },
      {
        title: '金额(万元)',
        dataIndex: 'bidPrice',
        render: (value, row, index) => {
          return <span>{this.renderNumberFormatW(row.bidPrice)}</span>
        }
      },
      // {
      //   title: '中标/开工/完工日期',
      //   dataIndex: 'bidDate',
      //   render: (value, row, index) => {
      //     return row.bidDate || row.startDate || row.endDate
      //   }
      // },
      // {
      //   title: '操作',
      //   dataIndex: 'projectId',
      //   render: (text, row, index) => (
      //     this.jump2SourceOrDDgo2(row)
      //   ),
      // },
      {
        title: '业绩状态',
        dataIndex: 'projectStatus',
        render: (value, row, index) => {
          switch (row.projectStatus) {
            case 0:
              return "中标业绩";
            case 1:
              return "在建业绩";
            case 2:
              return "完工业绩";
          }
        }
      }
    ];
    let locale = {
      emptyText: userLevel == 0 ? "请升级为会员！" : userLevel == 1 ? "请升级为钻石会员！" : "暂无数据",
    };
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
        <Modal
          title="提示"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          wrapClassName={"ddgo_company_details_smallBox"}
          onOk={this.handleOk}>
          <p>是否升级为钻石会员？</p>
        </Modal>
        <div className={styles.tableListForm} style={{ marginBottom: '20px' }}>
          {this.renderForm()}
        </div>
        <div className="ddgo_performSearch_table">
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
BuilderPerformSearch = Form.create({})(BuilderPerformSearch)
export default BuilderPerformSearch;
