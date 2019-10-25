import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Modal, message, Icon, Popconfirm } from 'antd';
import './roleMenuMantable.css';
import RoleMenuEditForm from '../roleMenuEditForm/index.js';
import request from '../../../utils/request';
const { confirm } = Modal;

class RoleMenuMantable extends PureComponent {
    state = {
        selectedRowKeys: [],
        roleMenuEditVisible: false,
        editItem: {},
        roleMenuList: [],
        rows: {},
        columns: [
            {
                title: '角色ID',
                dataIndex: 'roleId',
            },
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
            roleId: record.roleId,
            roleMenuEditVisible: true,
            rows: record
        })
    }
    //删除
    handleDelClick = (record) => {
        //通过角色ID删除
        let roleId = record.roleId;
        request(`/api/roleMenuList/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, res => {
            if (res === true) {
                message.success('删除成功！', 1);
                window.location.reload();
            } else {
                message.error("删除失败！", 1);
            }
        })
    }

    //编辑
    handleEditClick = (record) => {
        //通过角色ID，菜单名称、描述
        let values = {
            roleId: record.roleId,
            menuName: record.menuName,
            description: record.description
        };
        console.log(values)
        request(`/api/roleMenuList/update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }, res => {
            if (res=== true) {
                message.success('编辑成功！', 1);
                this.setState({ roleMenuEditVisible: false });
                window.location.reload();
            } else {
                message.error("编辑失败！", 1);
            }
        })
    }

    render() {
        const { modalVisible, editItem, roleMenuEditVisible, columns, rows, roleList, menuList, roleMenuList } = this.state;
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
                    rowKey={record => record.key}
                    dataSource={data}
                    columns={columns}
                    onChange={this.handleTableChange}
                />
                <div>
                    <Modal
                        title="修改角色菜单"
                        visible={roleMenuEditVisible}
                        closable={false}
                        footer={null}
                        destroyOnClose
                    >
                        {/* {
                            this.state.roleId && */}
                        <RoleMenuEditForm
                            item={rows}
                            data={data}
                            submitMethod={this.handleEditClick}
                            cancelMethod={() => this.setState({
                                roleMenuEditVisible: false,
                                roleId: 0
                            })}
                        />
                        {/* } */}
                    </Modal>
                </div>
            </div>
        );
    }
}

export default RoleMenuMantable;
