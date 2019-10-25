import React, {PureComponent} from 'react';
import {Button, Card, Col, Divider, Form, Icon, Input, InputNumber, message, Row, Select, Table} from "antd";
import { stringify } from 'qs';
import request from "../../../utils/request";
import './index.css';
import styles from "./index.less";
import genelink from "../../../utils/linkutil";

const FormItem = Form.Item;
const { Option } = Select;
class BusinessInfo extends PureComponent {

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
     * params: userName、phoneNo、userLevel、invitePeople
     * */
    fetchSearchList = (params) => {
        let REQUEST_URL = `/api/user/searchInviteList?${stringify(params)}`;
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
        this.setState({formValues: {}, reset: true,});
        this.fetchSearchList();
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let { userName, phoneNo, userLevel, invitePeople } = fieldsValue;
            if ((userName === undefined) && (!this.state.reset)
                && (phoneNo === undefined || phoneNo === '')
                && (userLevel === undefined || userLevel === '')
                && (invitePeople === undefined || invitePeople === '')){
                message.info('请输入查询条件');
                return;
            }

            if(userName && invitePeople) {
                message.info('用户和推荐人无法同时查询哦');
                return;
            }

            const values = {
                ...fieldsValue,
            };

            for(let a in values) {
                if(values[a]=='') delete values[a]
            }

            console.log('form values', values);
            this.setState({
                formValues: values,
            });
            this.fetchSearchList(values);
        });

    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
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
                            <FormItem label="用户名称：">
                                {getFieldDecorator('userName')(
                                    <Input placeholder="请输入用户名称" allowClear="true" style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="手机号码：">
                                {getFieldDecorator('phoneNo')(
                                    <Input placeholder="请输入手机号码" allowClear={true} style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="用户类型：">
                                {getFieldDecorator('userLevel')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                        {userTypeOptions}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="推荐人：">
                                {getFieldDecorator('invitePeople')(
                                    <Input placeholder="请输入推荐人" allowClear="true" style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <Button type="primary" htmlType="submit" style={{width: 100}} onClick={this.handleSubmit}>查询</Button>
                            <Button style={{ marginLeft: 8 , width: 100}} onClick={this.handleFormReset}>重置</Button>
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

    fetchExport = (params) => {
        // /user/exportExcel
        let REQUEST_URL = `/api/user/exportExcel?${stringify(params)}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                "Content-Disposition": "attachment",
                "Content-Type": "application/octet-stream",
            }
        })
    };


    exportExcel = () => {
        const {formValues} = this.state;
        console.log(formValues);
        this.fetchExport(formValues);
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
                title: '用户姓名',
                dataIndex: 'userName',
            },
            {
                title: '手机号码',
                dataIndex: 'phoneNo',
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
                title: '注册时间',
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
                title: '推荐人',
                dataIndex: 'invitePeople',
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
                    <Button type='primary' onClick={this.exportExcel}>
                        <a href={genelink(`http://192.168.0.113:8080/user/exportExcel?${stringify(formValues)}`, true)} target="_blank">导出表格</a>
                    </Button>

                </Card>
            </div>
        )
    }

}

BusinessInfo = Form.create({})(BusinessInfo);
export default BusinessInfo;
