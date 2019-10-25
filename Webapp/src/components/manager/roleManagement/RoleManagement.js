import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message, DatePicker } from 'antd';
import RoleMantable from '../roleMantable/RoleMantable';
import RoleEditForm from '../roleEditForm/index.js';
import RoleCreateForm from '../roleCreateForm/index.js';
import { stringify } from 'qs';
import "./roleManagement.css"

import styles from './roleManagement.css';
import request from '../../../utils/request';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class RoleManagement extends PureComponent {

    state = {
        modalAddVisible: false,
        modalEditVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        editItem: {},
        editType: '新增角色',
        data: {},
        loading: false,
        params: {},
        roleList: []
    };

    componentDidMount() {
        this.fetchRoleList();
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
        // const { pageSize, current } = data.pagination;
        // const startno = (current - 1) * pageSize;
        // if (data.list != null) {
        //     data.list.map(function (value, key) {
        //         let nm = { no: startno + key + 1 };
        //         return Object.assign(value, nm);
        //     });
        // }
        this.setState({ roleList:data, loading: false });
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
        this.fetchRoleList(params);
    }

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {}
        });
        this.fetchRoleList({});
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

    handleRoleClick = (e) => {
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
            editType: '编辑角色',
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    //添加角色
    handleModalVisible = (flag) => {
        this.setState({
            editType: '新增角色',
            modalAddVisible: !!flag,
            editItem: {},
        });
    }
    //修改角色描述
    handleModalEditVisible = (flag) => {
        this.setState({
            editType: '修改角色描述',
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
                editType: '修改角色描述',
            });
            const { params } = this.state;
            console.log('操作成功后', params);
            this.fetchRoleList();
        } else {
            message.error('操作失败');
        }
    };


    handleAddSubmitRole = (values) => {
        console.log('submit values', values);
        this.handleModalVisible(false);
        const defaultOptions = {
            credentials: 'include',
            method: 'post',
            body: values,
        };
        const newOptions = { ...defaultOptions, };
        console.log(newOptions)
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
        //调用接口
        request(`/api/role/add`, newOptions, this.aflerAddCall);
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="usersListSearch">
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                        <Button type="primary" style={{ width: 180, marginBottom: 20, marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)}>
                            新增角色
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
        const { loading, roleList } = this.state;
        const { selectedRows, modalAddVisible, editItem, editType } = this.state;

        return (
            <div>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <RoleMantable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={roleList}
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
                    <RoleCreateForm
                        cancelMethod={this.handleModalVisible}
                        submitMethod={this.handleAddSubmitRole}
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
                {/*    <RoleEditForm*/}
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
RoleManagement = Form.create({})(RoleManagement)
export default RoleManagement;
