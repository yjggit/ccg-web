import React, { Component } from 'react';
import {Modal } from 'antd';
import './vip_from.css'

require('./../font.js');

class about extends Component{
    state = { visible: false }

    showModal = () => {
      this.setState({
        visible: true,
      });
    }
  
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
    render(){
        return(
            <div className='ddgo_vipPay_from'>
                <h3 className='ddgo_vipPay_class'>VIP会员套餐</h3>
                <div className='ddgo_vipPay_box'>
                    <div className='ddgo_vipPay_boxList'>
                        <p>6个月</p>
                        <p><span>￥</span>2800</p>
                        <p>约15.5元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>一年</p>
                        <p><span>￥</span>4800</p>
                        <p>约13.2元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>二年</p>
                        <p><span>￥</span>7800</p>
                        <p>约10.8元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>三年</p>
                        <p><span>￥</span>9800</p>
                        <p>约8.9元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                </div>
                <h3 className='ddgo_vipPay_class'>钻石会员套餐</h3>
                <div className='ddgo_vipPay_box'>
                    <div className='ddgo_vipPay_boxList'>
                        <p>6个月</p>
                        <p><span>￥</span>3800</p>
                        <p>约21.1元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>一年<span>&nbsp;送3个月</span></p>
                        <p><span>￥</span>5800</p>
                        <p>约12.8元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>二年<span>&nbsp;送6个月</span></p>
                        <p><span>￥</span>8800</p>
                        <p>约9.7元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                    <div className='ddgo_vipPay_boxList'>
                        <p>三年<span>&nbsp;送一年</span></p>
                        <p><span>￥</span>11800</p>
                        <p>约8.2元/天</p>
                        <button  onClick={this.showModal}>立即购买</button>
                    </div>
                </div>
                <Modal
                title="线下支付方式"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName={"ddgo_vipPay_way_Modal"}
                >
                <div className='ddgo_vipPay_way'>
                    <p className='ddgo_vipPay_way_titel'>1.账户信息</p>
                    <p>平台暂不支持线上付款，您在我们平台发起的交易，请通过转账的方式汇入下列账户：</p>
                    <div className='ddgo_vipPay_way_card'>
                        <p>公司名称：四川智网多彩科技有限公司</p>
                        <p>开户银行：中国工商银行成都天府支行</p>
                        <p>银行账号：<span>4402&nbsp;0050&nbsp;0910&nbsp;0037&nbsp;832</span></p>
                    </div>
                    <p className='ddgo_vipPay_way_titel'>2.联系我们：</p>
                    <p>转账后，请拨打平台客服电话，核对转账信息；核对正确后，我们将在24小时内为您升级：</p>
                    <p>客服电话：<span>028-83383377</span></p>
                </div>
                </Modal>
            </div>
        )
    }
}

export default about;