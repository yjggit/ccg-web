import React, { Component } from 'react';
import './person_customize.css'
import customizedBanner01 from './../../images/customized_banner01.png'
import { message, Modal, Table, Button, Icon, Tooltip } from 'antd';
import InvoiceShow from '../showinvoice/InvoiceShow';
import { stringify } from 'qs';




import request from '../../utils/request'

import genelink from '../../utils/linkutil'
import emitter from "../../event"
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class PersonCustomize extends Component {

	state = {
		list: [],
		pagination: {},
		loading: true,
		modalVisible: false,
		editItem: {},
		userId: 0,
		selectedRows: [],
		selectedRowKeys: [],
		tableState: false,
		locations: [],
		locationData: {},
        noticeType: 1,
	};
	componentDidMount() {
		let userId = null;
		let userinfot = sessionStorage.getItem("userinfo");
		if (userinfot != null && userinfot != undefined) {
			let userObj = JSON.parse(userinfot);
			if (userObj) {
				userId = userObj.data.userId;
				this.setState({ userId });
				this.fetchTableList({
					userId: userId,
					noticeType: 1,
				});
			}
		}

		if (userId === null || userId === undefined) {
			return;
		}
		this.fetchBuilderLocations();
	}

	fetchBuilderLocations = () => {
		request("/api/builder/builderLocation?isLocal=1", {
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			}
		  }, res => {
			let locationData = {};
			res.map((lo) => {
			  locationData[lo.localId] = lo.localName;
			})
			this.setState({ locations: res, locationData: locationData })
		  });
	}

	changeTableState = (state = false) => {
		const { tableState } = this.state;
		if (tableState !== state) {
			this.fetchTableList({
				noticeType: state ? 2 : 1
			})
		}
		this.setState({
            noticeType: state ? 2 : 1,
			tableState: state
		})
	}

	handleCompositeTableChange = (pagination, filtersArg, sorter) => {
		const { formValues, userId, noticeType } = this.state;
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj };
			newObj[key] = getValue(filtersArg[key]);
			return newObj;
		}, {});

		const params = {
			currentPage: pagination.current,
			pageSize: pagination.pageSize,
            noticeType: noticeType,
			...formValues,
			...filters,
			userId,
		};
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`;
		}

		this.fetchTableList({
			pageSize: pagination.pageSize,
			currentPage: pagination.current,
			sortField: sorter.field,
			sortOrder: sorter.order,
			...params,
		});
	}
	fetchTableList = (params = {}) => {
		let REQUEST_URL = `/api/notice/listNotice?${stringify(params)}`;
		this.setState({ loading: true });
		request(REQUEST_URL, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, this.c2)
	}
	c2 = (data) => {
		console.log(data)
		const { pageSize, current } = data.pagination;
		const startno = (current - 1) * pageSize;
		if (data.list != null) {
			data.list.map(function (value, key) {
				let nm = { no: startno + key + 1 };
				return Object.assign(value, nm);
			});
		}
		this.setState({
			list: data.list,
			loading: false,
			pagination: data.pagination
		});
		emitter.emit("getNoticeCount");
	}
	handleShowClick = (item) => {
		this.setState({ modalVisible: true, editItem: item });
	}
	handleCancel = () => {
		this.setState({ modalVisible: false, editItem: {} });
	}
	handleDelete = (record) => {
		let userinfo = sessionStorage.getItem("userinfo");
		let userObj = JSON.parse(userinfo);
		var params = {
			userId: userObj.data.userId,
			noticeId: record.noticeId,
		}
		this.deleteNotice(params);
	}
	c5 = (data) => {
		if (data.status === 'ok') {
			message.success('删除成功', 1);
			emitter.emit("getNoticeCount");
			this.fetchTableList({ userId: this.state.userId, noticeType: this.state.noticeType});
		} else {
			message.success(`${data.message}`, 1)
		}
	}
	handleRead = (record) => {
		let userinfo = sessionStorage.getItem("userinfo");
		let userObj = JSON.parse(userinfo);
		var params = {
			userId: userObj.data.userId,
			noticeId: record.noticeId,
		}
		let REQUEST_URL = `/api/notice/readNotice`;
		request(REQUEST_URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params)
		}, this.c6)

	}
	c6 = (data) => {
		if (data.status === 'ok') {
			message.success('已读', 1);
			//  this.fetchTableList({userId:this.state.userId, noticeType: this.state.noticeType});
			emitter.emit("getNoticeCount");
		} else {
			message.success(`${data.message}`, 1)
		}
	}
	c3 = (data) => {
		if (data.status === 'ok') {
			this.fetchTableList({ userId: this.state.userId });
		} else {
			message.success(`${data.message}`, 1)
		}
	}
	deleteNotice = (params) => {
		let REQUEST_URL = `/api/notice/deleteNotice`;
		request(REQUEST_URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params)
		}, this.c5)
	}
	handleBatchDelete = () => {
		console.log("xxxx");
		const { selectedRows } = this.state;
		let yy = [];
		for (let i = 0; i < selectedRows.length; i++) {
			yy.push(selectedRows[i].noticeId);
		}
		let userinfo = sessionStorage.getItem("userinfo");
		let userObj = JSON.parse(userinfo);
		var params = {
			userId: userObj.data.userId,
			noticeId: yy.join(","),
		}
		this.deleteNotice(params);
		this.setState({ selectedRowKeys: [], selectedRows: [] })

	}
	titleShort = (title, len = 40) => {
		let s = title;
		if (title != null && title.length > 40) {
			s = <Tooltip title={title}>{title.substring(0, len) + "..."}</Tooltip>;
		}
		return s;
	}
	handleRowSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRows });
		this.setState({ selectedRowKeys });
	}

	renderNumberFormatW = (num, num2 = 10000) => {
        if (/^[0-9.]*$/.test(num)) {
            if (!num || num < 0) {
                return '0万元';
            }
            return (parseInt(num) / num2) + "万元";
        } else {
            return num;
        }
    }

	render() {
		const { modalVisible, editItem, selectedRowKeys, tableState, locationData } = this.state;
		const bidResultNoticeColumns = [
			{
				title: "已读/未读",
				dataIndex: 'hasRead',
				key: "result-hasRead",
				render(val, record) {
					if (record.hasRead != "0") {
						return "已读"
					} else {
						return "未读"
					}
				}
			},
			{
				title: "项目名称",
				key: "result-projectName",
				dataIndex: 'id',
				render: (val, record) => {
					let srcWeb = record.sourceWeb === 'http://www.sccin.com.cn';
					let s1 = record.publishDate;
					s1 = new Date(s1.replace(/-/g, "/"));
					let s2 = new Date();
					let days = s2.getTime() - s1.getTime();
					let time = parseInt(days / (1000 * 60 * 60 * 24));
					let url = 'http://www.sccin.com.cn/InvestmentInfo/ZhaoBiao/' + record.sourceId;

					return time <= 20 && srcWeb ? <a rel="noreferrer" title={record.noticeTitle} href={genelink(url, true)}
													 target="_blank" onClick={() => { this.handleRead(record) }}>{this.titleShort(record.noticeTitle)}</a> :
						<a rel="noreferrer" title={record.noticeTitle} href={genelink(record.sourceUrl, true)}
						   target="_blank" onClick={() => { this.handleRead(record) }}>{this.titleShort(record.noticeTitle)}</a>;


					// return <a title={record.noticeTitle} href={genelink(record.sourceUrl)} onClick={() => { this.handleRead(record) }} target="_blank" >{this.titleShort(record.noticeTitle)}</a>
				},
			},
			{
				title: "资质类别",
				key: "result-type",
				dataIndex: 'qualificationKeyWords',
				render: (val) => {
					return this.titleShort(val, 30)
				}
			},
			{
				title: "中标企业",
				key: "result-builderName",
				dataIndex: 'builderName',
				render: (val) => {
					return this.titleShort(val, 30)
				}
			},
			{
				title: "地区",
				dataIndex: 'locationName',
				key: "result-location",
				render: (val) => {
					return locationData[val]
				},
			},
			{
				title: "金额",
				key: "result-money",
				dataIndex: 'money',
				render: (val, record) => {
					return this.titleShort(this.renderNumberFormatW(val), 20)
				},
			},
			{
				title: "发布时间",
				key: "result-date",
				dataIndex: 'publishDate',
			},
		]
		const bidInviteNoticeColumns = [
			{
				title: "已读/未读",
				dataIndex: 'hasRead',
				key: "result-hasRead",
				render(val, record) {
					if (record.hasRead != "0") {
						return "已读"
					} else {
						return "未读"
					}
				}
			},
			{
				title: "项目名称",
				key: "result-projectName",
				dataIndex: 'id',
				render: (val, record) => {
					let srcWeb = record.sourceWeb === 'http://www.sccin.com.cn';
					let s1 = record.publishDate;
					s1 = new Date(s1.replace(/-/g, "/"));
					let s2 = new Date();
					let days = s2.getTime() - s1.getTime();
					let time = parseInt(days / (1000 * 60 * 60 * 24));
					let url = 'http://www.sccin.com.cn/InvestmentInfo/ZhaoBiao/' + record.sourceId;

					return time <= 20 && srcWeb ? <a rel="noreferrer" title={record.noticeTitle} href={genelink(url, true)}
													 target="_blank" onClick={() => { this.handleRead(record) }}>{this.titleShort(record.noticeTitle)}</a> :
						<a rel="noreferrer" title={record.noticeTitle} href={genelink(record.sourceUrl, true)}
						   target="_blank" onClick={() => { this.handleRead(record) }}>{this.titleShort(record.noticeTitle)}</a>;



					// return <a title={record.noticeTitle} href={genelink(record.sourceUrl)} onClick={() => { this.handleRead(record) }} target="_blank" >{this.titleShort(record.noticeTitle)}</a>
				},
			},
			{
				title: "资质类别",
				key: "result-type",
				dataIndex: 'qualificationKeyWords',
				render: (val) => {
					return this.titleShort(val, 30)
				}
			},
			{
				title: "地区",
				dataIndex: 'locationName',
				key: "result-location",
				render: (val) => {
					return locationData[val]
				},
			},
			{
				title: "发布时间",
				key: "result-date",
				dataIndex: 'publishDate',
			}
		];
		const { options, perCertOptions } = this.props;
		const paginationProps = {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: (total, range) => `总共 ${total}条`,
			...this.state.pagination,
		};

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleRowSelectChange,
		};
		return (
			<div id="personCustCont">
				<div>
					<img src={customizedBanner01} />
				</div>
				<div class="navLink">
					<ul>
						<li className={this.state.tableState ? "" : 'active'} onClick={this.changeTableState.bind(this, false)}>招标通知</li>
						<li className={this.state.tableState ? "active" : ''} onClick={this.changeTableState.bind(this, true)}>中标通知</li>
					</ul>
				</div>

				<div id="InfoCustList">
					{/* <div className='chooseAll'>
						<span>全选</span>
						<Button type="primary" onClick={() => this.handleBatchDelete()} >删除所选</Button>
					</div> */}
					<Button type="primary" onClick={() => this.handleBatchDelete()} >删除所选</Button>

					<Table
						dataSource={this.state.list}
						rowKey={record => record.no}
						rowSelection={rowSelection}
						pagination={paginationProps}
						loading={this.state.loading}
						onRow={(record) => {
							return {
								onClick: () => { record.hasRead = true },       // 点击行
							};
						}}
						columns={tableState ? bidResultNoticeColumns : bidInviteNoticeColumns}
						onChange={this.handleCompositeTableChange}
					/>
					<Modal
						title="查看"
						visible={modalVisible}
						onCancel={this.handleCancel}
						footer={[
							<Button key="关闭" onClick={this.handleCancel}>关闭</Button>,
						]}
					>
						<InvoiceShow
							item={editItem}
						/>
					</Modal>
				</div>
			</div>
		)
	}
}
export default PersonCustomize;
