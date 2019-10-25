import React, { Component } from 'react';
import './person_invoice.css'
import InvoiceAppImg from './../../images/InvoiceAppImg.png'
import InvoiceAppImgExam from './../../images/InvoiceAppImgExample.png'

class PersonInvoice extends Component{
	render(){
		return(
			<div id="InvoiceApplication">
        			<h3>发票申请</h3>				
					<img src={InvoiceAppImg} />
					<div>
						<h3>温馨提示：</h3>
						<p>1、申请发票日期:周一至周五9:00-17:00; </p>
						<p>2、扫码后请根据提示填写完整的开票信息，<span>邮箱地址填写在开票信息地址栏里面</span>，我们将尽快把电子发票发送至您预留的邮箱。</p>
						<p>3、用户在提交申请前请仔细核查发票信息及邮箱地址是否正确，平台不支持同一发票重复开具。</p>
					</div>
					<div>
						<h3>发票填写示例:</h3>
						<img src={InvoiceAppImgExam}/>
					</div>
			</div>
		)
	}

}
export default PersonInvoice;