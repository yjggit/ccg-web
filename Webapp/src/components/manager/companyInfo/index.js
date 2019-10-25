import React, {PureComponent} from 'react';
import {Button, Card, Col, Form, Input, Row, message, Tag, Table} from "antd";
import { stringify } from 'qs';
import styles from './index.less';
import CompanyTable from "../companytable";
import request from "../../../utils/request";

const getValue = (obj) => Object.keys(obj).map(key => obj[key]).join(',');
const FormItem = Form.Item;

class CompanyInfo extends PureComponent {
    state = {
        loading: false,
        data: [],
        selectedRows: [],
        formValues: {},
        params: {},
        row: [],
    };

    componentDidMount() {
        this.fetchTableList();
    }

    fetchTableList = (params = {}) => {
        if(params == undefined) {
            params = {};
        }
        let REQUEST_URL = `/api/builder/admin/filter/simple?${stringify(params)}`;
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
        // console.log('originData', data);
        this.setState({data, loading:false});
        const { pageSize, current } = data.pagination;
        const startNo = (current - 1) * pageSize;
        if ( data.list != null) {
            data.list.map(function (value, key) {
                let nm = {no: startNo + key + 1};
                return Object.assign(value, nm);
            });
        }
        // console.log('newData', data);
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.clearCheckedStatus();
        this.setState({formValues: {}, row: []});
        this.fetchTableList();
    };

    handleSelectRows = (keys, rows) => {
        // console.log('table keys', keys);
        const {row} = this.state;

        if(keys.length === 0) {
            row.length = 0;
        }else if(keys.length === 1) {
            if(rows.length === 1) {
                row.length = 0;
            }else{
                row.forEach( (item,index) => {
                    if(item.builderId !== keys[0]) {
                        row.splice(index, 1)
                    }
                });
                // console.info('asd', row)
            }
        }
        rows.forEach(item => {
            if(row[0] !== item) {
                row.push(item);
            }
        });

        // console.log('tag:', row);
        this.setState({
            selectedRows: rows,
        });
    };

    handleStandardTableChange =  (pagination, filtersArg, sorter) => {
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
        this.setState({params});
        this.fetchTableList(params);
    };

    handleSort(sourceId, orderId) {
        // console.log(sourceId, orderId)
        let params = {
            sourceId: sourceId,   //int (require)
            order: orderId    //int (require)
        };
        let REQUEST_URL = `/api/admin/changeOrder?${stringify(params)}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(params)
        }, this.c2);
    }

    handleExchange() {
        const { row } = this.state;
        // console.info('selectedRows: ', selectedRows);
        if(row.length < 2) {
            message.info('请先勾选2项进行交换');
            return;
        }else if (row.length > 2) {
            message.info('只能勾选2项进行交换');
            return;
        }
        // console.info('selectedRows: 2', selectedRows);
        let params = {
            sourceId: row[0].builderId,   //int (require) //需要交换的公司ID-1
            targetId: row[1].builderId    //int (require) //需要交换的公司ID-2
            // order:
        };
        let REQUEST_URL = `/api/admin/changeOrder?${stringify(params)}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(params)
        }, this.c2);
    }

    c2 = (data)=> {
        if(data.status === 'ok'){
            this.fetchTableList();
            message.success('交换成功', 1);
        }else{
            message.error(`${data.message}`,1);
        }
    };

    handleClose(removedTag) {
        // console.log(removedTag);
        const row = this.state.row.filter(tag => tag.builderId !== removedTag);
        // console.log(row);
        this.setState({ row });
        let keys = [];
        if(row.length === 1) {
            keys.push(parseInt(row[0].builderId));
        }
        // console.log(keys);
        this.refs.table.clearSelectedKeys(keys);
    }

    appendTags() {
        const { row } = this.state;
        if(row.length === 2){
            return (
                <div>
                    <Tag closable onClose={(e) => {
                        e.preventDefault();
                        this.handleClose(row[0].builderId);
                    }}>{row[0].builderName}</Tag>
                    <Tag closable onClose={(e) => {
                        e.preventDefault();
                        this.handleClose(row[1].builderId);
                    }}>{row[1].builderName}</Tag>
                </div>
            )
        }else if(row.length === 1){
            return (
                <div>
                    <Tag closable onClose={(e) => {
                        e.preventDefault();
                        this.handleClose(row[0].builderId);
                    }}>{row[0].builderName}</Tag>
                </div>
            )
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            console.log('form values', values);
            this.setState({
                formValues: values,
            });
            this.fetchTableList(values);
        })
    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div id="conditionSearch">
                <Row>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:6}} xxl={{span:6}}>
                            <FormItem label="公司名称">
                                {getFieldDecorator('builderName')(
                                    <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:6}} xxl={{span:6}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                            {/*<Button style={{ marginLeft: 8}} onClick={this.handleExchange.bind(this)}>交换</Button>*/}
                        </Col>
                        {/*{this.appendTags()}*/}
                    </Form>
                </Row>
            </div>
        );
    }

    clearCheckedStatus() {
        this.refs.table.clearSelectedKeys([]);
    }

    render() {
        const { loading, data, selectedRows } = this.state;

        return (
            <div className='globalSearch'>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>
                    </div>
                </Card>
                <CompanyTable
                    ref="table"
                    loading={loading}
                    data={data}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                    sort={this.handleSort.bind(this)}
                />
            </div>
        );
    }

}
CompanyInfo = Form.create({})(CompanyInfo);
export default CompanyInfo;