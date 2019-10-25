import React, { PureComponent } from 'react';
import { Form, Card, Button, AutoComplete, Upload, Icon } from 'antd';
// import SelectEnterprise from '../../selectenterprise/index'
import request from '../../../utils/request'
const FormItem = Form.Item;
// const { TextArea } = Input;
class SpecifyManagerForm extends PureComponent {
  state = {
    enteNameDataSource: [],
    fileList: [],
    file: null,
  }

  handleAddSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    let { file } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let fileKey = file == null ? null : file.response == null ? null : file.response.message;
      fieldsValue['fileKey'] = fileKey;
      console.log(fieldsValue)
      this.props.submitMethod(fieldsValue);
      form.resetFields();
    });
  }
  cancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.cancelMethod();
  }

  handleSearch = (value) => {
    if (!value) {
      this.setState({ dataSource: [] })
      return;
    }
    this.setState({ dataSource: [] })
    request("/api/builder/names/" + value, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, res => {
      // console.log(res);
      if (res && res.length > 0) {
        let dataSource = res.map(d => {
          return d["builderName"];
        })
        this.setState({ enteNameDataSource: dataSource });
      }
    })
  }

  handleUpdateFileChange = ({ file, fileList }) => {
    this.setState({ fileList: [file], file: file })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { enteNameDataSource } = this.state;
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
            {getFieldDecorator('builderName')(
              <AutoComplete
                dataSource={enteNameDataSource}
                size="default"
                style={{ width: '92%' }}
                onSearch={this.handleSearch}
                placeholder="需要更新的企业名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="批量更新"
          >
            <Upload 
              name='file' 
              accept=".xlsx,.xls"
              action='/api/config/admin/updateTable' 
              onChange={this.handleUpdateFileChange}
              fileList={this.state.fileList}
              headers={{authorization: 'authorization-text'}}>
              <Button>
                <Icon type="upload" /> 点击上传Excel
              </Button>
            </Upload>
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
SpecifyManagerForm = Form.create({})(SpecifyManagerForm)
export default SpecifyManagerForm;
