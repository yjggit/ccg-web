import React, { PureComponent } from 'react';
import { Card } from 'antd';

class InvoiceShow extends PureComponent {

	componentDidMount() {
	}


	render() {
		const { item } = this.props;
		let forType = '';
		if (item.invForType === 1) {
			forType = '公司';
		} else if (item.invForType === 2) {
			forType = '个人';
		}
		let invType = '';
		if (item.invType === 1) {
			invType = '增值税普通发票';
		} else if (item.invType === 2) {
			invType = '增值税专用发票';
		}
		let d = new Date(item.applyDate);
		let dateStr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		let opeDateStr = '';
		if (item.opeDate != null) {
			d = new Date(item.opeDate);
			opeDateStr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

		}


		return (
			<div>
				<Card bordered={false}>
					<div>申请公司：{item.applyEnteName}</div>
					<div>申请人：{item.userName}</div>
					<div>申请时间：{dateStr}</div>
					<div>发票抬头：{item.invHeader}</div>
					<div>开具类型：{forType}</div>
					<div>发票类型：{invType}</div>
					<div>纳税号：{item.inNo}</div>
					<div>开户行：{item.enterBank}</div>
					<div>开户行账号：{item.enterBankAccount}</div>
					<div>企业地址：{item.enterAddress}</div>
					<div>联系电话：{item.contactPhone}</div>
					<div>联系人：{item.contactName}</div>
					<div>联系人邮箱：{item.contactEmail}</div>
					<div>操作时间：{opeDateStr}</div>
					<div>操作人：{item.opeUserName}</div>
				</Card>
			</div>
		);
	}
}
export default InvoiceShow;