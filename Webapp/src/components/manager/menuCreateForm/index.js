import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, message } from 'antd';
const FormItem = Form.Item;
class RoleCreateForm extends PureComponent {
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

    componentDidMount() {
        console.log(this.props.item);
        // const { item: { vipEndDate, diamondEndDate } } = this.props;
        // switch (this.getUserType(userLevel)) {
        //     case 0:
        //         break;
        //     case 1:
        //         this.setState({ vipDate: new Date(vipEndDate).format('yyyy-MM-dd') });
        //         break;
        //     case 2:
        //         this.setState({ vipDate: new Date(diamondEndDate).format('yyyy-MM-dd') });
        //         break;
        // }
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
        const { item } = this.props;
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
                    <FormItem
                        {...formItemLayout}
                        label="菜单名称"
                    >
                        {getFieldDecorator('menuName', {
                            rules: [{
                                required: true, message: '请输入菜单名称',
                            }],
                        })(
                            <Input placeholder="菜单名称" />
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
                            <Input placeholder="菜单描述" />
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
RoleCreateForm = Form.create({})(RoleCreateForm)
export default RoleCreateForm;
