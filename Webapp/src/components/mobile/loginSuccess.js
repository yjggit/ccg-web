import React, { Component } from 'react';
import PropTypes from "proptypes";
import { Row, Col } from 'antd';
import { Modal, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './loginSuccess.css'
const alert = Modal.alert;

class loginSuccess extends Component {
  componentDidMount() {
    if (this.props.match.params.userRealName != undefined &&
      this.props.match.params.enteAddress != undefined &&
      this.props.match.params.enterpriseName != undefined) {
      alert('温馨提示', '基本信息不完善，请前往完善', [
        { text: 'Ok', onPress: () => this.onOk() },
      ])
    }
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  onOk =()=>{
    this.props.history.push('/mobileLogInfo')
  }
  render() {
    return (
      <div id='login_success'>
        <Row>
          <Col span={24}>
            <img className='imgWidth' src={require('../../images/loginsuc.jpg')} />
          </Col>
        </Row>

      </div>
    );
  }
}
loginSuccess.contextTypes = {
    router: PropTypes.object.isRequired
};
export default loginSuccess;