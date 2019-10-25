import React, { Component } from 'react';
import './person_member.css'
import { Button, Form, InputNumber, Cascader, Row, Col, Select, AutoComplete, Tag, message, Modal, Tooltip, DatePicker, TimePicker, } from 'antd';
import './person_cust.css';
import Utils from "../../utils/appUtils";
import request from '../../utils/request'
import moment from 'moment';
import emitter from "../../event";
import { stringify } from 'qs';


const { RangePicker } = DatePicker;

const FormItem = Form.Item;

class PersonCust extends Component {
	state = {
		mockData: [],
		targetKeys: [],
		userCus: {},
		id: 0,
		inviteVisible: false,
		resultVisible: false,
		inviteCheck: false,
		locations: [],
		inviteOptions: [],
		resultOptions: [],
		innerLocation: [],
		startDate: '',
		endDate: '',
		starDate: '',
		enDate: '',
		invitePermitTags: [],
		resultPermitTags: [],
		inviteLocationTag: "",
		resultLocationTag: "",
		bidResultStart: '',
		bidResultEnd: '',
		userLevel: '',
		bidResultEnteName: "",
		infoNameSource: "",
		projectNameSource: "",
		enteNameDataSource: [],
		inviteConditionList: [],
		resultConditionList: [],

		inviteCustomizedData: [],
		bidCustomizedData: [],

	}

	componentDidMount() {
		let level = Utils.getUserType();
		let isValid = Utils.isValid();
		this.setState({ userLevel: isValid ? level : 0 });
		this.fetchPermitType();
		this.fetchinnerLocation();
		// this.loadPersonCustom();
		this.newLoadPCInvite();
		this.newLoadPCBid();
	}

	handleStartDateOnChange = (value, date) => {
		if (!date) {
			this.setState({ startDate: '' });
		} else {
			let myDate = new Date();
			let curDate = moment(myDate).format('YYYY-MM-DD')
			this.setState({ startDate: date, endDate: "" });
		}

	}
	handleEndDateOnChange = (value, date) => {
		if (this.state.startDate == "") {
			let startTime = '';
			this.setState({ endDate: date, startDate: startTime });
		}
		this.setState({ endDate: date });
	}

	handleStarDateOnChange = (value, date) => {
		if (!date) {
			this.setState({ starDate: '' });
		} else {
			let myDate = new Date();
			let curDate = moment(myDate).format('YYYY-MM-DD')
			this.setState({ starDate: date, enDate: "" });
		}

	}
	handleEnDateOnChange = (value, date) => {
		if (this.state.starDate == "") {
			let startTime = '';
			this.setState({ enDate: date, starDate: startTime });
		}
		this.setState({ enDate: date });
	}

	newLoadPCInvite = () => {
		//查询招标订阅
		request("/api/customize/search?pushType=1" , {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			console.log('pc new data', res);
			if(res) {
				let inviteConditionList = [];
				for(let item of res) {
					inviteConditionList.push({
						id: item.id,
						location: item.location,
						label: item.conditions,
						startDate: item.startDate,
						endDate: item.endDate,
						infoname: item.tenderTitle
					})
				}
				this.setState({
					inviteCustomizedData: res,
					inviteConditionList
				});

			}
		});
	};


	newLoadPCBid = () => {
		//查询中标订阅
		request("/api/customize/search?pushType=2" , {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			console.log('pc new data', res);
			if(res) {
				let resultConditionList = [];
				for(let item of res) {
					resultConditionList.push({
						id: item.id,
						label: item.conditions,
						location: item.location,
						enteName: item.companyName,
						bidResultStart: item.startMoney,
						bidResultEnd: item.endMoney,
						starDate: item.startDate,
						enDate: item.endDate,
						projectName: item.projectName,
					})
				}
				this.setState({
					bidCustomizedData: res,
					resultConditionList
				})
			}
		});
	};

	loadPersonCustom = () => {
		//查询招标订阅
		request("/api/notice/prv/queryBidInvite", {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			if (res.status === 200 && res.data) {
				console.log(res.data)
				let inviteConditionList = [];
				if (res.data.length > 0) {
					for (let condList of res.data) {
						let labels = "";
						let values = "";
						if (condList && condList[0] && condList[0].length > 0) {
							for (let cond of condList[0]) {
								labels += labels != "" ? `,(${cond[1]})` : `(${cond[1]})`;
								values += values != "" ? `,(${cond[0]})` : `(${cond[0]})`;
							}
							console.log('pc labels', labels)
						}
						console.log('pc condList', condList)
						inviteConditionList.push({
							label: labels,
							value: values,
							location: condList[1],
							time: condList[3],
							infoname: condList[2]
						})
						// console.log(inviteConditionList.time)
					}
				}
				console.log('pc inviteConditionList',inviteConditionList);
				this.setState({ inviteConditionList });
			}
		})
		//查询中标订阅
		request("/api/notice/prv/queryBidResult", {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			if (res.status === 200 && res.data) {
				console.log(res.data)
				let resultConditionList = [];
				if (res.data.length > 0) {
					for (let condList of res.data) {
						console.log(condList)
						let labels = "";
						let values = "";
						if (condList && condList[0] && condList[0].length > 0) {
							for (let cond of condList[0]) {
								labels += labels != "" ? `,(${cond[1]})` : `(${cond[1]})`;
								values += values != "" ? `,(${cond[0]})` : `(${cond[0]})`;
							}
						}

						// let moneys = condList[3] ? condList[3].split("-") : null;
						let projectName = condList[3];
						let bidResultStart = condList[4];
						let bidResultEnd = condList[5];
						let time = condList[6];
						resultConditionList.push({
							label: labels,
							value: values,
							location: condList[1],
							enteName: condList[2],
							bidResultEnd: bidResultEnd,
							bidResultStart: bidResultStart,
							time: time,
							projectName: projectName
						})
					}
				}
				console.log(resultConditionList);
				this.setState({ resultConditionList })
			}
		})
	}

	fetchinnerLocation = () => {
		let REQUEST_URL = `/api/builder/builderLocation?isLocal=1`;
		request(REQUEST_URL, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, (data) => {
			this.setState({
				locations: data
			});
			// console.log(data)
		})
	}

	fetchPermitType = () => {
		//招标资质条件
		request("/api/builder/permitList", {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, (data) => {
			data.map(m => {
				m.children.map(ch => {
					if (ch.children) {
						ch.children.map(c => {
							delete c["permitItemId"]
							return c;
						})
					}
					delete ch["permitTypeId"];
					return ch;
				})
				return m;
			})
			data = data.filter(d => d.permitTypeId < 27);
			let jsonData = JSON.stringify(data).replace(/(permitTypeId|permitItemId|permitLevelId)/g, 'value').replace(/(permitItemName|permitTypeName|permitLevelName)/g, "label")
			jsonData = JSON.parse(jsonData)
			// jsonData = jsonData.filter(data => data.label !== "施工劳务");
			// console.log(jsonData)
			this.setState({
				inviteOptions: jsonData,
			});
		})
		//中标资质条件
		request("/api/builder/permit", {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			res = res.filter(d => d.permitTypeId < 27);
			let convertData = JSON.stringify(res).split('permitTypeId').join('value').split('permitTypeName').join('label');
			let jsonData = JSON.parse(convertData);
			// jsonData = jsonData.filter(data => data.label !== "施工劳务");
			jsonData.forEach(data => {
				// console.log(data)
				request(`/api/builder/permit/items/${data.value}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					}
				}, itemData => {
					let cvData = JSON.stringify(itemData).split('permitItemId').join('value').split('permitItemName').join('label');
					let jsonData1 = JSON.parse(cvData);
					data.children = jsonData1;
				})
			})
			this.setState({
				resultOptions: jsonData
			})
		})
	}

	handleInvitePermitChange = (val, selectedOptions) => {
		if (val.length === 0) {
			return;
		}
		console.log(selectedOptions)
		let { invitePermitTags } = this.state;
		const SelectedKeys = selectedOptions.map(o => o.value).join('/'); // 1/1/1
		const SelectedVals = selectedOptions.map(o => o.label).join('/'); // a/b/c
		const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
		let result = invitePermitTags.find(item => item.split(':')[0].startsWith(forSectedkey) == true); // 去除重复的项
		if (result != undefined) { // 同类型同项目有重复，不再添加
			invitePermitTags = invitePermitTags.filter(tag => tag !== result);
		}
		const text = `${SelectedKeys}:${SelectedVals}`;
		if (invitePermitTags.indexOf(text) === -1) {
			invitePermitTags = [...invitePermitTags, text];
			this.setState({
				invitePermitTags,
			}, () => {
				this.props.form.setFieldsValue({
					invitePermits: [],
				})
			});
		}
	}

	handleResultPermitChange = (val, selectedOptions) => {
		if (val.length === 0) {
			return;
		}
		let { resultPermitTags } = this.state;
		const SelectedKeys = selectedOptions.map(o => o.value).join('/'); // 1/1
		const SelectedVals = selectedOptions.map(o => o.label).join('/'); // a/b
		// const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
		let result = resultPermitTags.find(item => item.split(':')[0].startsWith(SelectedKeys) == true); // 去除重复的项
		if (result != undefined) { // 同类型同项目有重复，不再添加
			resultPermitTags = this.state.resultPermitTags.filter(tag => tag !== result);
		}
		const text = `${SelectedKeys}:${SelectedVals}`;
		if (resultPermitTags.indexOf(text) === -1) {
			resultPermitTags = [...resultPermitTags, text];
			this.setState({
				resultPermitTags,
			}, () => {
				this.props.form.setFieldsValue({
					resultPermits: [],
				})
			});
		}
	}

	handleInvitePermitClose = (removedTag) => {
		const invitePermitTags = this.state.invitePermitTags.filter(tag => tag !== removedTag);
		this.setState({ invitePermitTags });
	}

	handleResultPermitClose = (removedTag) => {
		const resultPermitTags = this.state.resultPermitTags.filter(tag => tag !== removedTag);
		this.setState({ resultPermitTags });
	}

	inviteLocationChange = (val, selectedOptions) => {
		if (!val) {
			return;
		}
		let label = selectedOptions.props.children;
		// console.log(label)
		this.setState({
			inviteLocationTag: val + ":" + label,
		});
	}

	handleInfonameChange = (value) => {
		if (!value) {
			return;
		}
		let infoname = value.target.value;
		this.setState({ infoNameSource: infoname })
	}

	handleProjectNameChange = (value) => {
		if (!value) {
			return;
		}
		let projectName = value.target.value;
		this.setState({ projectNameSource: projectName })
	}
	resultLocationChange = (val, selectedOptions) => {
		if (!val) {
			return;
		}
		let label = selectedOptions.props.children;
		this.setState({
			resultLocationTag: val + ":" + label,
		});
	}

	handleInviteOk = (e) => {
		e.preventDefault();

		let { invitePermitTags, inviteLocationTag, inviteConditionList, testdata, infoNameSource, startDate, endDate } = this.state;
		if (invitePermitTags.length === 0 ) {
            message.info('资质条件是必选的哦', 1);
			return;
		}
		if(startDate=='') {
		    message.info('开始日期是必选的哦', 1);
            return;
        }
		let label = "";
		let str = "";
		let add = true;
		let newArr = [];
		if (invitePermitTags && invitePermitTags.length > 0) {
			for (let tag of invitePermitTags) {
				let t = tag.split(":")
				// value += `(${t[0]})`;
				label += `(${t[1]})`;

				let tagArr = t[1].split("/");
				// console.log('OK1', tagArr)
				if (tagArr.length === 2 && tagArr[1].indexOf('级')>=0) {
					newArr.push(tagArr[0].concat(tagArr[1]))
				}else {
					newArr.push(tagArr[1].concat(tagArr[0]).concat(tagArr.length === 2 ? '' : tagArr[2]))
				}
				// console.log('EDG3', newArr);


			}

			// console.log('OK2', newArr);
			str = newArr.join(',');

		}
		if (inviteConditionList.length > 0) {

			for (let cond of inviteConditionList) {
				if (cond.location == inviteLocationTag) {
					// 新的资质选择已经在原有的资质里面包含
					if (cond.label.indexOf(str) >= 0) {
						add = false;
						message.info('资质条件已存在哦', 1);
						//什么都不做...
					} else if (str.indexOf(cond.label) >= 0) {
						// 新的资质条件比之前的多，以多的为准
						// cond.label = label;
						add = true;
						//删除之前的资质条件
						this.deleteCustomizedItem(cond.id, false);

					}
				}
			}
			if (add) {
				//走保存
				inviteConditionList.push({
					location: inviteLocationTag,
					label: label,
					// value: value,
					startDate: startDate,
					endDate: endDate,
					// time: `${startDate} + "-"` + endDate,
					// time: startDate + "-" + endDate,
					infoname: infoNameSource
				})

				this.setState({
					inviteConditionList: inviteConditionList,
				}, () => {
					this.searchCustomMade(inviteConditionList);
				})
			}
		} else {
			//走保存
			inviteConditionList.push({
				location: inviteLocationTag,
				label: label,
				// value: value,
				startDate: startDate,
				endDate: endDate,
				// time: startDate + "-" + endDate,
				// time: `${startDate} + "-"` + endDate,
				infoname: infoNameSource
			})

			this.setState({
				inviteConditionList: inviteConditionList,
			}, () => {
				this.searchCustomMade(inviteConditionList);
			})

		}


		console.log(inviteConditionList)
		this.setState({
			// inviteConditionList: inviteConditionList,
			invitePermitTags: [],
			inviteLocationTag: "",
			inviteVisible: false,
			resultVisible: false,
		}, () => {
			this.props.form.resetFields("inviteLocation", "startDate", "endDate");

			// 保存定制招标公告
			// this.searchCustomMade(inviteConditionList);
		});
		// console.log(inviteConditionList)

		this.props.form.setFieldsValue({
			startDate: '',
			endDate: '',
			infoName: ''
		})

	}

	handleCancel = (e) => {
		this.setState({
			inviteVisible: false,
            invitePermitTags: [],
            inviteLocationTag: "",

            resultPermitTags: [],
            resultLocationTag: "",
			resultVisible: false,
		})
        this.props.form.resetFields("inviteLocation", "startDate", "endDate");
        this.props.form.resetFields(["bidResultStart", "bidResultEnd", "bidEnteName", "resultLocations"]);
        this.props.form.setFieldsValue({
            startDate: '',
            endDate: '',
            infoname: '',

            starDate: '',
            enDate: '',
            projectName: ''
        })
	}

	handleResultOk = (e) => {
		e.preventDefault();

		let { bidResultStart, bidResultEnd, bidEnteName } = this.props.form.getFieldsValue();
		let { resultPermitTags, resultLocationTag, resultConditionList, projectNameSource, starDate, enDate, time } = this.state;
		if (!bidResultStart && !bidEnteName && resultPermitTags.length == 0 && !resultLocationTag) {
			this.handleCancel();
			return;
		}
        if(resultPermitTags.length === 0) {
            message.info('资质条件是必选的哦',1);
            return;
        }
		if(starDate=='') {
		    message.info('开始日期是必选的哦', 1);
            return;
        }
		let label = "";
		let str = "";
		let add = true;
		let newArr = [];
		if (resultPermitTags && resultPermitTags.length > 0) {
			for (let tag of resultPermitTags) {
				let t = tag.split(":")
				// value += `(${t[0]})`;
				label += `(${t[1]})`;
				let tagArr = t[1].split("/");
				// console.log('OK1', tagArr)
				if (tagArr.length === 2 && tagArr[1].indexOf('级')>=0) {
					newArr.push(tagArr[0].concat(tagArr[1]))
				}else {
					newArr.push(tagArr[1].concat(tagArr[0]).concat(tagArr.length === 2 ? '' : tagArr[2]))
				}
			}
			str = newArr.join(',')
		}
		if (resultConditionList.length > 0) {
			for (let cond of resultConditionList) {
				if (cond.location == resultLocationTag) {
					// 新的资质选择已经在原有的资质里面包含
					if (cond.label.indexOf(str) >= 0 && bidEnteName == cond.enteName) {
						add = false;
						message.info('资质条件已存在哦', 1);
						//什么都不做...
					} else if (str.indexOf(cond.label) >= 0 && bidEnteName == cond.enteName) {
						// 新的资质条件比之前的多，以多的为准
						// cond.label = label;
						add = true;
						//删除之前的资质条件
						this.deleteCustomizedItem(cond.id, false);

					}
				}
			}
			if (add) {
				resultConditionList.push({
					location: resultLocationTag,
					label: label,
					// value: value,
					bidResultEnd: bidResultEnd,
					bidResultStart: bidResultStart,
					enteName: bidEnteName,
					projectName: projectNameSource,
					starDate: starDate,
					enDate: enDate,
					// time: starDate + "-" + enDate
				})

				this.setState({
					resultConditionList: resultConditionList
				}, () => {
					this.searchResultCustomMade(resultConditionList);
				})
			}
		} else {
			resultConditionList.push({
				location: resultLocationTag,
				label: label,
				// value: value,
				bidResultEnd: bidResultEnd,
				bidResultStart: bidResultStart,
				enteName: bidEnteName,
				projectName: projectNameSource,
				starDate: starDate,
				enDate: enDate,
				// time: starDate + "-" + enDate
			})

			this.setState({
				resultConditionList: resultConditionList
			}, () => {
				this.searchResultCustomMade(resultConditionList);
			})
		}
		this.setState({
			// resultConditionList: resultConditionList,
			resultPermitTags: [],
			resultLocationTag: "",
			inviteVisible: false,
			resultVisible: false,
		}, () => {
			this.props.form.resetFields(["bidResultStart", "bidResultEnd", "bidEnteName", "resultLocations"]);
			// this.saveResultCondition(resultConditionList);
		})

		this.props.form.setFieldsValue({
			starDate: '',
			enDate: '',
			projectName: ''
		})
	}

	handleSearch = (value) => {
		if (!value) {
			this.setState({ enteNameDataSource: [] })
			return;
		}
		request("/api/builder/names/" + value, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}, res => {
			if (res && res.length > 0) {
				let dataSource = res.map(d => {
					return d["builderName"];
				})
				this.setState({ enteNameDataSource: dataSource });
			}
		})
	}

	fetchInviteCondition = () => {

	}

	saveInviteCondition = (inviteConditionList) => {
		let configList = [];
		for (let cond of inviteConditionList) {
			let condList = [];
			let inviteList = [];
			let labels = cond.label.split(")").filter(item => item.startsWith("("));
			let vals = cond.value.split(")").filter(item => item.startsWith("("));
			console.log(cond.startDate)
			for (let i = 0, l = vals.length; i < l; i++) {
				let arr = [];
				arr.push(vals[i].slice(1))
				arr.push(labels[i].slice(1))
				condList.push(arr);
			}
			inviteList.push(condList);
			inviteList.push(cond.location || "");
			inviteList.push(cond.infoname);
			inviteList.push(cond.time);
			console.log(inviteList)
			configList.push(inviteList);
			// configList: [
			// 		inviteList: [
			// 			condList:[
			// 				[ values:"1/1/2", labels:"施工总承包,水利水电工程,三级"],
			// 				[ values:"1/1/2", labels:"施工总承包,水利水电工程,三级"]
			// 			],
			// 			location: ''
			// 		],
			// 		inviteList: [
			// 			condList:[
			// 				...
			// 			],
			// 			location: ''
			// 		]
			// 	]
		}
		let values = {
			bid_type: 1,
			config: configList,
		}
		console.log(values)
		request(`/api/notice/prv/updateBidInvite`, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values)
		}, res => {
			if (res.status === 200) {
				message.success('保存招标定制成功！', 1);
				this.setState({ startDate: '', endDate: '' });
			} else {
				message.error("保存招标定制消息失败！", 1);
			}
		})
	}

	searchCustomMade = () => {
		const inviteConditionList = this.state.inviteConditionList;


		console.log('QWE', inviteConditionList);


		const customMadeVO = [];
		inviteConditionList && inviteConditionList.forEach((item, index) => {
		    if(index !== inviteConditionList.length-1) {
		        return;
            }
			let searchCustomData = {};
			// const labelValue = item.label;
			let labelStr = item.label.replace(/\(|,/gi, '');
			labelStr = labelStr.replace(/\)/gi, ',');

			labelStr = labelStr.substring(0, labelStr.length-1);
			console.log('EDG1', labelStr);

			// const labelValueArr = labelValue.split(")(");
			const labelValueArr = labelStr.split(",");
			let labelVal = [];
			let labelValArr = [];
			let qualificationKeyWords = '';
			for (let i = 0; i < labelValueArr.length; i++) {
				labelVal = labelValueArr[i].split("/");
				console.log('EDG2', labelVal)
				if (labelVal.length === 2 && labelVal[1].indexOf('级')>=0) {
					labelValArr.push(labelVal[0].concat(labelVal[1]))
				}else {
					labelValArr.push(labelVal[1].concat(labelVal[0]).concat(labelVal.length === 2 ? '' : labelVal[2]))
				}
				console.log('EDG3', labelValArr);

				qualificationKeyWords = labelValArr.join(",");
				console.log('QWE', qualificationKeyWords);
				searchCustomData = {
					qualificationKeyWords,
					tenderTitle: item.infoname,
					location: item.location,
					startDate: item.startDate,
					endDate: item.endDate,
				};
			}

			customMadeVO.push(searchCustomData);

		});

		//保存定制招标公告
		request("/api/searchByCustomMade", {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ customMadeVO }),
		}, res => {
			if (res.status === 200) {
				console.log(res.data)
				message.success('保存招标定制成功！', 1);
				this.newLoadPCInvite();
				// this.getNoticeCount();
				emitter.emit("getNoticeCount");
			} else {
				message.error("保存招标定制消息失败！", 1);
			}
		})
	}

	saveResultCondition = (resultConditionList) => {
		let configList = [];
		for (let cond of resultConditionList) {
			console.log(cond)
			let condList = [];
			let resultList = [];
			let labels = cond.label.split(")").filter(item => item.startsWith("("));
			let values = cond.value.split(")").filter(item => item.startsWith("("));
			console.log(cond.startT)
			for (let i = 0, l = values.length; i < l; i++) {
				let arr = [];
				arr.push(values[i].slice(1));
				arr.push(labels[i].slice(1));
				condList.push(arr);
			}
			if (cond.bidResultEnd == undefined) {
				cond.bidResultEnd = '';
			}
			resultList.push(condList);
			resultList.push(cond.location || "");
			resultList.push(cond.enteName || "");
			resultList.push(cond.projectName || "");
			resultList.push(cond.bidResultStart);
			resultList.push(cond.bidResultEnd);
			// resultList.push(cond.bidResultEnd && cond.bidResultStart ? `${cond.bidResultStart}-${cond.bidResultEnd}` : "");
			resultList.push(cond.time);
			configList.push(resultList);
			// configList: [
			// 		inviteList: [
			// 			condList:[
			// 				[ values:"1/1/2", labels:"施工总承包,水利水电工程,三级"],
			// 				[ values:"1/1/2", labels:"施工总承包,水利水电工程,三级"]
			// 			],
			// 			location: '',
			// 			enteName: '',
			// 			money: '1-1',
			// 		],
			// 		inviteList: [
			// 			condList:[
			// 				...
			// 			],
			// 			location: ''
			// 		]
			// 	]
		}
		let values = {
			bid_type: 2,
			config: configList,
		}
		console.log(values)
		request(`/api/notice/prv/updateBidResult`, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values)
		}, res => {
			if (res.status === 200) {
				message.success('保存招标定制成功！', 1);
			} else {
				message.error("保存招标定制消息失败！", 1);
			}
		})
	}

	searchResultCustomMade = () => {
		const resultConditionList = this.state.resultConditionList;
		const customMadeVO = [];

		resultConditionList && resultConditionList.forEach((item, index) => {
		    if(index!==resultConditionList.length-1) {
		        return;
            }
			let searchResultCustomData = {};
			let labelStr = item.label.replace(/\(|,/gi, '');
			labelStr = labelStr.replace(/\)/gi, ',');

			labelStr = labelStr.substring(0, labelStr.length-1);
			console.log('WEQ1', labelStr);

			const labelValueArr = labelStr.split(",");
			let labelVal = [];
			let labelValArr = [];
			let qualificationKeyWords = '';
			for (let i = 0; i < labelValueArr.length; i++) {
				labelVal = labelValueArr[i].split("/");
				console.log('WEQ2', labelVal);
				if(labelVal[1].indexOf('级')>=0) {
					labelValArr.push(labelVal[0].concat(labelVal[1]))
				}else {
					labelValArr.push(labelVal[1].concat(labelVal[0]))
				}
				console.log('WEQ3', labelValArr);
				qualificationKeyWords = labelValArr.join(",");
				console.log('WEQ4', qualificationKeyWords);
				// const as = str.replace(/\(|\)|\//gi, '');
				// qualificationKeyWords = labelValueArr.join(",").replace(/\/|\(|\) /gi, '');
				searchResultCustomData = {
					qualificationKeyWords,
					projectName: item.projectName,
					location: item.location,
					startDate: item.starDate,
					endDate: item.enDate,
					companyName: item.enteName,
					startMoney: item.bidResultStart * 10000,
					endMoney: item.bidResultEnd * 10000
				};
			}
			customMadeVO.push(searchResultCustomData);

		});

		//查询中标公告
		request("/api/searchBidResultCustomMade", {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ customMadeVO }),
		}, res => {
			if (res.status === 200) {
				message.success('保存中标定制成功！', 1);
				this.newLoadPCBid();
				// this.getNoticeCount();
				emitter.emit("getNoticeCount");
			} else {
				message.error("保存中标定制消息失败！", 1);
			}
		})
	}

	handleInviteConditionClose = (index, cond) => {
		let { inviteConditionList } = this.state;
		inviteConditionList = inviteConditionList.filter((item, i) => i !== index);
		this.setState({ inviteConditionList }, () => {
			this.saveInviteCondition(this.state.inviteConditionList)
		});
	}

	handleResultConditionClose = (index) => {
		let { resultConditionList } = this.state;
		resultConditionList = resultConditionList.filter((item, i) => i !== index);
		this.setState({ resultConditionList }, () => {
			this.saveResultCondition(this.state.resultConditionList);
		})
	}

	deleteCustomizedItem = (id, isTask) => {
		const {inviteConditionList, resultConditionList, bidCustomizedData, inviteCustomizedData} = this.state;
		request(`/api/customize/deleteCondition/${id}`, {
			method: 'delete',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		}, res => {
			if(res) message.success('删除成功！', 1);
			inviteConditionList.forEach((item, index) => {
				if(item.id === id) {
					inviteConditionList.splice(index, 1)
				}
			});
			inviteCustomizedData.forEach((item, index) => {
				if(item.id === id) {
					inviteCustomizedData.splice(index, 1)
				}
			});
			resultConditionList.forEach((item, index) => {
				if(item.id === id) {
					resultConditionList.splice(index, 1)
				}
			});
			bidCustomizedData.forEach((item, index) => {
				if(item.id === id) {
					bidCustomizedData.splice(index, 1)
				}
			});
			console.log('pc delete..', resultConditionList);
			this.setState({
				inviteConditionList: [...inviteConditionList],
				resultConditionList: [...resultConditionList],
				inviteCustomizedData,
				bidCustomizedData
			})

		});
		if(isTask) {
		    request(`/api/customize/deleteTaskId`, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }, res => {

            });
        }
	}

    formatMoney = (num, num2 = 10000) => {
        if (/^[0-9.]*$/.test(num)) {
            if (!num || num < 0) {
                return '0万元';
            }
            return (parseInt(num) / num2) + "万元";
        } else {
            return num;
        }
    }

	// disabledDate = (date) => {
	// 	// 1514736000000 2018-01-01
	// 	return date && (date.valueOf() < 1514736000000 || date.valueOf() > new Date().getTime());
	// }

	render() {
		const { getFieldDecorator } = this.props.form;
		const { invitePermitTags, resultPermitTags, inviteConditionList, resultConditionList, userLevel, enteNameDataSource,
			infoNameSource, projectNameSource, startDate, endDate, starDate, enDate, inviteCustomizedData, bidCustomizedData } = this.state;
		console.log('render pc: ', bidCustomizedData);
		let dateFormat = 'YYYY-MM-DD';
		return (
			<div className="ddgo_personCust">
				<div className="chooseBox" style={{ display: userLevel >= 1 ? "" : "none" }}>
					<h3>招标信息定制栏</h3>
					<div className="personCustChoose">
						当招标信息中含有以下条件时，通知我
					</div>
					<div className='ddgo_custCont'>
						<div>
							<Button type="primary" onClick={() => { this.setState({ inviteVisible: true, startDate: '', endDate: '' }) }}>选择招标定制条件</Button>
						</div>
						<div className="ddgo_moreChoose">
							<p>已定制内容:</p>
							<div className='searchClassItem'>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
									<span>
										{/*{inviteConditionList.map((cond, i) => {*/}
										{/*	console.log(inviteConditionList)*/}
										{/*	let permit = cond.label ? cond.label : "";*/}
										{/*	let isLong = permit.length > 40;*/}
										{/*	let location = cond.location ? "，" + cond.location.split(":")[1] : "";*/}
										{/*	let infoname = cond.infoname ? "，" + cond.infoname : "";*/}
										{/*	// let startTime = cond.startDate ? "，" + cond.startDate + "~" : "";*/}
										{/*	// let endTime = cond.endDate ? "" + cond.endDate : "";*/}
										{/*	let time = cond.time ? "，" + cond.time : "";*/}
										{/*	let text = isLong ? `${permit.slice(0, 40)}...` + location + infoname + time : permit + location + infoname + time;*/}
										{/*	if (text.startsWith("，")) {*/}
										{/*		text = text.slice(1);*/}
										{/*	}*/}
										{/*	const tagElem = (*/}
										{/*		<Tag key={text} closable afterClose={() => this.handleInviteConditionClose(i, cond)}> {text} </Tag>*/}
										{/*	);*/}
										{/*	return <p>{isLong ? <Tooltip title={isLong ? permit + location : text} key={text}>{tagElem}</Tooltip> : tagElem}</p>;*/}
										{/*})}*/}

										{
											inviteCustomizedData.map((item, index) => {
												let permit = item.conditions;
												let isLong = permit.length > 40;
												let location = item.location ? "，" + item.location.split(":")[1] : "";
												let tenderTitle = item.tenderTitle ? "，" + item.tenderTitle : "";
												let time = item.endDate ? "，从" + item.startDate + "至" + item.endDate : "，从" + item.startDate + "至今";
												let text = isLong ? `${permit.slice(0, 40)}...` + location + tenderTitle + time : permit + location + tenderTitle + time;
												const tagElem = (<Tag key={text} closable afterClose={() => this.deleteCustomizedItem(item.id, true)}> {text} </Tag>);
												return <p>{isLong ? <Tooltip title={permit + location + tenderTitle + time} key={text}>{tagElem}</Tooltip> : tagElem}</p>
											})
										}
									</span>
								</Col>
							</div>
						</div>
					</div>
				</div>
				<div className="chooseBox" style={{ display: userLevel >= 1 ? "" : "none" }}>
					<h3>中标信息定制栏</h3>
					<div className="personCustChoose">
						当中标信息中含有以下条件时，通知我
					</div>
					<div className='ddgo_custCont'>
						<div>
							<Button type="primary" onClick={() => { this.setState({ resultVisible: true, starDate: '', enDate: '' }) }}>选择中标定制条件</Button>
						</div>
						<div className="ddgo_moreChoose">
							<p>已定制内容:</p>
							<div className='searchClassItem'>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
									<span>
										{/*{resultConditionList.map((cond, i) => {*/}
										{/*	let permit = cond.label ? cond.label : "";*/}
										{/*	let location = cond.location ? "，" + cond.location.split(":")[1] : "";*/}
										{/*	let projectName = cond.projectName ? "，" + cond.projectName : "";*/}
										{/*	// let startTime = cond.startDate ? "，" + cond.startDate + "~" : "";*/}
										{/*	// let endTime = cond.endDate ? "" + cond.endDate : "";*/}
										{/*	let time = cond.time ? "," + cond.time : "";*/}
										{/*	// let moneys = cond.bidResultStart && cond.bidResultEnd ? `，(${cond.bidResultStart}-${cond.bidResultEnd})` : "";*/}
										{/*	let bidResultStart = cond.bidResultStart ? "," + cond.bidResultStart : "";*/}
										{/*	let bidResultEnd = cond.bidResultEnd ? "-" + cond.bidResultEnd : "";*/}
										{/*	let enteName = cond.enteName ? "，" + cond.enteName : "";*/}
										{/*	let isLong = permit.length > 20;*/}
										{/*	let text = isLong ? `${permit.slice(0, 20)}...` + location + bidResultStart + bidResultEnd + enteName + projectName + time : permit + location + bidResultStart + bidResultEnd + enteName + projectName + time;*/}
										{/*	if (text.startsWith("，")) {*/}
										{/*		text = text.slice(1);*/}
										{/*	}*/}
										{/*	const tagElem = (*/}
										{/*		<Tag key={text} closable afterClose={() => this.handleResultConditionClose(i)}> {text} </Tag>*/}
										{/*	);*/}
										{/*	return <div className='textshow'>{isLong ? <Tooltip title={isLong ? permit + location + bidResultStart + bidResultEnd + enteName + projectName : text} key={text}>{tagElem}</Tooltip> : tagElem}</div>;*/}
										{/*})}*/}

										{
											bidCustomizedData.map(item => {
												let permit = item.conditions;
												let location = item.location ? "，" + item.location.split(":")[1] : "";
												let projectName = item.projectName ? "，" + item.projectName : "";
												let time = item.endDate ? "，从" + item.startDate + "至" + item.endDate : "，从" + item.startDate + "至今";
												let companyName = item.companyName ? "，" + item.companyName : "";
												let money = item.endMoney ? item.startMoney ? `，${item.startMoney/10000}~${item.endMoney/10000}万元` : `，${item.endMoney/10000}万元以内` :
													item.startMoney ? `，${item.startMoney/10000}万元以上` : '';
												let isLong = permit.length > 20;
												let text = isLong ? `${permit.slice(0, 20)}...` + location + money + companyName + projectName + time :
													permit + location + money + companyName + projectName + time;
												const tagElem = (
													<Tag key={text} closable afterClose={() => this.deleteCustomizedItem(item.id, true)}> {text} </Tag>
												);
												return <div className='textshow'>{isLong ? <Tooltip title={permit + location + money + companyName + projectName + time} key={text}>{tagElem}</Tooltip> : tagElem}</div>;
											})
										}
									</span>
								</Col>
							</div>
						</div>
					</div>
				</div>
				<div style={{ display: userLevel >= 1 ? "none" : "" }}>
					<p>请升级为会员！</p>
				</div>
				<Modal
					visible={this.state.inviteVisible}
					title="招标信息定制栏"
					onCancel={this.handleCancel}
					onOk={this.handleInviteOk}
					wrapClassName={"ddgo_TenderingCustomized_modal"}
					style={{ "textAlign": "center" }}
				>
					<Form onSubmit={this.InviteSubmit}>
						<Row>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="招标资质条件(多选)">
									{getFieldDecorator('invitePermits')(
										<Cascader
											options={this.state.inviteOptions}
											onChange={this.handleInvitePermitChange}
											allowClear={true}
											placeholder="请选择" />
									)}
								</FormItem>
							</Col>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="地区条件(单项)">
									{getFieldDecorator('inviteLocation')(
										<Select placeholder="请选择" onChange={this.inviteLocationChange} allowClear={true}>
											{this.state.locations.map((location, key) =>
												<Select.Option key={location.localId} value={location.localId}>{location.localName}</Select.Option>
											)}
										</Select>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="信息名称">
									<div className='infoname'>
										{getFieldDecorator('infoName')(
											<input type="text" onChange={this.handleInfonameChange} placeholder="请输入信息名称" />
										)}
									</div>
								</FormItem>
							</Col>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="请选择时间">
									<div className='ddgo_callForBidsTime'>
										{getFieldDecorator('startDate')(
											<DatePicker
												format={dateFormat}
												placeholder="开始日期"
												onChange={this.handleStartDateOnChange} />
										)}
										<span style={{ lineHeight: "32px", float: "left" }}>&nbsp;-&nbsp;</span>
										{getFieldDecorator('endDate')(
											<DatePicker
												placeholder="截止日期"
												format={dateFormat}
												onChange={this.handleEndDateOnChange} />
										)}
									</div>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
								<div className="ddgo_SelectedQualifications_box" style={{ "textAlign": "left" }}>
									<p>已选资质:</p>
									<div className='ddgo_SelectedQualifications_more'>
										<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
											<span>
												{invitePermitTags.map((tag) => {
													const displayTag = tag.split(':')[1];
													const tagElem = (
														<Tag key={tag} closable afterClose={() => this.handleInvitePermitClose(tag)}>{displayTag}</Tag>
													);
													return tagElem;
												})}
											</span>
										</Col>
									</div>
								</div>
							</Col>
						</Row>

					</Form>
				</Modal>
				<Modal
					visible={this.state.resultVisible}
					title="中标信息定制栏"
					onCancel={this.handleCancel}
					onOk={this.handleResultOk}
					wrapClassName={"ddgo_WinningBidCustomized_modal"}
					style={{ "textAlign": "center" }}
				>
					<Form onSubmit={this.ResultSubmit}>
						<Row>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="中标资质条件(多选)">
									{getFieldDecorator('resultPermits')(
										<Cascader
											options={this.state.resultOptions}
											onChange={this.handleResultPermitChange}
											allowClear={true}
											placeholder="请选择资质条件" />
									)}
								</FormItem>
							</Col>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="地区条件(单项)">
									{getFieldDecorator('resultLocations')(
										<Select placeholder="请选择地区条件" onChange={this.resultLocationChange} allowClear={true}>
											{this.state.locations.map((location, key) =>
												<Select.Option key={location.localId} value={location.localId}>{location.localName}</Select.Option>
											)}
										</Select>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="金额(万元)">
									<div className='ddgo_winBidCust'>
										{getFieldDecorator('bidResultStart')(
											<InputNumber min={1} step={1} placeholder="请输入" />
										)}
										<span style={{ padding: "0 5px" }}>-</span>
										{getFieldDecorator('bidResultEnd')(
											<InputNumber min={1} step={1} placeholder="请输入" />
										)}
									</div>
								</FormItem>
							</Col>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="中标企业(单项)">
									<div className='ddgo_winBidCust'>
										{getFieldDecorator('bidEnteName')(
											<AutoComplete
												dataSource={enteNameDataSource}
												onSearch={this.handleSearch}
												placeholder="请输入中标通知企业" />
										)}
									</div>
								</FormItem>
							</Col>

						</Row>
						<Row>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="项目名称">
									<div className='infoname'>
										{getFieldDecorator('projectName')(
											<input type="text" onChange={this.handleProjectNameChange} placeholder="请输入项目名称" />
										)}
									</div>
								</FormItem>
							</Col>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }}>
								<FormItem label="请选择时间">
									<div className='ddgo_callForBidsTime'>
										{getFieldDecorator('starDate')(
											<DatePicker
												format={dateFormat}
												placeholder="开始日期"
												onChange={this.handleStarDateOnChange} />
										)}
										<span style={{ lineHeight: "32px", float: "left" }}>&nbsp;-&nbsp;</span>
										{getFieldDecorator('enDate')(
											<DatePicker
												placeholder="截止日期"
												format={dateFormat}
												onChange={this.handleEnDateOnChange} />
										)}
									</div>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
								<div className="ddgo_SelectedQualifications_box" style={{ "textAlign": "left" }}>
									<p>已选择资质:</p>
									<div className='ddgo_SelectedQualifications_more'>
										<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
											<span>
												{resultPermitTags.map((tag) => {
													const displayTag = tag.split(':')[1];
													const tagElem = (
														<Tag key={tag} closable afterClose={() => this.handleResultPermitClose(tag)}>{displayTag}</Tag>
													);
													return tagElem;
												})}
											</span>
										</Col>
									</div>
								</div>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		)
	}
}
PersonCust = Form.create({})(PersonCust)
export default PersonCust;
