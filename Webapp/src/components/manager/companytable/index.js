import React, {PureComponent} from 'react';
import {Table, message, Input, Form} from "antd";

import styles from './index.less';

const FormItem = Form.Item;
export default class CompanyTable extends PureComponent {
    state = {
        selectedRowKeys: [],
        sortObj: {},
        dataSource: [],
    };

    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selected keys', selectedRowKeys);

        // if(selectedRowKeys.length > 2) {
        //     message.info('只能勾选2项交换');
        //     return;
        // }
        if(this.props.onSelectRow) {
            this.props.onSelectRow(selectedRowKeys, selectedRows);
        }

        this.setState({ selectedRowKeys });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        // this.setState({selectedRowKeys: []});
    };

    clearSelectedKeys(keys) {
        // console.log('clearSelectedKeys in son');
        this.setState({selectedRowKeys: keys});
    }

    changeSortVal(event, index) {
        // console.log(event.target.value);
        const modifyId = this.state.modifyId;
        const {sortObj} = this.state;
        sortObj[modifyId] = parseInt(event.target.value);
        // console.log('1J change!', sortObj);
        // console.log('1J change index!', index);
    }

    saveSortVal(id) {
        // console.log('save', id);
        // console.log('save input', inputValue);
        const {sortObj} = this.state;
        const orderId = sortObj[id];
        if(orderId === parseInt(this.state.updateId)) {
            message.info('未修改排序值');
            return;
        }
        this.props.sort(id, orderId);


        // console.log('last changed!', orderId);
    }

    resetSortVal(row) {
        const sort = `sort${row.builderId}`;
        this.props.form.setFieldsValue({
            [sort] : row.builderId,
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log(nextProps);
        const {data: {list}} = nextProps;
        let obj = {};
        if(list !== undefined) {

            list.forEach((item) => {
                obj[item.builderId] = item.order;
            });
        }
        this.setState({sortObj: obj, dataSource: list});
    }

    moveRow(record) {
        // console.log('click row', record);
        this.setState({
            modifyId: record.builderId,
            updateId: record.order,
        });
    }

    onChangeInput(row) {
        const key = `sort${row.builderId}`;
        const value = this.props.form.getFieldValue(key);
        console.log('form in table:', value);
    }

    render() {
        const { selectedRowKeys, dataSource } = this.state;
        const { data: { list, pagination }, loading } = this.props;
        // const { getFieldDecorator } = this.props.form;
        // console.log('reload', reload);
        // console.log('dataSource', dataSource);
        const columns = [
            {
                title: '公司名称',
                dataIndex: 'builderName',
            },
            {
                title: '属地',
                dataIndex: 'location',
            },
            // {
            //     title: '排序',
            //     render: (text, row, index) => {
            //         return (
            //             <Form>
            //                 <FormItem>
            //                     {getFieldDecorator('sort'+row.builderId, {
            //                         rules: [{
            //                             required: true
            //                         }],
            //                         initialValue: row.builderId,
            //                     })(
            //                         <Input onChange={this.onChangeInput.bind(this, row)}/>
            //                     )}
            //                 </FormItem>
            //             </Form>
            //         )
            //     }
            // },
            {
                title: '排序值',
                dataIndex: 'order',
                render: (text, row, index) => (
                    <Input style={{width: '50%'}} defaultValue={text} onChange={ event => {this.changeSortVal(event, index)}}/>
                )
            },
            {
                title: '操作',
                render: (text, row, index) => (
                    <div>
                        <a onClick={this.saveSortVal.bind(this, row.builderId)}>保存</a>
                        {/*<a style={{marginLeft: '10px'}} onClick={this.resetSortVal.bind(this, row)}>取消</a>*/}
                    </div>
                )
            }
        ];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
            ...pagination,
        };

        return (
            <div className={styles.standardTable}>
                <Table
                    loading={loading}
                    columns={columns}
                    onRow={(record) => {
                        return {
                            // onClick: () => {this.clickRow(record)},
                            onMouseEnter: () => {
                                this.moveRow(record)
                            }
                        }}}
                    rowKey={record => record.builderId}
                    rowSelection={rowSelection}
                    dataSource={list}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                   />
            </div>
        );

    }
}
// CompanyTable = Form.create({})(CompanyTable);
// export default CompanyTable;