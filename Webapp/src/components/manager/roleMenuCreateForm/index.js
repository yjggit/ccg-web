import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, message, Select } from 'antd';
const FormItem = Form.Item;
class RoleMenuCreateForm extends PureComponent {
    state = {
        selectEnterModalVisible: false,
        enteId: '',
        enteName: '',
        vipDate: '',
        vipDateMem: {},
        targetValue: '',
        firsetset: false,
        pcd: '',
        bgdz: '',
        defaultbgdz: '',
    }

    aflerAddCall = (res) => {
        if (res.status === 'ok') {
            const { form } = this.props;
            message.success('添加成功');
            form.resetFields();
        } else {
            message.success(`添加失败:+${res.message}`);
        }
    };

    handleAddSubmit = (e) => {
        e.preventDefault();
        const { form, item } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                roleId: this.state.roleId,
                ...fieldsValue
            };
            this.props.submitMethod(values);
            form.resetFields();
        });
    }
    cancel = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.cancelMethod();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        console.log("this.props", this.props)
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };

        function filter(inputValue, path) {
            return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        return (
            <Card bordered={false}>
                <Form
                    onSubmit={this.handleAddSubmit}
                    style={{ marginTop: 0 }}
                >
                    {/* 下拉框 */}
                    <FormItem
                        {...formItemLayout}
                        label="角色名称"
                    >
                        {getFieldDecorator('roleName', {
                            rules: [{
                                required: true, message: '请输入角色名称',
                            }],
                        })(
                            <Select placeholder="角色名称" allowClear="true">
                                {this.props.data[0].map((data, i) => (
                                    <Select.Option value={data.roleId}>{data.roleName}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="菜单名称"
                    >
                        {getFieldDecorator('menuName', {
                            rules: [{
                                required: true, message: '请输入菜单名称',
                            }],
                        })(
                            <Select placeholder="菜单名称" allowClear="true" mode='multiple'>
                                {this.props.data[1].map((item, i) => (
                                    <Select.Option value={item.menuName}>{item.menuName}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="菜单描述"
                    >
                        {getFieldDecorator('description', {
                            rules: [{
                                required: true, message: '请输入菜单描述',
                            }],
                        })(
                            <Select placeholder="菜单描述" allowClear="true">
                                {this.props.data[1].map((item, i) => (
                                    <Select.Option value={item.description}>{item.description}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" onClick={this.handleAddSubmit}>
                            保存
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.cancel}>
                            取消
                        </Button>
                    </div>
                </Form>
            </Card>);
    }
}
RoleMenuCreateForm = Form.create({})(RoleMenuCreateForm)
export default RoleMenuCreateForm;
