import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message, DatePicker, Table, Icon } from 'antd';
import RoleMenuMantable from '../roleMenuMantable/RoleMenuMantable';
import RoleMenuEditForm from '../roleMenuEditForm/index.js';
import RoleMenuCreateForm from '../roleMenuCreateForm/index.js';
import { stringify } from 'qs';
import "./roleMenuManagement.css"

import styles from './roleMenuManagement.css';
import request from '../../../utils/request';

const FormItem = Form.Item;
const { confirm } = Modal;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class RoleMenuManagement extends PureComponent {
    state = {
        modalAddVisible: false,
        modalEditVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        editItem: {},
        editType: '新增角色菜单',
        data: {},
        loading: false,
        params: {},
        menuList: [],
        roleList: [],
        roleMenuList: [],
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

    componentDidMount() {
        this.fetchMenuList();
        this.fetchRoleList();
        this.fetchRoleMenuList();
    }

    //获取角色列表
    fetchRoleList = () => {
        let REQUEST_URL = `/api/role/search`;
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
        this.setState({ roleList: data, loading: false });
    };

    //获取菜单列表
    fetchMenuList = () => {
        let REQUEST_URL = `/api/menu/search`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.c2)
    };
    c2 = (data) => {
        this.setState({ menuList: data, loading: false });
    };

    //获取角色菜单列表
    fetchRoleMenuList = () => {
        let REQUEST_URL = `/api/roleMenuList/search`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.c3)
    };
    c3 = (data) => {
        this.setState({ roleMenuList: data, loading: false });
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
        this.setState({ params });
        this.fetchMenuList(params);
    }

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {}
        });
        this.fetchTableList({});
        try {
            document.getElementsByClassName('ant-calendar-picker-clear')[0].click();
        } catch (e) {

        }
    }

    // toggleForm = () => {
    //     this.setState({
    //         expandForm: !this.state.expandForm,
    //     });
    // }

    handleMenuClick = (e) => {
        const { selectedRows } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
            case 'remove': this.removeUser()
                break;
            default:
                break;
        }
    }

    handleEditClick = (record) => {
        // if (record.userLevel > 4) {
        //     record.vipEndDate = record.diamondEndDate
        // }
        console.log('点编辑后', record);
        this.setState({
            modalVisible: true,
            editItem: record,
            editType: '编辑角色菜单',
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }
    //添加角色菜单
    handleModalVisible = (flag) => {
        console.log('flag', flag)
        this.setState({
            editType: '新增角色菜单',
            modalAddVisible: flag,
            editItem: {},
        });
    }
    //修改角色菜单
    handleModalEditVisible = (flag) => {
        this.setState({
            editType: '修改角色菜单',
            modalEditVisible: !!flag,
            editItem: {},
        });
    }
    //保存成功回调
    aflerAddCall = (res) => {
        console.log(res);
        if (res === true) {
            message.success('操作成功');
            this.setState({
                editItem: {},
                editType: '修改角色菜单',
            });
            const { params } = this.state;
            console.log('操作成功后', params);
            this.fetchRoleMenuList(params);
        } else {
            message.success('操作失败');
        }
    };

    //添加
    handleAddSubmitMenu = (record) => {
        let roleMenuList = [];
        let values = {};
        if (record.menuName.length > 0) {
            for (let i = 0; i < record.menuName.length; i++) {
                values = {
                    roleId: record.roleName,
                    menuName: record.menuName[i],
                    description: record.description
                }
                roleMenuList.push(values);
            }
        }
        console.log('submit values', values);
        console.log(record)
        const defaultOptions = {
            credentials: 'include',
            method: 'post',
            body: {roleMenuList},
        };
        this.handleModalVisible(false);
        const newOptions = { ...defaultOptions };
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
        // 调用接口
        request(`/api/roleMenuList/add`, newOptions, this.aflerAddCall);
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="usersListSearch">
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                        <Button type="primary" style={{ width: 180, marginBottom: 20, marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)}>
                            新增角色菜单
                        </Button>
                    </Col>
                </Row>

            </div>

        );
    }

    renderAdvancedForm() {
        return (
            <Form onSubmit={this.handleSearch} layout="inline">

            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const { selectedRows, editItem, editType, modalAddVisible, loading, menuList, roleMenuList, roleList, columns } = this.state;
        // const { selectedRows, editItem, editType, modalAddVisible } = this.state;
        console.log('roleMenuList', roleMenuList)
        return (
            <div>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <RoleMenuMantable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={roleMenuList}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            handleEditClick={this.handleEditClick}
                        />
                    </div>
                </Card>
                <Modal
                    title={editType}
                    visible={modalAddVisible}
                    closable={false}
                    footer={null}
                    destroyOnClose
                >
                    <RoleMenuCreateForm
                        cancelMethod={this.handleModalVisible}
                        data={[roleList, menuList]}
                        submitMethod={this.handleAddSubmitMenu}
                        dispatch={this.props.dispatch}
                        item={editItem}
                    />
                </Modal>
                {/*<Modal*/}
                {/*    title={editType}*/}
                {/*    visible={modalVisible}*/}
                {/*    closable={false}*/}
                {/*    footer={null}*/}
                {/*>*/}
                {/*    <MenuEditForm*/}
                {/*        cancelMethod={this.handleModalEditVisible}*/}
                {/*        submitMethod={this.handleAddSubmitAdmin}*/}
                {/*        dispatch={this.props.dispatch}*/}
                {/*        item={editItem}*/}
                {/*    />*/}
                {/*</Modal>*/}
            </div>
        );
    }
}
RoleMenuManagement = Form.create({})(RoleMenuManagement)
export default RoleMenuManagement;
