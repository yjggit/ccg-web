import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Popover, Progress } from 'antd';
import styles from './index.less';
import request from '../../utils/request';
const FormItem = Form.Item;
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

class ChangePwd extends PureComponent {
  state = {
    visible: false,
    confirmDirty: false,
    userId: 0,
  }
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
    let userId = null;
    let userinfot = sessionStorage.getItem("userinfo");
    if (userinfot != null && userinfot != undefined) {
      let userObj = JSON.parse(userinfot);
      if (userObj != null && userObj.data != null) {
        userId = userObj.data.userId;
      }
    }

    if (userId === null || userId === undefined) {
      return;
    }
    request(`/api/user/currentUser/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.c1)
  }
  c1 = (data) => {
    this.setState({ userId: data.userId })
  }
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  handleResetPwdSubmit = (e) => {
    e.preventDefault();

    const { form } = this.props;
    const { userId } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        userId,
      };
      this.props.handlePwdReset(values);
      this.setState({
        visible: false,
      });
      form.resetFields();
    });
  };
  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };
  cancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.cancelMethod();
  }
  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
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
            label="原始密码"
          >
            {getFieldDecorator('oldPwd', {
              rules: [{
                required: true, message: '请输入原密码',
              }, {
                validator: this.checkUserAccountRepeat,
              }],
            })(
              <Input placeholder="原密码" type="password" />
            )}
          </FormItem>
          <FormItem
            help={this.state.help}
            {...formItemLayout}
            label="登录密码"
          >
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <div style={{ float: 'right' }}>
            <Button key="submit" type="primary" onClick={this.handleResetPwdSubmit}>
              确认修改
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.cancel}>
              取消
            </Button>
          </div>
        </Form>
      </Card>);
  }
}
ChangePwd = Form.create({})(ChangePwd)
export default ChangePwd;
