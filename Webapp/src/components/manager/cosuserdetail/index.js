import React, { PureComponent } from 'react';
import { Form, Radio, Card, Input, Button, message } from 'antd';

const FormItem = Form.Item;
@Form.create()
class CosUserDetail extends PureComponent {
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

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
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
    return (
      <Card bordered={false}>
        <Form
          onSubmit={this.handleAddSubmit}
          style={{ marginTop: 0 }}
        >
          <FormItem
            {...formItemLayout}
            label="真实姓名"
          >
            {getFieldDecorator('userRealName', {
              rules: [{
                required: true, message: '请输入用户真实姓名',
              }],
            })(
              <Input placeholder="用户真实姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="登陆账号"
          >
            {getFieldDecorator('userAccount', {
              rules: [{
                required: true, message: '请输入用户登陆账号',
              }],
            })(
              <Input placeholder="用户登陆账号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
          >
            {getFieldDecorator('phoneNo', {
              rules: [{
                required: true, message: '请输入用户手机号码',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              }],
            })(
              <Input placeholder="用户手机号码" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户邮箱"
          >
            {getFieldDecorator('userEmail', {
              rules: [{
              required: false, message: '请输入用户邮箱',
            }, {
              type: 'email',
              message: '邮箱地址格式错误！',
            }],
          })(
            <Input placeholder="用户邮箱" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户昵称"
          >
            {getFieldDecorator('userNickName', {
            })(
              <Input placeholder="请输入用户昵称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户性别"
          >
            {getFieldDecorator('userSex', {
              initialValue: 'M',
            })(
              <Radio.Group>
                <Radio value="M">男</Radio>
                <Radio value="F">女</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户性别"
          >
            {getFieldDecorator('userType', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="1">个人用户</Radio>
                <Radio value="2">企业用户</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业名称"
          >
            {getFieldDecorator('enteId', {
            })(
              <Input placeholder="请输入企业名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="当前状态"
          >
            {getFieldDecorator('userStatus', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="1">启用</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
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
export default CosUserDetail;
