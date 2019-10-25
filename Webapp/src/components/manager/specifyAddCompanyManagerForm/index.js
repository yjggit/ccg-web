import React, { PureComponent } from 'react';
import { Form, Card, Input, Button } from 'antd';
const FormItem = Form.Item;

class specifyAddCompanyManagerForm extends PureComponent {
  state={
  }

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
            label="企业名称"
          >
            {getFieldDecorator('builderName', {
            	rules: [{
  	              required: true, message: '请输入企业名称',
  	            }],
            })(
              <Input placeholder="企业名称" size="default" style={{ width: '92%' }} />
            )}
          </FormItem>
          <FormItem
	          {...formItemLayout}
	          label="企业属地"
	        >
	          {getFieldDecorator('location', {
	            rules: [{
	              required: true, message: '请输入企业属地',
	            }],
	          })(
	            <Input placeholder="企业属地" />
	          )}
	      </FormItem>
	      <FormItem
	          {...formItemLayout}
	          label="企业法人"
	        >
	          {getFieldDecorator('legalPerson', {
	            rules: [{
	              required: true, message: '请输入企业法人',
	            }],
	          })(
	            <Input placeholder="企业法人" />
	          )}
	      </FormItem>
	      <FormItem
	          {...formItemLayout}
	          label="来源URL"
	        >
	          {getFieldDecorator('sourceUrl', {
	            rules: [{
	              required: true, message: '请输入企业来源URL',
	            }],
	          })(
	            <Input placeholder="来源URL" />
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
specifyAddCompanyManagerForm = Form.create({})(specifyAddCompanyManagerForm)
export default specifyAddCompanyManagerForm;
