import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Modal, message, Icon, Popconfirm } from 'antd';
import './menuMantable.css';
import CosUserCreateForm from '../cosusercreateform/index';
import MenuEditForm from '../menuEditForm/index.js';
import request from '../../../utils/request';
const { confirm } = Modal;

class MenuMantable extends PureComponent {
    state = {
        selectedRowKeys: [],
        menuEditVisible: false,
        editItem: {},
        menuList: [],
        menuId: 0,
        rows: {},
        columns: [
            {
                title: '菜单名称',
                dataIndex: 'menuName',
            },
            {
                title: '菜单描述',
                dataIndex: 'description',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <div style={{}}>
                            <a title="编辑">
                                <Icon type="edit" style={{ fontSize: 18, color: '#08c' }}
                                    onClick={() => this.handleEdit(record)} />
                            </a>
                            <span>&emsp;</span>
                            <a title="删除"><Icon type="delete" style={{ fontSize: 18, color: '#08c' }}
                                onClick={() => this.showDeleteConfirm(record)} /></a>
                        </div>
                    </Fragment>
                ),
            },
        ]
    };



    componentWillReceiveProps(nextProps) {
        // clean state
        if (nextProps.selectedRows.length === 0) {
            this.setState({
                selectedRowKeys: [],
            });
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }

    showDeleteConfirm = (record) => {
        const _this = this
        confirm({
            title: '确认要删除吗？',
            content: '删除后将不可恢复',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            width: 300,
            onOk() {
                _this.handleDelClick(record)
            },
        });
    }

    handleEdit = (record) => {
        this.setState({
            menuId: record.menuId,
            menuEditVisible: true,
            rows: record
        })
    }
    //删除
    handleDelClick = (record) => {
        let menuId = record.menuId;
        request(`/api/menu/${menuId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, res => {
            if (res === true) {
                message.success('删除成功！', 1);
            } else {
                message.error("删除失败！", 1);
            }
        })
    }

    //编辑
    handleEditClick = (record) => {
        let values = {
            menuId: record.menuId,
            description: record.description
        };
        request(`/api/menu/update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }, res => {
            if (res=== true) {
                message.success('编辑成功！', 1);
            } else {
                message.error("编辑失败！", 1);
            }
        })
    }

    render() {
        const { modalVisible, editItem, menuEditVisible, columns, rows } = this.state;
        const { data, loading } = this.props;
        // const paginationProps = {
        //     showSizeChanger: true,
        //     showQuickJumper: true,
        //     // showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
        //     ...pagination,
        // };

        return (
            <div>
                <Table
                    // loading={loading}
                    rowKey={record => record.key}
                    dataSource={data}
                    columns={columns}
                    // pagination={paginationProps}
                    onChange={this.handleTableChange}
                />
                <div>
                    <Modal
                        title="修改菜单"
                        visible={menuEditVisible}
                        closable={false}
                        footer={null}
                        destroyOnClose
                    >
                        {/* {
                            this.state.menuId && */}
                        <MenuEditForm
                            item={rows}
                            submitMethod={this.handleEditClick}
                            cancelMethod={() => this.setState({
                                menuEditVisible: false,
                                menuId: 0
                            })}
                        />
                        {/* } */}
                    </Modal>
                </div>
            </div>
        );
    }
}

export default MenuMantable;
