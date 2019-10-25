import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Modal, message, Icon, Popconfirm } from 'antd';
import './roleMantable.css';
import RoleEditForm from '../roleEditForm/index';
import request from '../../../utils/request';
const { confirm } = Modal;

class RoleMantable extends PureComponent {
    state = {
        selectedRowKeys: [],
        modalVisible: false,
        editItem: {},
        roleList: [],
        roleId: 0,
        rows: {},
        columns: [
            {
                title: '角色名称',
                dataIndex: 'roleName',
            },
            {
                title: '角色描述',
                dataIndex: 'description',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <div style={{}}>
                            <a title="编辑"><Icon type="edit" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.handleEdit(record)} /></a>
                            <span>&emsp;</span>
                            <a title="删除"><Icon type="delete" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.showDeleteConfirm(record)} /></a>
                        </div>
                    </Fragment>
                ),
            },
        ],
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
            roleId: record.roleId,
            roleEditVisible: true,
            rows: record
        })
    }

    //编辑
    handleEditClick = (record) => {
        console.log(record)
        let values = {
            roleId: record.roleId,
            description: record.description
        };
        request(`/api/role/update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }, res => {
            if (res === true) {
                message.success('编辑成功！', 1);
                this.setState({roleEditVisible: false})
            } else {
                message.error("编辑失败！", 1);
            }
        })
    }

    //删除
    handleDelClick = (record) => {
        let roleId = record.roleId;
        request(`/api/role/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, res => {
            if (res === true) {
                message.success('删除成功！', 1);
                // this.handleDelClick(record)
            } else {
                message.error("删除失败！", 1);
            }
        })
    }

    render() {
        const { modalVisible, editItem, roleEditVisible, columns, rows } = this.state;
        const { data, loading } = this.props;
        console.log(this.props)
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
                        title="修改角色描述"
                        visible={roleEditVisible}
                        closable={false}
                        footer={null}
                        destroyOnClose
                    >
                        {/* {
                            this.state.roleId &&  */}
                        <RoleEditForm
                            item={rows}
                            submitMethod={this.handleEditClick}
                            cancelMethod={() => this.setState({
                                roleEditVisible: false,
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

export default RoleMantable;
