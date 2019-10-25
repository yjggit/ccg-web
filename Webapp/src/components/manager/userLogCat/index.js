import React, {PureComponent} from 'react';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Icon,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Table
} from "antd";
import { stringify } from 'qs';
import request from "../../../utils/request";
import './index.css';
import styles from "./index.less";
import genelink from "../../../utils/linkutil";

const FormItem = Form.Item;
const { Option } = Select;
class UserLogCat extends PureComponent {

    state = {
        reset: false,
        loading: false,
        list: [],
        pagination: {},
        formValues: {},
    };

    componentDidMount() {
        // this.fetchPerformCategory();
        this.fetchSearchList();
    }

    /**
     * params: phoneNo,companyName,createDate,userLevel,vipEndDate,,sourceChannel,loginDate,ip
     * */
    fetchSearchList = (params) => {
        let REQUEST_URL = `/api/sys/searchSysLogList?${stringify(params)}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.c1)
    };

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
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
            reset: true,
            loginDate: '',
            createDate: '',
            vipEndDate: '',
        });
        this.fetchSearchList();
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const {createDate, vipEndDate, loginDate} = this.state;
        //phoneNo, companyName,createDate,userLevel,vipEndDate,,sourceChannel,loginDate,ip
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let { companyName, phoneNo, userLevel, sourceChannel, ip } = fieldsValue;
            if ((companyName === undefined) && (!this.state.reset)
                && (phoneNo === undefined || phoneNo === '')
                && (userLevel === undefined || userLevel === '')
                && (createDate === '')
                && (vipEndDate === '')
                && (loginDate === '')
                && (sourceChannel === undefined || sourceChannel === '')
                && (ip === undefined || ip === '')
            ){
                message.info('请输入查询条件');
                return;
            }

            const values = {
                ...fieldsValue,
                loginDate,
                createDate,
                vipEndDate
            };

            console.log('form values', values);
            this.setState({
                formValues: values,
            });
            this.fetchSearchList(values);
        });

    };

    changeLoginDate = (date, format) => {
        this.setState({ loginDate: format })
    };

    changeCreateDate = (date, format) => {
        this.setState({ createDate: format })
    };

    changeVipEndDate = (date, format) => {
        this.setState({ vipEndDate: format })
    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY-MM-DD';
        const types = ['普通会员', 'vip会员(一年)', 'vip会员(两年)', 'vip会员(三年)', '钻石会员(一年)', '钻石会员(两年)', '钻石会员(三年)'];
        const userTypeOptions = types.map((lo, index) =>
            <Select.Option key={index} value={index+1}>
                {lo}
            </Select.Option>);
        return (
            <div >
                <Row>
                    <Form onSubmit={this.handleSubmit} layout="inline">
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="注册手机号：">
                                {getFieldDecorator('phoneNo')(
                                    <Input placeholder="请输入注册手机号" allowClear="true" style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="公司名称：">
                                {getFieldDecorator('companyName')(
                                    <Input placeholder="请输入公司名称" allowClear={true} style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="注册日期：">
                                <div className='datepicker'>
                                    {getFieldDecorator('createDate')(
                                        <DatePicker disabledDate={this.disableProjectdDate} onChange={this.changeCreateDate} format={dateFormat} />
                                    )}
                                </div>
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="会员等级：">
                                {getFieldDecorator('userLevel')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                        {userTypeOptions}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="会员有效期：">
                                <div className='datepicker'>
                                    {getFieldDecorator('vipEndDate')(
                                        <DatePicker disabledDate={this.disableProjectdDate} onChange={this.changeVipEndDate} format={dateFormat} />
                                    )}
                                </div>
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="用户来源渠道：">
                                {getFieldDecorator('sourceChannel')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}} disabled>
                                        <Option value="今日头条">今日头条</Option>
                                        <Option value="百度">百度</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="登录日期：">
                                <div className='datepicker'>
                                    {getFieldDecorator('loginDate')(
                                        <DatePicker disabledDate={this.disableProjectdDate} onChange={this.changeLoginDate} format={dateFormat} />
                                    )}
                                </div>
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="用户IP地址：">
                                {getFieldDecorator('ip')(
                                    <Input placeholder="请输入用户IP" allowClear="true" style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}} style={{display: 'none'}}>
                            <FormItem label="操作结果：">
                                {getFieldDecorator('result')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                        <Option value="成功">成功</Option>
                                        <Option value="失败">失败</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col md={{span:24}} lg={{span:24}} xl={{span:8}} xxl={{span:24}}>
                            <div className='userLog_buttons'>
                                <Button type="primary" htmlType="submit" style={{width: 100}} onClick={this.handleSubmit}>查询</Button>
                                <Button style={{ marginLeft: 8 , width: 100}} onClick={this.handleFormReset}>重置</Button>
                            </div>
                        </Col>
                    </Form>
                </Row>

            </div>

        );
    }

    handleTableChange = (pagination, filtersArg, sorter) => {
        const { formValues } = this.state;
        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }
        this.fetchSearchList(params);
    };

    render() {
        const { loading, list, formValues } = this.state;

        // const list = [];
        // for(let i=0; i<19; i++) {
        //     list.push({
        //         id: i,
        //         username: '杰森',
        //         phoneNo: '188 8888 8888',
        //         userLevel: '付费',
        //         createTime: '2019/02/01',
        //         expiredDate: '2020/02/01',
        //         invitePeople: '智网多彩'
        //     })
        // }

        const columns = [
            {
                title: '访问者IP',
                dataIndex: 'ip',
            },
            {
                title: '注册手机号码',
                dataIndex: 'phoneNo',
            },
            {
                title: '公司名称',
                dataIndex: 'enterpriseName',
            },
            {
                title: '来源渠道',
                dataIndex: 'sourceChannel,',
                render: val => {
                    return '暂无'
                }
            },
            {
                title: '用户类型',
                dataIndex: 'userLevel',
                render: (val) => {
                    switch (val) {
                        case '1':
                            return '普通会员';
                        case '2':
                            return 'vip会员(一年)';
                        case '3':
                            return 'vip会员(二年)';
                        case '4':
                            return 'vip会员(三年)';
                        case '5':
                            return '钻石会员(一年)';
                        case '6':
                            return '钻石会员(二年)';
                        case '7':
                            return '钻石会员(三年)';
                    }
                }
            },
            {
                title: '注册日期',
                dataIndex: 'createDate',
                render: (val) => {
                    return new Date(parseInt(val)).format('yyyy/MM/dd')
                }
            },
            {
                title: '会员有效期',
                dataIndex: 'vipEndDate',
                render: (val) => {
                    return new Date(parseInt(val)).format('yyyy/MM/dd')
                }
            },
            {
                title: '登录/登出',
                dataIndex: 'loginDate',
            },
            {
                title: '日志内容',
                dataIndex: 'params',
            },
        ];

        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.handleRowSelectChanges,
        //     getCheckboxProps: record => ({
        //         disabled: record.disabled,
        //     }),
        // };

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.pagination.total,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            showTotal: () => `总共 ${this.state.pagination.total} 条记录`
        };

        return (
            <div className='cookieSearch'>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>

                        <Table
                            dataSource={list}
                            rowKey={record => record.no}
                            // rowSelection={rowSelection}
                            pagination={paginationProps}
                            loading={loading}
                            columns={columns}
                            onChange={this.handleTableChange}
                        />
                    </div>

                    <Button type='primary'>
                        <a href={genelink(`http://192.168.0.113:8080/sys/exportExcel?${stringify(formValues)}`, true)} target="_blank">导出表格</a>
                    </Button>
                </Card>
            </div>
        )
    }

}

UserLogCat = Form.create({})(UserLogCat);
export default UserLogCat;
