import React, { PureComponent } from 'react';
import {Form, Radio, Card, Input, Button, message, Icon, Modal, Select, DatePicker, Cascader, AutoComplete} from 'antd';
import request from "../../../utils/request";
const Option = Select.Option;
const FormItem = Form.Item;
class AchievementModal extends PureComponent {
    state = {
        dataSource: [],
        modalTitle: '编辑业绩',
    };


    handleSaveSubmit = () => {
        const { form, item } = this.props;
        const updateDate = new Date().getTime();
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const {
                modalBuilderName, modalProjectName, modalProjectType, modalProjectStatus, modalRole, modalBidPrice,
                projectDate, modalProjectLeader, modalOwnerName,
            } = fieldsValue;
            const values = {
                ...item,
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
            switch (item.projectStatus) {
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

            form.resetFields();
            this.props.onConfirm(values);
        })
    };


    builderNameChange = (value) => {
        this.setState({ buildName: value });
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

    renderModalContent() {
        const { getFieldDecorator } = this.props.form;
        const {  buildName, dataSource } = this.state;
        const { performCategory, item } = this.props;
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
                            initialValue: item ? item.builderName : '',
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
                            initialValue: item ? item.projectName : '',
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
                            initialValue: (!item || item.projectType === null) ? '' : item.projectType,
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
                            initialValue: (!item || item.projectStatus === null) ? '' : item.projectStatus,
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
                            initialValue: (!item || item.role === null) ? '' : item.role,
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
                            initialValue: item ? item.projectLeader : '',
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
                            initialValue: item ? item.ownerName : '',
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
                            initialValue: item ? item.bidPrice : '',
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
                        label={item.projectStatus == 0 ? '中标时间' : item.projectStatus == 1 ? '在建时间' : '完工时间'}
                    >
                        {getFieldDecorator('projectDate', {
                            initialValue: item.projectStatus == 0 ? item.bidDate : item.projectStatus == 1 ? item.startDate : item.endDate ,
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

    onCancel = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.onCancel();
    };

    render() {
        const { visible } = this.props;
        const { modalTitle } = this.state;
        return (
            <Modal
                title={modalTitle}
                visible={visible}
                closable={false}
                footer={null}
                onCancel={this.onCancel}>
                {this.renderModalContent()}
            </Modal>
        )
    }
}
AchievementModal = Form.create({})(AchievementModal)
export default AchievementModal;
