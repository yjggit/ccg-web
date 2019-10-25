import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Menu, Modal, message, DatePicker } from 'antd';
import MenuMantable from '../menuMantable/MenuMantable';
import MenuEditForm from '../menuEditForm/index.js';
import MenuCreateForm from '../menuCreateForm/index.js';
import { stringify } from 'qs';
import "./menuManagement.css"

import styles from './menuManagement.css';
import request from '../../../utils/request';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class MenuManagement extends PureComponent {
    state = {
        modalAddVisible: false,
        modalEditVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        editItem: {},
        editType: '新增菜单',
        data: {},
        loading: false,
        params: {},
        menuList: [],
    };

    componentDidMount() {
        this.fetchMenuList();
    }

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
        }, this.c1)
    };

    c1 = (data) => {
        // const { pageSize, current } = data.pagination;
        // const startno = (current - 1) * pageSize;
        // if (data.list != null) {
        //     data.list.map(function (value, key) {
        //         let nm = { no: startno + key + 1 };
        //         return Object.assign(value, nm);
        //     });
        // }
        this.setState({ menuList:data, loading: false });
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
            editType: '编辑菜单',
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }
    //添加角色
    handleModalVisible = (flag) => {
        console.log('flag',flag)
        this.setState({
            editType: '新增菜单',
            modalAddVisible: flag,
            editItem: {},
        });
    }
    //修改角色描述
    handleModalEditVisible = (flag) => {
        this.setState({
            editType: '修改菜单描述',
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
                editType: '修改菜单描述',
            });
            const { params } = this.state;
            console.log('操作成功后', params);
            this.fetchMenuList(params);
        } else {
            message.success('操作失败');
        }
    };

    handleAddSubmitMenu = (values) => {
        console.log('submit values', values);
        const defaultOptions = {
            credentials: 'include',
            method: 'post',
            body: values,
        };
        this.handleModalVisible(false);
        const newOptions = { ...defaultOptions, };
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
        // 调用接口
        request(`/api/menu/add`, newOptions, this.aflerAddCall);

    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="usersListSearch">
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                        <Button type="primary" style={{ width: 180, marginBottom: 20, marginRight: 10, backgroundColor: '#f29700', borderColor: "#f29700" }} onClick={() => this.handleModalVisible(true)}>
                            新增菜单
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
        const { loading, menuList } = this.state;
        const { selectedRows, editItem, editType, modalAddVisible } = this.state;
        console.log('menuList',menuList)
        return (
            <div>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <MenuMantable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={menuList}
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
                    <MenuCreateForm
                        cancelMethod={this.handleModalVisible}
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
MenuManagement = Form.create({})(MenuManagement)
export default MenuManagement;
