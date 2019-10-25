import React, {PureComponent} from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    message,
    Modal,
    Table,
    Select,
    Menu,
    InputNumber,
    Icon,
    Divider, AutoComplete,
} from "antd";
import { stringify } from 'qs';
import request from "../../../utils/request";
import './index.css';
import styles from "./index.less";
import AchievementModal from "../achievementModal";

const getValue = (obj) => Object.keys(obj).map(key => obj[key]).join(',');
const FormItem = Form.Item;
const { Option } = Select;

class AchievementInfo extends PureComponent {
    state = {
        loading: false,
        reset: false,
        data: [],
        selectedRows: [],
        formValues: {},
        params: {},
        row: [],
        performCategory: [],
        list: [],
        pagination: {},
        selectedRowKeys: [],
        modalVisible: false,
        modalTitle: '详情新增',
        editItem: {},
        dataSource: [],
        buildName: '',
        deleteModalTitle: '',
        deleteModalVisible: false,
    };

    componentDidMount() {
        this.fetchPerformCategory();
        this.fetchSearchList();
    }

    fetchPerformCategory = () => {
        let REQUEST_URL = `/api/perform/category`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({
                performCategory: data,
            });
        })
    };

    fetchSearchList = (params) => {
        let REQUEST_URL = `/api/perform/filter?${stringify(params)}`;
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
        // console.log('newData', data);
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        // this.clearCheckedStatus();
        this.setState({formValues: {}, selectedRowKeys: [], reset: true,});
        this.fetchSearchList();

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

    handleSubmit = (e) => {
        e.preventDefault();

        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let { projectType, builderName, projectName, startPrice, endPrice, role} = fieldsValue;
            if ((projectType === undefined) && (!this.state.reset)
                && (role === undefined || role === '')
                && (projectName === undefined || projectName === '')
                && (builderName === undefined || builderName === '')
                && (startPrice === undefined || startPrice === '')
                && (endPrice === undefined || endPrice === '')) {
                message.info('请输入查询条件');
                return;
            }
            fieldsValue.startPrice = (startPrice || 0) * 10000;
            fieldsValue.endPrice = (endPrice || 0) * 10000;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            console.log('form values', values);
            this.setState({
                formValues: values,
            });
            this.fetchSearchList(values);
        })
    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const { performCategory } = this.state;
        const performCategoryOptions = performCategory.map(lo =>
            <Select.Option key={lo.projectTypeId} value={lo.projectTypeId}>
            {lo.projectTypeName}
            </Select.Option>);
        return (
            <div >
                <Row>
                    <Form onSubmit={this.handleSubmit} layout="inline">
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="公司名称：">
                                {getFieldDecorator('builderName')(
                                    <Input placeholder="请输入公司名称" allowClear="true" style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="业绩名称：">
                                {getFieldDecorator('projectName')(
                                    <Input placeholder="请输入业绩名称" allowClear={true} style={{width: 200}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="业绩金额(万元)：">
                                <div className='achievement_AmountRange'>
                                    {getFieldDecorator('startPrice')(
                                        <InputNumber min={1} step={1} placeholder="请输入" />
                                    )}
                                    <span style={{ lineHeight: "32px"}}>&nbsp;-&nbsp;</span>
                                    {getFieldDecorator('endPrice')(
                                        <InputNumber min={1} step={1} placeholder="请输入" />
                                    )}
                                </div>
                            </FormItem>

                        </Col>
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="项目类别">
                                {getFieldDecorator('projectType')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                    <Select.Option value="">不限</Select.Option>
                                        {performCategoryOptions}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>


                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="角色主体">
                                {getFieldDecorator('role')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                        {/*<Option value="">不限</Option>*/}
                                        <Option value="施工">施工</Option>
                                        <Option value="勘察">勘察</Option>
                                        <Option value="监理">监理</Option>
                                        <Option value="设计">设计</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <Button type="primary" htmlType="submit" style={{width: 100}} onClick={this.handleSubmit}>查询</Button>
                            <Button style={{ marginLeft: 8 , width: 100}} onClick={this.handleFormReset}>重置</Button>
                            {/*<Button style={{ marginLeft: 8 , width: 100}} onClick={this.handleAddModal}>新增</Button>*/}
                        </Col>
                    </Form>
                </Row>

            </div>

        );
    }

    handleTableChange = (pagination, filtersArg, sorter) => {
        // if (this.state.userLevel !== 2) {
        //     this.setState({
        //         visible: true
        //     })
        //     return;
        // }
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

    handleRowSelectChanges = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
    };

    handleSave = (params) => {
        this.updateAchievement(params);
        this.setState({modalVisible: false});
    };

    handleSaveSubmit = () => {
        const { form } = this.props;
        const { editItem } = this.state;

        const updateDate = new Date().getTime();
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const {
                modalBuilderName, modalProjectName, modalProjectType, modalProjectStatus, modalRole, modalBidPrice,
                projectDate, modalProjectLeader, modalOwnerName,
            } = fieldsValue;
            const values = {
                ...editItem,
                builderName: modalBuilderName,
                projectName: modalProjectName,
                bidPrice: modalBidPrice,
                projectType: modalProjectType,
                projectLeader: modalProjectLeader,
                ownerName: modalOwnerName,
                role: modalRole,
                projectStatus: modalProjectStatus,
                updateDate: updateDate,
            };
            switch (editItem.projectStatus) {
                case 0:
                    values.bidDate = projectDate;
                    values.startDate = null;
                    values.endDate = null;
                    break;
                case 1:
                    values.bidDate = null;
                    values.startDate = projectDate;
                    values.endDate = null;
                    break;
                case 2:
                    values.bidDate = null;
                    values.startDate = null;
                    values.endDate = projectDate;
                    break;
                default:
                    break;
            }
            console.log('achievement create form values', values);

            this.updateAchievement(values);

            form.resetFields();
            this.setState({modalVisible: false});
        })
    };

    updateAchievement = (params) => {
        // console.log('update params', params);
        let REQUEST_URL = `/api/admin/project/update?${stringify(params)}`;
        // this.setState({ loading: true });
        request(REQUEST_URL, {
            // credentials: 'include',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // param: JSON.stringify(params)
        }, this.editCb);
    };

    editCb = (data) => {
        if(data.status==='ok'){
            message.success('更新成功',1);
            this.fetchSearchList();
        }else{
            message.error('更新失败',1);
        }
    };

    onCancel = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({modalVisible: false});
    };

    handleEditClick = (record) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑业绩',
            editItem: record
        })
    };

    transformProjectType = (type) => {
        switch (type) {
            case 0:
                return "房建";
            case 1:
                return "市政";
            case 2:
                return "公路";
            case 3:
                return "水利";
            case 4:
                return "勘察";
            case 5:
                return "设计";
            case 6:
                return "监理";
            case 7:
                return "采购";
            case 9:
                return "其他";
            case 10:
                return "招标代理";
            case 11:
                return "咨询";
            case 12:
                return "造价";
            case 13:
                return "PPP";
            case 14:
                return "EPC";
        }
    };

    handleSearch = (value) => {
        if(!value){
            this.setState({ dataSource: [] });
            return;
        }
        this.setState({ dataSource: [] });
        request("/api/builder/names/" + value,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, res => {
            // console.log(res);
            if(res && res.length > 0){
                let dataSource = res.map(d => {
                    return d["builderName"];
                });
                this.setState({ dataSource: dataSource });
            }
        })
    };

    builderNameChange = (value) => {
        this.setState({ buildName: value });
    };

    renderModalContent() {
        const { getFieldDecorator } = this.props.form;
        const { editItem, buildName, dataSource } = this.state;
        const { performCategory } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 19 },
                sm: { span: 19 },
            },
        };
        const performCategoryOptions = performCategory.map(lo =>
            <Option key={lo.projectTypeId} value={lo.projectTypeId}>{lo.projectTypeName}</Option>);

        return (
            <Card bordered={false}>
                <Form
                    onSubmit={this.handleSaveSubmit}
                    style={{ marginTop: 0 }}
                >
                    <FormItem
                        {...formItemLayout}
                        label="公司名称"
                    >
                        {getFieldDecorator('modalBuilderName', {
                            initialValue: editItem ? editItem.builderName : '',
                            rules: [{
                                required: true, message: '请输入公司名称',
                            }],
                        })(
                            <AutoComplete
                            value={buildName}
                            onChange={this.builderNameChange}
                            dataSource={dataSource}
                            onSearch={this.handleSearch}
                            placeholder="公司名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目名称"
                    >
                        {getFieldDecorator('modalProjectName', {
                            initialValue: editItem ? editItem.projectName : '',
                            rules: [{
                                required: true, message: '请输入项目名称',
                            },
                            ],
                        })(
                            <Input placeholder="项目名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目类型"
                    >
                        {getFieldDecorator('modalProjectType', {
                            rules: [{
                                required: true, message: '请选择项目类型',
                            }],
                            initialValue: (!editItem || editItem.projectType === null) ? '' : editItem.projectType,
                        })(
                            <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                {performCategoryOptions}
                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="业绩状态"
                    >
                        {getFieldDecorator('modalProjectStatus', {
                            rules: [{
                                required: true, message: '请选择业绩状态',
                            }],
                            initialValue: (!editItem || editItem.projectStatus === null) ? '' : editItem.projectStatus,
                        })(
                            <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                <Option key={0} value={0}>中标业绩</Option>
                                <Option key={1} value={1}>在建业绩</Option>
                                <Option key={2} value={2}>完工业绩</Option>
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="角色主体"
                    >
                        {getFieldDecorator('modalRole', {
                            rules: [{
                                required: true, message: '请选择角色主体',
                            }],
                            initialValue: (!editItem || editItem.role === null) ? '' : editItem.role,
                        })(
                            <Select placeholder="请选择" allowClear="true" style={{width:200}}>
                                <Option value="施工">施工</Option>
                                <Option value="勘察">勘察</Option>
                                <Option value="监理">监理</Option>
                                <Option value="设计">设计</Option>
                            </Select>
                        )}

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="项目负责人"
                    >
                        {getFieldDecorator('modalProjectLeader', {
                            initialValue: editItem ? editItem.projectLeader : '',
                            rules: [{
                                message: '请输入项目负责人',
                            },
                            ],
                        })(
                            <Input placeholder="项目负责人" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="业主"
                    >
                        {getFieldDecorator('modalOwnerName', {
                            initialValue: editItem ? editItem.ownerName : '',
                            rules: [{
                                required: true, message: '请输入业主',
                            },
                            ],
                        })(
                            <Input placeholder="业主" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="业绩金额"
                    >
                        {getFieldDecorator('modalBidPrice', {
                            initialValue: editItem ? editItem.bidPrice : '',
                            rules: [{
                                required: true, message: '请输入业绩金额',
                            },
                            ],
                        })(
                            <Input placeholder="业绩金额" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={editItem.projectStatus == 0 ? '中标时间' : editItem.projectStatus == 1 ? '在建时间' : '完工时间'}
                    >
                        {getFieldDecorator('projectDate', {
                            initialValue: editItem.projectStatus == 0 ? editItem.bidDate : editItem.projectStatus == 1 ? editItem.startDate : editItem.endDate ,
                            rules: [{
                                required: true, message: '请输入业绩时间',
                            },
                            ],
                        })(
                            <Input placeholder="业绩时间" />
                        )}
                    </FormItem>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" onClick={this.handleSaveSubmit}>
                            保存
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.onCancel}>
                            取消
                        </Button>
                    </div>
                </Form>
            </Card>
        )
    }

    handleDeleteClick = (id) => {
        console.log('delete id:', id);
        this.setState({
            deleteModalVisible: true,
            deleteModalTitle: '单项删除',
            deleteItemID: id
        })
    };

    handleMultipleDeleteClick = () => {
        this.setState({
            deleteModalVisible: true,
            deleteModalTitle: '批量删除',
        })
    };

    onDeleteCancel = () => {
        this.setState({
            deleteModalVisible: false,
        });
    };

    handleSaveDelete = () => {
        const { selectedRowKeys, deleteModalTitle, deleteItemID } = this.state;
        if(deleteModalTitle === '单项删除') {
            this.removeAchievement(deleteItemID);
        }else if(deleteModalTitle === '批量删除') {
            selectedRowKeys.forEach(item => this.removeAchievement(item));
        }


        this.setState({deleteModalVisible: false});
    };

    removeAchievement = (id) => {
        let REQUEST_URL = `/api/admin/project/delete/${id}`;
        request(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }, this.deleteCb);
    };

    deleteCb = (data) => {
        if(data.status==='ok'){
            message.success('删除成功',1);
            this.setState({selectedRowKeys: []});
            this.fetchSearchList();
        }else{
            message.error('删除失败',1);
        }
    };

    render() {
        const { loading, list, selectedRows, selectedRowKeys, modalTitle, modalVisible, deleteModalTitle, deleteModalVisible } = this.state;

        const columns = [
            {
                title: '序号',
                dataIndex: 'no',
            },
            {
                title: '项目名称',
                dataIndex: 'projectName',
            },
            {
                title: '业绩金额',
                dataIndex: 'bidPrice',
            },
            {
                title: '项目类型',
                dataIndex: 'projectType',
                render: (text, row, index) => this.transformProjectType(text)
            },
            {
                title: '角色主体',
                dataIndex: 'role',
            },
            {
                title: '承建单位',
                dataIndex: 'builderName',
            },
            {
                title: '项目属地',
                dataIndex: 'projectSite',
            },
            {
                title: '操作',
                render: (text, row, index) => (
                        <div style={{ }}>
                            <a title="编辑"><Icon type="edit" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.handleEditClick(row)}  /></a>
                            <Divider type="vertical" />
                            <a title="删除"><Icon type="delete" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.handleDeleteClick(row.projectId)}/></a>
                        </div>
                ),
            },
        ];
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.pagination.total,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            showTotal: () => `总共 ${this.state.pagination.total} 记录`
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChanges,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        return (
            <div className="cookieSeach">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>
                        <div className={styles.tableListOperator} style={{marginBottom:15}}>

                            {
                                selectedRowKeys.length > 1 && (

                                    <Menu onClick={this.handleMultipleDeleteClick} selectedKeys={[]}>
                                        <Menu.Item key="remove">批量删除</Menu.Item>
                                    </Menu>
                                )
                            }
                        </div>
                        <Table
                            dataSource={list}
                            rowKey={record => record.projectId}
                            rowSelection={rowSelection}
                            pagination={paginationProps}
                            loading={loading}
                            columns={columns}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>

                {/*<Modal*/}
                {/*    title={modalTitle}*/}
                {/*    visible={modalVisible}*/}
                {/*    closable={false}*/}
                {/*    footer={null}*/}
                {/*    onCancel={this.onCancel}>*/}
                {/*    {this.renderModalContent()}*/}

                {/*</Modal>*/}

                <AchievementModal
                    fetchTable={this.fetchSearchList}
                    performCategory={this.state.performCategory}
                    item={this.state.editItem}
                    visible={this.state.modalVisible}
                    onCancel={this.onCancel}
                    onConfirm={this.handleSave}
                />


                <Modal
                    title={deleteModalTitle}
                    visible={deleteModalVisible}
                    closable={false}
                    footer={null}
                    onCancel={this.onDeleteCancel}>
                    <div style={{margin: 20}}>
                        {deleteModalTitle === '单项删除' ?  '确认删除该项？' : '确认删除这些项？'}

                        <div style={{ float: 'right' }}>
                            <Button key="submit" type="primary" onClick={this.handleSaveDelete}>
                                保存
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.onDeleteCancel}>
                                取消
                            </Button>
                        </div>
                    </div>

                </Modal>
            </div>
        );
    }

}
AchievementInfo = Form.create({})(AchievementInfo);
export default AchievementInfo;
