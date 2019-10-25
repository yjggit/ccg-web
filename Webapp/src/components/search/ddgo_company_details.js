import React, { Component } from 'react';
import { Tabs, Form, Row, Col, Select, Input, Table, Button, message, DatePicker, InputNumber, Modal, Tooltip, Pagination, Checkbox, Tag, List, Icon } from 'antd';
import request from '../../utils/request'
import { stringify } from 'qs';
import genelink from '../../utils/linkutil'
import { NavLink } from 'react-router-dom';
import './ddgo_company_details.css';
import Utils from "../../utils/appUtils";
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import moment from 'moment';
import emitter from "../../event";



const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const projectTypeDict = {
    "房建": 0,
    "市政": 1,
    "公路": 2,
    "水利": 3,
    "勘察": 4,
    "设计": 5,
    "监理": 6,
    "采购": 7,
    "其他": 9,
    "招标代理": 10,
    "咨询": 11,
    "造价": 12,
    "PPP": 13,
    "EPC": 14,

}
class DdgoCompanyDetail extends Component {

    state = {
        builderId: '',
        baseData: [],
        certData: [],
        personName: '',
        personCert: '',
        creditData: {
            creditList: [],
        },
        zxgkCourtData: {
            creditList: [],
        },
        creditChinaData: {},
        personData: {
            list: [],
            pagination: {},
        },
        achieveData: {
            list: [],
            pagination: {},
        },
        goodsData: {
            list: [],
            pagination: {},
        },
        goodsLoading: false,
        badsData: {
            list: [],
            pagination: {},
        },
        badsLoading: false,
        personTypeId: "",
        certCountData: [],
        projectStatusCountData: [],
        projectTypeCountData: [],
        personLoading: false,
        achieveLoading: false,
        formValues: {},
        projectStatus: [],
        performCategory: [],
        projectName: '',
        projectLeader: '',
        projectType: '',
        projectStart: '',
        projectEnd: '',
        startPrice: '',
        endPrice: '',
        roadSichuanCredit: [],
        auditCredit: [],
        xmchengduCredit: [],
        waterCredit: [],
        roadCredit: [],
        captchaValue: '',
        visible: false,
        url: '',
        userLevel: 1,
        growUpVisiable: false,
        detailVisiable: false,
        goodsDetail: "",    //良好行为详细信息
        moreClicked: false,
        creditId: 0,
        checkedValues: [],
        isMoreCerts: false,
    }
    componentDidMount() {
        let level = Utils.getUserType();
        let isValid = Utils.isValid();
        level = isValid ? level : 0;
        this.setState({ userLevel: level });
        this.eventEmitter = emitter.addListener("updateUserLevel", (level) => {
            this.setState({
                userLevel: level
            });
        });
        const builderId = this.props.match.params.id;
        console.log(builderId)
        this.fetchBaseData(builderId);
        this.fetchCertData(builderId);
        this.fetchCountCertData(builderId);
        this.fetchPersonData({ builderId: builderId });
        //钻石用户可看业绩
        if (level == 2) {
            // this.fetchPerformCategory();
            this.fetchAchieveData({ builderId: builderId, projectStatus: '0,1,2' });
            // this.fetchCountProjectStatusData(builderId);
            this.fetchCountProjectTypeData(builderId);
        }
        //vip用户 信用信息、良好行为、不良行为
        if (level >= 1) {
            this.fetchCreditData(builderId);
            this.fetchBuilderGoodsBehavior({ builderId });
            this.fetchBuilderBadsBehavior({ builderId });
            this.fetchCreditChinaData({ builderId: builderId });
            this.fetchZXGKCourtData({ builderId: builderId, pageSize: 100, currentPage: 1 });
            this.fetchRoadCreditInfo(builderId);
            this.fetchWaterCreditInfo(builderId);
            this.fetchXmchengduCreditInfo(builderId);
            this.fetchAuditCreditInfo(builderId);
            this.fetchRoadSichaunCreditInfo(builderId);
        }
    }

    fetchCountProjectTypeData = (builderId) => {
        request(`/api/project/count/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            // console.log('项目类型：', data);
            if (data && data.length > 0) {
                let { projectTypeCountData } = this.state;
                data.forEach(d => {
                    if (projectTypeDict[d.projectTypeName] != null || projectTypeDict[d.projectTypeName] != undefined) {
                        projectTypeCountData.push(d);
                    }
                });
                this.setState({ projectTypeCountData });
            }
        })
    }

    fetchRoadCreditInfo = (builderId) => {
        request(`/api/credit/road/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({ roadCredit: data })
        })
    }
    fetchWaterCreditInfo = (builderId) => {
        request(`/api/credit/water/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({ waterCredit: data })
        })
    }
    fetchXmchengduCreditInfo = (builderId) => {
        request(`/api/credit/xmchengdu/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({ xmchengduCredit: data })
        })
    }
    fetchAuditCreditInfo = (builderId) => {
        request(`/api/credit/audit/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({ auditCredit: data })
        })
    }
    fetchRoadSichaunCreditInfo = (builderId) => {
        request(`/api/credit/roadSichaun/${builderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            this.setState({ roadSichuanCredit: data })
        })
    }
    fetchPerformCategory = () => {
        let REQUEST_URL = `/api/perform/category`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            data = [{ projectTypeId: -1, projectTypeName: '不限' }].concat(data);
            this.setState({
                performCategory: data,
            });
        })
    }

    fetchZXGKCourtData = (param) => {
        request(`/api/credit/zxgkCourt?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let { zxgkCourtData } = this.state;
            zxgkCourtData.creditList = data.list;
            this.setState({
                zxgkCourtData: zxgkCourtData,
            })
        })
    }

    fetchCreditChinaData = (param) => {
        request(`/api/credit/creditChinaDetails?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            console.log('fetchCreditChinaData', data)
            data.administrativeLicensing = JSON.parse(data.administrativeLicensing)
            data.administrativeSanction = JSON.parse(data.administrativeSanction)
            data.redList = JSON.parse(data.redList)
            data.carefulList = JSON.parse(data.carefulList)
            data.blackList = JSON.parse(data.blackList)

            console.log('fetchCreditChinaData JOSN', data)
            this.setState({
                creditChinaData: data,
            })
        })
    }

    fetchBuilderGoodsBehavior = (param) => {
        this.setState({ goodsLoading: true })
        request(`/api/builder/goods?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let { pageSize, current } = data.pagination;
            let startno = (current - 1) * pageSize;
            data.list.map((value, key) => {
                let nm = { no: startno + key + 1 };
                return Object.assign(value, nm);
            })
            this.setState({
                goodsData: data,
                goodsLoading: false,
            })
        })
    }
    fetchBuilderBadsBehavior = (param) => {
        this.setState({ badsLoading: true })
        request(`/api/builder/bads?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let { pageSize, current } = data.pagination;
            let startno = (current - 1) * pageSize;
            data.list.map((value, key) => {
                let nm = { no: startno + key + 1 };
                return Object.assign(value, nm);
            })
            this.setState({
                badsData: data,
                badsLoading: false,
            })
        })
    }
    fetchBaseData = (builderId) => {
        let REQUEST_URL = `/api/builder/basic/${builderId}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                baseData: data,
                builderId: data.builderId
            });
        })
    }
    fetchCountCertData = (builderId) => {
        let REQUEST_URL = `/api/person/certs/count/${builderId}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            // if(data && data.length > 0){
            //     this.fetchPersonData({ builderId: builderId, certTypeName: data[0].certTypeName });
            //     this.setState({ personTypeId: data[0].certTypeName })
            // } else {
            //     this.fetchPersonData({ builderId: builderId, certTypeName: "注册建造师" });
            // }
            // data.forEach(t => {if(t.certTypeId == 25) t.certTypeName = '水利部监理工程师'});
            this.setState({
                certCountData: data,
            }
                // , () => {
                //     if(data && data.length > 0){
                //         this.props.form.setFieldsValue({
                //             personSelect: data[0].certTypeName,
                //         })
                //     }
                // }
            );
        })
    }
    fetchCountProjectStatusData = (builderId) => {
        let REQUEST_URL = `/api/perform/status/count/${builderId}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                projectStatusCountData: data,
            });
        })
    }
    fetchCreditData = (builderId) => {
        let REQUEST_URL = `/api/builder/credit/${builderId}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            // console.log(data)l;
            this.setState({
                creditData: data ? data : { creditList: [] }
            });
        })
    }
    fetchPersonData = (params) => {
        this.setState({ personLoading: true, });
        let REQUEST_URL = `/api/builder/personV2?${stringify(params)}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                personData: data,
                personLoading: false,
            });
        })
    }
    fetchAchieveData = (params) => {
        this.setState({ achieveLoading: true, });
        let REQUEST_URL = `/api/perform/filter?${stringify(params)}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                achieveData: data,
                achieveLoading: false,
            });
        })
    }
    handlePersonSearch = (e) => {
        const { dispatch, form } = this.props;
        e.preventDefault();
        message.config({
            top: 380,
        });
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { personName, registCertNo } = fieldsValue;
            if ((personName === undefined || personName === '')
                && (registCertNo === undefined || registCertNo === '')) {
                this.setState({ personLoading: false });
                message.info('请输入查询条件');
                return;
            }
            this.setState({
                formValues: fieldsValue,
            });
            const builderId = this.props.match.params.id;
            const params = {
                ...fieldsValue,
                builderId: builderId,
                currentPage: 1,
                pageSize: 10,
            };
            this.fetchPersonData(params);
        });
    }

    fetchCertData = (builderId) => {
        let REQUEST_URL = `/api/builder/certs/details/${builderId}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                certData: data,
            });
        })
    }

    handlePersonTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const builderId = this.props.match.params.id;
        const { formValues, personCert, personName, checkedValues, isMoreCerts } = this.state;
        const params = {
            builderId: builderId,
            //certTypeName: this.state.personTypeId,
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            personName: personName,
            registCertNo: personCert,
            certTypeNames: checkedValues,
            moreCerts: isMoreCerts
        };
        this.fetchPersonData(params);
    }
    personSearch = () => {
        let { personName, personCert, personTypeId, checkedValues, isMoreCerts, personLoading } = this.state;
        console.log(checkedValues);
        let builderId = this.props.match.params.id;
        let param = {
            builderId: builderId,
            //certTypeName: personTypeId,
            personName: personName,
            registCertNo: personCert,
            certTypeNames: checkedValues,
            moreCerts: isMoreCerts
        };
        if (!personLoading) {
            this.fetchPersonData(param);
        }
    }
    resetPersonForm = () => {
        let builderId = this.props.match.params.id;
        const { form } = this.props;
        form.resetFields(['personSelect', 'personTypes', 'personMoreCerts']);
        // console.log(this.refs['personForm']) 重置select
        this.setState({
            personName: '',
            personCert: '',
            personTypeId: 1,
            creditId: 0,
            isMoreCerts: false,
            checkedValues: [],
        }, () => {
            this.fetchPersonData({ builderId: builderId })
        })
    }

    handlePersonTypeChange = (value) => {
        const builderId = this.props.match.params.id;
        this.setState({
            personTypeId: value,
        });
        const params = {
            builderId: builderId,
            certTypeName: value,
            currentPage: 1,
            pageSize: 10,
        };
        // 查询企业人员
        this.fetchPersonData(params);
    }

    changeAchievementStatus = (status) => {
        if (this.state.userLevel < 2) {
            this.setState({ growUpVisiable: true })
            return;
        }
        const params = {
            builderId: this.props.match.params.id,
            projectStatus: status.length>0 ? status.toString() : '0,1,2',
            projectType: this.state.projectType,
        };
        // if (status.length === 0) delete params.projectStatus;
        this.setState({
            projectStatus: status,
        }, () => {
            this.fetchAchieveData(params)
        })
    }
    changeAchievementTable = (pagination, filtersArg, sorter) => {
        let builderId = this.props.match.params.id;
        let { projectStatus, projectName, projectType, projectStart, projectEnd, startPrice, endPrice } = this.state;
        let params = {
            builderId: builderId,
            projectStatus: projectStatus,
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            projectName: projectName,
            projectType: projectType == -1 ? '' : projectType,
            startPrice: startPrice,
            endPrice: endPrice,
            projectStart: projectStart,
            projectEnd: projectEnd,
        };
        this.fetchAchieveData(params);
    }
    changeProjectName = (e) => {
        let value = e.target.value;
        this.setState({ projectName: value });
    }
    changeLeaderType = (value) => {
        this.setState({ leaderType: value })
    }
    changeProjectLeader = (e) => {
        let value = e.target.value;
        this.setState({ projectLeader: value });
    }
    changeGoodsBehaviorTable = (pagination, filtersArg, sorter) => {
        let builderId = this.props.match.params.id;
        let params = {
            builderId: builderId,
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
        };
        this.fetchBuilderGoodsBehavior(params);
    }
    changeBadsBehaviorTable = (pagination, filtersArg, sorter) => {
        let builderId = this.props.match.params.id;
        let params = {
            builderId: builderId,
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
        };
        this.fetchBuilderBadsBehavior(params);
    }
    changePersonCert = (e) => {
        let value = e.target.value;
        this.setState({ personCert: value })
    }
    changePersonName = (e) => {
        let value = e.target.value;
        this.setState({ personName: value })
    }
    resetProjectForm = (e) => {
        this.props.form.resetFields(['projectName', 'projectLeader', 'projectType', 'endPrice', 'startPrice', 'projectEnd', 'projectStart', "projectSituation", 'leaderType'])
        this.setState({ projectName: '', projectLeader: '', projectType: '', endPrice: '', startPrice: '', projectEnd: '', projectStart: '', projectStatus: [], leaderType: '0' })
        this.fetchAchieveData({
            builderId: this.props.match.params.id,
            projectStatus: '0,1,2'
        })
    }
    projectSearch = (e) => {
        if (this.state.userLevel < 2) {
            this.setState({ growUpVisiable: true });
            return;
        }
        let { projectStatus, projectName, projectLeader, projectType, projectStart, projectEnd, startPrice, endPrice, achieveLoading, leaderType } = this.state;
        startPrice = startPrice ? startPrice : null;
        endPrice = endPrice ? endPrice : null;
        const params = {
            builderId: this.props.match.params.id,
            projectStatus: projectStatus.length > 0 ? projectStatus.toString() : '0,1,2',
            projectName: projectName,
            projectLeader: projectLeader.trim(),
            projectType: projectType == -1 ? '' : projectType,
            startPrice: startPrice,
            endPrice: endPrice,
            projectStart: projectStart,
            projectEnd: projectEnd,
        };
        // if (projectStatus.length === 0) delete params.projectStatus;
        if (!achieveLoading) {
            this.fetchAchieveData(params)
        }
    }
    changeProjectSituation = (value) => {
        // switch (value) {
        //     case 0:
        //         this.changeAchievementStatus(0);
        //         break;
        //     case 1:
        //         this.changeAchievementStatus(1);
        //         break;
        //     case 2:
        //         this.changeAchievementStatus(2);
        //         break;
        //     default:
        //         this.changeAchievementStatus();
        // }
        // console.log('change company_details project status:', value);
        this.changeAchievementStatus(value);
    }
    // changeProjectType = (e) => {
    //     this.setState({ projectType: e })
    // }
    changeProjectStart = (e, v) => {
        this.setState({ projectStart: v })
    }
    changeProjectEnd = (e, v) => {
        this.setState({ projectEnd: v })
    }
    changeStartPrice = (e) => {
        this.setState({ startPrice: e * 10000 })
    }
    changeEndPrice = (e) => {
        this.setState({ endPrice: e * 10000 })
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
    handleOk = (e) => {
        let { captchaValue, captchaId, url } = this.state;
        url = decodeURI(url);
        if (url.match(/[\(（]/g)) {
            url = url.replace(/[\(（].{10,12}[\)）]/, "")
        }
        url = encodeURI(url);
        url = url.replace(/j_captchaNewDel=.{4}/, `j_captchaNewDel=${captchaValue}`).replace(/captchaIdNewDel=.*/, `captchaIdNewDel=${captchaId}`);
        this.setState({
            captchaValue: '',
            visible: false
        })
        window.open(url);
    }
    handleCancel = (e) => {
        this.setState({
            captchaValue: '',
            visible: false,
            growUpVisiable: false,
            detailVisiable: false,
        })
    }
    showCaptchaModal = (url, e) => {
        e.preventDefault();
        let captchaId = url.substr(url.indexOf('captchaIdNewDel') + 16);
        let src = `/spider/zhzxgk/captcha.do?captchaId=${captchaId}&random=${Math.random()}`
        this.setState({
            visible: true,
            url: url,
            captchaId: captchaId,
            imgSrc: src,
        })
    }
    changeCaptchaValue = (e) => {
        let value = e.target.value;
        this.setState({
            captchaValue: value
        })
    }
    handleGrowUpOk = (e) => {
        e.preventDefault();
        this.setState({ growUpVisiable: false })
        window.open("/user");
    }
    showDetail = (row, e) => {
        console.log(row)
        this.setState({
            goodsDetail: row.goodsDetail,
            detailVisiable: true,
        });
    }
    handleDetailOk = () => {

    }

    disabledDate = (date) => {
        // 1356969600000 2013/1/1 上午12:00:00
        return date && (date.valueOf() < 1356969600000 || date.valueOf() > new Date().getTime());
    }

    compareDate = (expiredTime) => {
        let time = expiredTime.replace(/-|年|月/g, "\/");
        time = time.replace(/日/g, "");
        return new Date() > new Date(Date.parse(time))
    }

    moreBtn = () => {
        this.setState({ moreClicked: true });
    }

    lessBtn = () => {
        this.setState({ moreClicked: false });
    }

    onBtnClick = (name, id) => {
        // console.log('index', index);
        this.setState({ creditId: id });
        this.handlePersonTypeChange(name);
    }

    cbChanged = (checkedValues) => {
        this.setState({ checkedValues: checkedValues, isMoreCerts: false });
    }

    changeProjectType = (e) => {
        let typeId = e.target.value;
        // console.log(typeId);
        const {projectStatus} = this.state;
        this.props.form.resetFields(['projectName', 'projectLeader', 'projectType', 'endPrice', 'startPrice', 'projectEnd', 'projectStart', "projectSituation", 'leaderType']);
        this.setState({ projectName: '', projectLeader: '', projectType: '', endPrice: '', startPrice: '', projectEnd: '', projectStart: '', projectStatus: [], leaderType: '0' });

        this.setState({ projectType: typeId });
        this.fetchAchieveData({
            builderId: this.props.match.params.id,
            projectType: typeId,
            projectStatus: projectStatus.length>0 ? projectStatus.toString() : '0,1,2'
        })
    }

    due2ProjectStatus = (status) => {
        switch (status) {
            case 0:
                return <Tag color="blue">中标业绩</Tag>;
            case 1:
                return <Tag color="blue">在建业绩</Tag>;
            case 2:
                return <Tag color="blue">完工业绩</Tag>;
        }
    }

    string2Tooltips = (price) => {
        if (!price) return '';
        const str = this.renderNumberFormatW(price);
        const isLongTag = str.length > 11;
        const tagElem = isLongTag ? `${str.slice(0, 11)}...` : str;
        return isLongTag ? <Tooltip title={str} >{tagElem}</Tooltip> : tagElem;
    }

    due2Blue = (str) => {
        return (
            <span style={{ color: '#1890ff' }}>{str}</span>)
    }

    changeAchievementList = (No, Size) => {// pageNo:    pageSize:
        let builderId = this.props.match.params.id;
        let { projectStatus, projectName, projectLeader, projectType, projectStart, projectEnd, startPrice, endPrice } = this.state;
        let params = {
            builderId: builderId,
            projectStatus: projectStatus.length > 0 ? projectStatus.toString() : '0,1,2',
            currentPage: No,
            pageSize: Size,
            projectName: projectName,
            projectLeader: projectLeader,
            projectType: projectType == -1 ? '' : projectType,
            startPrice: startPrice,
            endPrice: endPrice,
            projectStart: projectStart,
            projectEnd: projectEnd,
        };
        // if (projectStatus.length === 0) delete params.projectStatus;
        this.fetchAchieveData(params);
    }

    handlePersonListChange = (No, Size) => {
        const builderId = this.props.match.params.id;
        const { formValues, personCert, personName, checkedValues, isMoreCerts } = this.state;
        const params = {
            builderId: builderId,
            currentPage: No,
            pageSize: Size,
            ...formValues,
            personName: personName,
            registCertNo: personCert,
            certTypeNames: checkedValues,
            moreCerts: isMoreCerts
        };
        this.fetchPersonData(params);
    }

    onChangePagePerson(pageNo, pageSize) {
        this.handlePersonListChange(pageNo, pageSize);
    }

    onChangeShowSizePerson(pageNo, pageSize) {
        this.handlePersonListChange(1, pageSize);
    }

    onChangePageAchievement(pageNo, pageSize) {
        this.changeAchievementList(pageNo, pageSize);
    }

    onChangeShowSizeAchievement(pageNo, pageSize) {
        this.changeAchievementList(1, pageSize);
    }

    jump2SourceOrDDgo = (item) => {
        // console.log(item);
        let toSource = item.domain_id == 16 || item.domain_id == 15 || item.domain_id == 14 || item.domain_id == 4 || item.domain_id == 6;
        if (toSource) {
            //item.sourceUrl
            return item.sourceUrl ?
                <a style={{ fontSize: '16px' }} target="_blank" href={item.sourceUrl}>{item.projectName}</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>
        } else {
            //ddgo
            return item.url ?
                <a style={{ fontSize: '16px' }} target="_blank" href={`/pub/projectNew/${item.url}`}>{item.projectName}</a>
                : <Tooltip placement="top" title={"暂无数据来源"}><a>{item.projectName}</a></Tooltip>
        }

    }

    expired2Red = (value) => {
        if (this.compareDate(value)) {

            console.log(value)
            return <span className='expired' >{value}</span>
        }
        else
            return value
    }

    jump2GovPc = (row) => {
        return (
            row.sourceUrl ?
                <a style={{ fontSize: '15px', marginRight: '20px', fontWeight: 'bold' }} target="_blank"
                    href={genelink(row.sourceUrl, true)}>{row.personName}</a>
                : <Tooltip placement="top" title={"暂无数据来源"}>
                    <a style={{ fontSize: '15px', marginRight: '20px', fontWeight: 'bold' }}>{row.personName}</a></Tooltip>
        )
    }

    changeGoodsBehavior = (No, Size) => {
        let builderId = this.props.match.params.id;
        let params = {
            builderId: builderId,
            currentPage: No,
            pageSize: Size,
        };
        this.fetchBuilderGoodsBehavior(params);
    }

    onChangeGB(pageNo, pageSize) {
        this.changeGoodsBehavior(pageNo, pageSize);
    }

    onChangeGBSize(current, size) {
        this.changeGoodsBehavior(1, size);
    }

    changeBadBehavior = (No, Size) => {
        let builderId = this.props.match.params.id;
        let params = {
            builderId: builderId,
            currentPage: No,
            pageSize: Size,
        };
        this.fetchBuilderBadsBehavior(params);
    }

    onChangeBB(pageNo, pageSize) {
        this.changeBadBehavior(pageNo, pageSize);
    }

    onChangeBBSize(current, size) {
        this.changeBadBehavior(1, size);
    }

    string2Tooltip = (str) => {
        if (!str) {
            return "";
        }
        const isLongTag = str.length > 15;
        const tagElem = isLongTag ? `${str.slice(0, 15)}...` : str;
        return isLongTag ? <Tooltip title={str} >{tagElem}</Tooltip> : tagElem;
    }

    sortProjectType(projectTypeCountData) {
        console.log('项目类型：', projectTypeCountData);
        return projectTypeCountData.sort((a, b) => {
            return a.projectTypeId - b.projectTypeId;
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { baseData, certData, creditData, personData, projectStatus, personName, personCert, roadSichuanCredit, startPrice, userLevel,
            certCountData, goodsLoading, badsLoading, creditChinaData, zxgkCourtData, performCategory, auditCredit, endPrice,
            achieveData, achieveLoading, goodsData, badsData, projectName, xmchengduCredit, waterCredit, roadCredit, captchaValue,
            moreClicked, checkedValues, projectTypeCountData } = this.state;
        let { blackList, administrativeSanction, redList } = creditChinaData;
        console.info('render details search!!!!');
        let locale = {
            emptyText: (userLevel == 0 || !userLevel) ? "请升级为会员！" : userLevel == 1 ? "请升级为钻石会员！" : "暂无数据",
        }
        const personColumns = [
            { title: '序号', dataIndex: 'no', },
            {
                title: '姓名', dataIndex: 'personName',
                render: (value, row, index) => {
                    return (
                        row.sourceUrl ?
                            <a target="_blank" href={genelink(row.sourceUrl, true)}>{value}</a>
                            : <Tooltip placement="top" title={"暂无数据来源"}><a>{value}</a></Tooltip>
                    )
                }
            },
            {
                title: '证书种类', dataIndex: 'certTypeName', render: (value, record) => {
                    return value
                }
            },
            {
                title: '证书编号', dataIndex: 'certNo', render: (value, record) => {
                    return value
                }
            },
            {
                title: '专业', dataIndex: 'registMajor', render: (value, record) => {
                    // if(this.compareDate(record.expiredDate))
                    //     return <span className='expired' >{value ? value : record.certLevelName}</span>
                    // else
                    //     return <span>{value ? value : record.certLevelName}</span>
                    return value ? value : record.certLevelName
                }
            },
            {
                title: '有效期', dataIndex: 'expiredDate', render: (value) => {
                    if (this.compareDate(value)) {
                        return <span className='expired' >{value}</span>
                    }
                    else
                        return value
                }
            },
        ];
        if (personData.list && personData.pagination) {
            let { pageSize, current } = personData.pagination;
            let startno = (current - 1) * pageSize;
            if (personData.list != null) {
                personData.list.map(function (value, key) {
                    let nm = { no: startno + key + 1 };
                    return Object.assign(value, nm);
                });
            }
        }
        let creditCondition = false;
        if (!creditData.creditList.length && !(xmchengduCredit && xmchengduCredit.length)
            && !(auditCredit && auditCredit.length) && !(waterCredit && waterCredit.length)
            && !(roadCredit && roadCredit.length) && !(zxgkCourtData.creditList && zxgkCourtData.creditList.length)
            && !(blackList || administrativeSanction || redList)) {
            creditCondition = true;
        }
        const yjColumns = [
            { title: '序号', dataIndex: 'no' },
            {
                title: '项目名称', dataIndex: 'projectName', key: 'zbProjectName', align: 'center', render: (value, row, index) => {
                    let toSource = row.domain_id == 14 || row.domain_id == 16 || row.domain_id == 4;
                    let toDDgo = row.domain_id == 15 && row.sourceUrl.indexOf('http://jzsc.mohurd.gov.cn') > -1;

                    if (toSource || toDDgo) {
                        return row.sourceUrl ?
                            <a target="_blank" href={row.sourceUrl}>{row.projectName}</a> :
                            <Tooltip placement="top" title={"暂无数据来源"}><a>{row.projectName}</a></Tooltip>
                    } else {
                        return row.url ?
                            <a target="_blank" href={`/pub/projectNew/${row.url}`}>{row.projectName}</a>
                            : <Tooltip placement="top" title={"暂无数据来源"}><a>{row.projectName}</a></Tooltip>

                    }

                    // if (row.projectStatus == 0) {
                    //     return row.url ?
                    //         <a target="_blank" href={`/pub/project/${row.url}`}>{row.projectName}</a>
                    //         : <Tooltip placement="top" title={"暂无数据来源"}><a>{row.projectName}</a></Tooltip>
                    // } else {
                    //     return row.sourceUrl ?
                    //         <a target="_blank" href={row.sourceUrl}>{row.projectName}</a>
                    //         : <Tooltip placement="top" title={"暂无数据来源"}><a>{row.projectName}</a></Tooltip>
                    // }
                }
            },
            { title: '项目类型', dataIndex: 'projectTypeName', key: 'zbProjectTypeName', align: 'center', },
            { title: '项目地址', dataIndex: 'projectSite', key: 'zbProjectSite' },
            {
                title: '中标金额', dataIndex: 'bidPrice', key: 'zbBidPrice', render: (value, row, index) => {
                    if (row.bidPrice >= startPrice) {
                        return this.renderNumberFormatW(row.bidPrice)
                    }
                }
            },
            { title: '项目负责人', dataIndex: 'projectLeader', key: 'zbOwnerName' },
            {
                title: '业绩状态', key: 'zbStatus', render: (value, row, index) => {
                    switch (row.projectStatus) {
                        case 0:
                            return "中标业绩";
                        case 1:
                            return "在建业绩";
                        case 2:
                            return "完工业绩";
                    }
                }
            },
            // {
            //     title: '角色主体', dataIndex: 'role', key: 'zbRole',
            // },
            {
                title: '发布时间', dataIndex: 'bidDate', key: 'zbbidDate', render: (value, row, index) => {
                    return row.bidDate || row.startDate || row.endDate
                }
            }
        ]
        if (achieveData.list) {
            let { pageSize, current } = achieveData.pagination;
            let startno = (current - 1) * pageSize;
            if (achieveData.list != null) {
                achieveData.list.map(function (value, key) {
                    console.log(value)
                    if (value.bidPrice >= startPrice) {
                        let nm = { no: startno + key + 1 };
                        console.log(startPrice)
                        return Object.assign(value, nm);
                    }
                });
            }
        }
        //const buttons = [];//certCountData
        const options = [];
        for (let i = 0; i < certCountData.length; i++) {
            if (moreClicked) {
                options.push({
                    label: certCountData[i].certTypeId == 25 ? `水利部监理工程师(${certCountData[i].total})` : `${certCountData[i].certTypeName}(${certCountData[i].total})`,
                    value: `${certCountData[i].certTypeName}`
                });
            } else {
                if (i >= 6) {
                    break;
                }
                options.push({
                    label: certCountData[i].certTypeId == 25 ? `水利部监理工程师(${certCountData[i].total})` : `${certCountData[i].certTypeName}(${certCountData[i].total})`,
                    value: `${certCountData[i].certTypeName}`
                });
            }
        }

        let uri = window.location.href;
        let anchor = uri.substr(uri.indexOf('#') + 1);
        return (
            <div className='ddgo_company_detail'>
                <div className='ddgo_company_basic'>
                    {/*<div>*/}
                    {/*    <p><a className="dataRoot" href={genelink('http://jst.sc.gov.cn/xxgx/Enterprise/eZsxx.aspx?id=' + baseData.builderGuid, true)} target="_blank"></a></p>*/}
                    {/*    <p>{baseData.builderName}</p>*/}
                    {/*</div>*/}
                    {/*<table className='ddgo_company_basic_information_table'>*/}
                    {/*    <tr>*/}
                    {/*        <td>统一社会信用代码</td>*/}
                    {/*        <td>{baseData.builderIDCard}</td>*/}
                    {/*    </tr>*/}
                    {/*    <tr>*/}
                    {/*        <td>注册地址</td>*/}
                    {/*        <td>{baseData.address || ""}</td>*/}
                    {/*    </tr>*/}
                    {/*    <tr>*/}
                    {/*        <td>法人</td>*/}
                    {/*        <td>{baseData.legalPerson}</td>*/}
                    {/*    </tr>*/}
                    {/*    <tr>*/}
                    {/*        <td>注册资本</td>*/}
                    {/*        <td>{baseData.registCapital || ""}</td>*/}
                    {/*    </tr>*/}
                    {/*    <tr>*/}
                    {/*        <td>成立日期</td>*/}
                    {/*        <td>{baseData.createDate || ""}</td>*/}
                    {/*    </tr>*/}
                    {/*    <tr>*/}
                    {/*        <td>联系方式</td>*/}
                    {/*        <td>{baseData.contact || ""}</td>*/}
                    {/*    </tr>*/}
                    {/*</table>*/}
                    <div>
                        {/* <p><a className="dataRoot" href={genelink('http://jst.sc.gov.cn/xxgx/Enterprise/eZsxx.aspx?id=' + baseData.builderGuid, true)} target="_blank"></a></p> */}
                        <h2>{baseData.builderName}</h2>
                    </div>
                    <p>统一社会信用代码：<span className='ddgo_company_details_changeColor'>{baseData.builderIDCard}</span></p>
                    <div className='ddgo_company_basic_line'></div>
                    <Row>
                        <Col span={6}>企业法人：<span className='ddgo_company_details_changeColor'>{baseData.legalPerson}</span></Col>
                        <Col span={6}>注册资本：{baseData.registCapital || ""}</Col>
                        <Col span={5}>成立日期：{(baseData.createDate || "")}</Col>
                        <Col span={7}>联系方式：<span className='ddgo_company_details_changeColor'>{this.string2Tooltip(baseData.contact || "")}</span></Col>
                        {/* <Col span={8}>联系方式：{(baseData.contact || "")}</Col> */}
                    </Row>
                    <span>注册地址 ：{baseData.address || ""}</span>
                    <div className='ddgo_company_basic_line'></div>

                </div>
                <div className='ddgo_company_others_information'>
                    <Tabs type="card" defaultActiveKey={anchor} >
                        <TabPane tab="企业资质" key="1">
                            {
                                certData.map((data) => {
                                    return (
                                        <div className='ddgo_company_aptitude_box'>
                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                <p className='ddgo_company_aptitude_listTitel'>{data.certType}</p>
                                                {data.certs[0].sourceUrl != "" ?
                                                    <p style={{ "marginRight": "20px" }}><a target='__blank' href={data.certs[0].sourceUrl} style={{ "fontSize": "16px","textDecoration": "none" }}>数据来源</a></p>
                                                    : <p title="暂无数据来源" style={{ "marginRight": "20px" }}><a target='__blank' style={{ "fontSize": "16px"}}>数据来源</a></p>
                                                }
                                            </div>
                                            <div className='ddgo_company_basic_line'></div>
                                            <table className='ddgo_company_aptitude_tables'>
                                                {/*<tr>*/}
                                                {/*    <td colspan="4">{data.certType}</td>*/}
                                                {/*</tr>*/}
                                                {data.certs.map((data, key) => {
                                                    let expiredDate = data.expiredDate.replace(/-|年|月/g, "\/");
                                                    expiredDate = expiredDate.replace(/日/g, "");
                                                    console.log(expiredDate)
                                                    return (
                                                        <tbody style={{ display: 'block', marginBottom: '20px' }}>

                                                            {
                                                                (data.certNo == "") ? "" :
                                                                    <tr>
                                                                        <td>证书编号</td>
                                                                        <td style={{ color: '#1890ff' }}>{data.certNo}</td>
                                                                        <td>有效期</td>
                                                                        <td style={{
                                                                            color:
                                                                                this.compareDate(data.expiredDate) ? '#f00' : '#000'
                                                                        }}>
                                                                            {expiredDate == "9999/99/99" ? expiredDate = '' : expiredDate}
                                                                        </td>
                                                                    </tr>
                                                            }
                                                            {data.permitDesc ?
                                                                <tr style={{ "height": "160px" }}>
                                                                    <td>资质项</td>
                                                                    <td colSpan="3" style={{ "width": "1010px", "overflow": "auto" }}>
                                                                        {/* <ul> */}
                                                                        {data.permitDesc.split(',').map(val => ' ' + val).toString().split('<br>').map((val) => {
                                                                            return <li key={val}>{val.split('|')}</li>
                                                                        })
                                                                        }
                                                                        {/* </ul> */}
                                                                    </td>
                                                                </tr> : ''
                                                            }
                                                            {
                                                                data.licenceAuthority ?
                                                                    <tr>
                                                                        <td>发证机关</td>
                                                                        <td colSpan="3">{data.licenceAuthority}</td>
                                                                    </tr>
                                                                    : ''
                                                            }
                                                        </tbody>)
                                                })}
                                            </table>
                                        </div>
                                    );
                                })
                            }
                        </TabPane>
                        <TabPane tab="人员证书" key="2">
                            <div className='ddgo_company_certificate_search'>
                                <Form ref="personForm">
                                    <Row>
                                        <Col style={{ overflow: 'hidden' }}>
                                            {/*{buttons}*/}
                                            {/*<Checkbox >一人多证(人数)</Checkbox>*/}
                                            {getFieldDecorator("personTypes")(
                                                <CheckboxGroup options={options} value={checkedValues} onChange={this.cbChanged} />
                                            )}

                                            {getFieldDecorator("personMoreCerts")(
                                                certCountData.length > 1 ?
                                                    <Checkbox value={this.state.isMoreCerts} checked={this.state.isMoreCerts ? true : false} onChange={(e) => {
                                                        if (e.target.checked) {
                                                            this.props.form.resetFields("personTypes")
                                                        }
                                                        this.setState({ isMoreCerts: e.target.checked, checkedValues: [] })
                                                    }}>一人多证</Checkbox> :
                                                    <div />
                                            )}

                                            {/*{getFieldDecorator("personMoreCerts")(*/}
                                            {/*        <Checkbox value={this.state.isMoreCerts} checked={this.state.isMoreCerts ? true : false} onChange={(e) => {*/}
                                            {/*            if(e.target.checked) {*/}
                                            {/*                this.props.form.resetFields("personTypes")*/}
                                            {/*            }*/}
                                            {/*            this.setState({ isMoreCerts: e.target.checked, checkedValues: [] })*/}
                                            {/*        }}>一人多证</Checkbox> */}
                                            {/*)}*/}

                                            <div style={{ textAlign: 'center' }}>{(certCountData.length > 6 && !moreClicked) ? <a className='ddgo_company_certificate_lookMore' onClick={this.moreBtn}>查看更多&nbsp;<Icon type="down" /></a> : <div />}</div>
                                            <div style={{ textAlign: 'center' }}>{moreClicked ? <a className='ddgo_company_certificate_lookMore' onClick={this.lessBtn}>收起&nbsp;<Icon type="up" /></a> : <div />}</div>
                                        </Col>

                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="人员姓名">
                                                <Input placeholder="请输入" value={personName} onChange={this.changePersonName} />
                                            </FormItem>
                                        </Col>
                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="证书编号">
                                                <Input placeholder="请输入" value={personCert} onChange={this.changePersonCert} />
                                            </FormItem>
                                        </Col>
                                        {/*<Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>*/}
                                        {/*    <div className='ddgo_company_certificate_searchButton'>*/}
                                        {/*        <Button htmlType="button" onClick={this.personSearch} type="primary">查询</Button>*/}
                                        {/*        <Button htmlType="button" onClick={this.resetPersonForm} type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>*/}
                                        {/*    </div>*/}
                                        {/*</Col>*/}
                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <div className='ddgo_company_certificate_searchButton'>
                                                <Button htmlType="button" onClick={this.personSearch} type="primary">查询</Button>
                                                <Button htmlType="button" onClick={this.resetPersonForm} type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <div className='ddgo_company_certificate_list'>
                                {/* ----------注册建造师+ ------------*/}
                                {/*<Table*/}
                                {/*    columns={personColumns}*/}
                                {/*    dataSource={personData.list}*/}
                                {/*    loading={this.state.personLoading}*/}
                                {/*    pagination={{ showSizeChanger: true, showQuickJumper: true, total: personData.pagination.total, current: personData.pagination.current, pageSize: personData.pagination.pageSize, showTotal: () => `共 ${personData.pagination.total} 记录` }}*/}
                                {/*    onChange={this.handlePersonTableChange}*/}
                                {/*    bordered*/}
                                {/*/>*/}


                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    bordered={false}
                                    loading={this.state.personLoading}
                                    dataSource={personData.list}
                                    renderItem={item => (
                                        <List.Item style={{
                                            // textAlign: 'center',
                                        }}>
                                            <div>
                                                {/*<a style={{fontSize: '15px', marginRight: '20px'}}>{item.personName}</a>*/}
                                                {this.jump2GovPc(item)}
                                                {
                                                    item.certTypeId == 1 ?
                                                        <Tag color="blue">{item.certLevelName}</Tag> :
                                                        item.certTypeId == 25 && item.domainId == 6 ?
                                                            <Tag color="blue">水利部监理工程师</Tag> :
                                                            <Tag color="blue">{item.certTypeName}</Tag>
                                                }
                                                <Row>
                                                    <Col span={8}>证书编号：{item.certNo}</Col>
                                                    {
                                                        item.certTypeId == 26 ?
                                                            <Col span={8}>专业：{item.certLevelName + item.registMajor}</Col> :
                                                            <Col span={8}>专业：{item.registMajor ? item.registMajor : item.certLevelName}</Col>
                                                    }
                                                    <Col span={8}>有效期：{this.expired2Red(item.expiredDate)}</Col>
                                                </Row>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Pagination
                                    current={personData.pagination.current}
                                    pageSize={personData.pagination.pageSize}
                                    showQuickJumper
                                    showSizeChanger
                                    total={personData.pagination.total}
                                    showTotal={(total) => `共 ${personData.pagination.total} 条`}
                                    style={{ textAlign: "right", display: personData.list.length == 0 ? 'none' : '' }}
                                    onChange={this.onChangePagePerson.bind(this)}
                                    onShowSizeChange={this.onChangeShowSizePerson.bind(this)}
                                />

                            </div>
                        </TabPane>
                        {/* 钻石用户 */}
                        <TabPane tab="业绩信息" key="3">
                            <div className='ddgo_company_achievement_search'>
                                <Form>
                                    <Row>
                                        <Col>
                                            {getFieldDecorator("projectType")(
                                                <RadioGroup value={this.state.projectType} onChange={this.changeProjectType}>
                                                    {
                                                        this.sortProjectType(projectTypeCountData).map(data => {
                                                            return (
                                                                <RadioButton value={data.projectTypeId} className="achievement_buttons">
                                                                    {
                                                                        data.projectTypeId < 4 ? "施工业绩-" + data.projectTypeName : data.projectTypeName
                                                                    }
                                                                </RadioButton>
                                                            )
                                                        })
                                                    }
                                                    {/* <RadioButton value="a">{}</RadioButton>
                                                <RadioButton value="b" disabled>Shanghai</RadioButton>
                                                <RadioButton value="c">Beijing</RadioButton>
                                                <RadioButton value="d">Chengdu</RadioButton> */}
                                                </RadioGroup>
                                            )}

                                        </Col>

                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="项目名称">
                                                {getFieldDecorator("projectName")(
                                                    <Input placeholder="请输入" onChange={this.changeProjectName} />
                                                )}
                                            </FormItem>
                                        </Col>
                                        {/* <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="项目类型">
                                                {getFieldDecorator("projectType")(
                                                    <Select placeholder="请输入" allowClear="true" onChange={this.changeProjectType} >
                                                        {
                                                            performCategory.map(type => {
                                                                return <Select.Option key={type.projectTypeId}>{type.projectTypeName}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col> */}
                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="项目日期">
                                                <div className='ddgo_company_achievement_DatePickerSearch' style={{ "display": "flex" }}>
                                                    {getFieldDecorator("projectStart")(
                                                        <DatePicker.MonthPicker disabledDate={this.disabledDate} onChange={this.changeProjectStart} format={"YYYY-MM"} placeholder="开始" />
                                                    )}
                                                    <span style={{ lineHeight: "20px", float: 'left', marginTop: '5px' }}>&nbsp;-&nbsp;</span>
                                                    {getFieldDecorator("projectEnd")(
                                                        <DatePicker.MonthPicker disabledDate={this.disabledDate} onChange={this.changeProjectEnd} format={"YYYY-MM"} style={{ "width": "100%" }} placeholder="结束" />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="金额(万元)">
                                                <div className='ddgo_company_achievement_InputNumberSearch'>
                                                    {getFieldDecorator("startPrice")(
                                                        <InputNumber min={1} step={1} placeholder="请输入" onChange={this.changeStartPrice} />
                                                    )}
                                                    <span style={{ lineHeight: "32px", float: 'left', marginTop: '5px' }}>&nbsp;-&nbsp;</span>
                                                    {getFieldDecorator("endPrice")(
                                                        <InputNumber min={1} step={1} placeholder="请输入" onChange={this.changeEndPrice} />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>

                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem label="业绩状态">
                                                {getFieldDecorator("projectSituation")(
                                                    <Select placeholder="请选择" mode="multiple" onChange={this.changeProjectSituation} >
                                                        <Select.Option key={0} value={0}>中标业绩</Select.Option>
                                                        <Select.Option key={1} value={1}>在建业绩</Select.Option>
                                                        <Select.Option key={2} value={2}>完工业绩</Select.Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <FormItem >
                                                <div className='ddgo_company_achievement_principal'>
                                                    {getFieldDecorator('leaderType', { initialValue: '0' })(
                                                        <Select onChange={this.changeLeaderType}>
                                                            <Select.Option value="0">项目负责人</Select.Option>
                                                            <Select.Option value="1" disabled >技术负责人</Select.Option>
                                                        </Select>
                                                    )}
                                                    <span style={{ lineHeight: "32px", }}>&nbsp;:&nbsp;</span>
                                                    {getFieldDecorator("projectLeader")(
                                                        <Input placeholder="请输入" onChange={this.changeProjectLeader} />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>

                                        <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                                            <div className='ddgo_company_achievement_Search'>
                                                <Button htmlType="button" onClick={this.projectSearch} type="primary">查询</Button>
                                                <Button htmlType="button" onClick={this.resetProjectForm} type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <div className='ddgo_company_achievement_list'>
                                {/*<Table*/}
                                {/*    columns={yjColumns}*/}
                                {/*    dataSource={achieveData.list}*/}
                                {/*    loading={achieveLoading}*/}
                                {/*    pagination={{ showSizeChanger: true, showQuickJumper: true, total: achieveData.pagination.total, current: achieveData.pagination.current, pageSize: achieveData.pagination.pageSize, showTotal: () => `共 ${achieveData.pagination.total} 记录` }}*/}
                                {/*    bordered*/}
                                {/*    onChange={this.changeAchievementTable}*/}
                                {/*    locale={locale}*/}
                                {/*/>*/}

                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    bordered={false}
                                    dataSource={achieveData.list}
                                    locale={locale}
                                    loading={achieveLoading}
                                    renderItem={item => (
                                        <List.Item style={{
                                            // textAlign: 'center',
                                        }}>
                                            <div>
                                                {/*<a style={{fontSize: '16px'}}>{item.projectName}</a>*/}
                                                {this.jump2SourceOrDDgo(item)}
                                                <Row>
                                                    <Col span={5}>业绩状态：{this.due2ProjectStatus(item.projectStatus)}</Col>
                                                    <Col span={5}>项目类型：{this.due2Blue(item.projectTypeName)}</Col>
                                                    <Col span={5}>角色主体：{item.role}</Col>
                                                    <Col span={5}>项目负责人：{item.projectLeader}</Col>
                                                    <Col span={4}>发布时间：{item.bidDate || item.startDate || item.endDate}</Col>
                                                </Row>
                                                <Row>
                                                    <Col span={5}>中标金额 ：{this.string2Tooltips(item.bidPrice)}</Col>
                                                    <Col span={5}>项目地址：{this.string2Tooltip(item.projectSite)}</Col>
                                                </Row>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Pagination
                                    current={achieveData.pagination.current}
                                    pageSize={achieveData.pagination.pageSize}
                                    showQuickJumper
                                    showSizeChanger
                                    total={achieveData.pagination.total}
                                    showTotal={(total) => `共 ${achieveData.pagination.total} 条`}
                                    style={{ textAlign: "right", display: achieveData.list.length == 0 ? 'none' : '' }}
                                    onChange={this.onChangePageAchievement.bind(this)}
                                    onShowSizeChange={this.onChangeShowSizeAchievement.bind(this)}
                                />



                            </div>
                        </TabPane>
                        {/* vip用户 */}
                        <TabPane tab="信用信息" key="4">
                            {/* 成都市建筑市场信用排名 */}
                            <div style={{ display: creditData.creditList.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>成都市建筑市场信用排名</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table01' style={{ display: creditData.creditList.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">成都市建筑市场信用排名</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        creditData.creditList.map((val, key) => {
                                            return (
                                                <tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                    <tr>
                                                        <td >行业</td>
                                                        <td >{val.creditTypeName}</td>
                                                        <td>今日得分</td>
                                                        <td>{val.totalScore}</td>
                                                        <td>60日得分</td>
                                                        <td>{val.averageScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>今日排行</td>
                                                        <td>{val.rankIndex}</td>
                                                        <td>60日排行</td>
                                                        <td colspan={3}>{val.averageIndex}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                            {/* 成都工程招标投标信用 */}
                            <div style={{ display: xmchengduCredit && xmchengduCredit.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>成都工程招标投标信用</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table02' style={{ display: xmchengduCredit && xmchengduCredit.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">成都工程招标投标信用</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        xmchengduCredit.map(credit => {
                                            return (
                                                <tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                    <tr>
                                                        <td>行业</td>
                                                        <td>{credit.creditType}</td>
                                                        <td>专业</td>
                                                        <td>{credit.creditMajor}</td>
                                                        <td>得分</td>
                                                        <td>{credit.creditScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>等级</td>
                                                        <td colspan={5}>{credit.creditLevel}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                            {/* 四川建筑行业共享平台信用 */}
                            <div style={{ display: auditCredit && auditCredit.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>四川建筑行业共享平台信用</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table03' style={{ display: auditCredit && auditCredit.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">四川建筑行业共享平台信用</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        auditCredit.map(credit => {
                                            return (
                                                <tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                    <tr>
                                                        <td>企业类型</td>
                                                        <td>{credit.builderTypeName}</td>
                                                        <td>当前诚信分值</td>
                                                        <td>{credit.currentScore}</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }

                                </table>
                            </div>
                            {/* 全国水利建设市场信用 */}
                            <div style={{ display: waterCredit && waterCredit.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>全国水利建设市场信用</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table04' style={{ display: waterCredit && waterCredit.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">全国水利建设市场信用</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        waterCredit.map(credit => {
                                            return (
                                                <tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                    <tr>
                                                        <td>类别</td>
                                                        <td>{credit.creditType}</td>
                                                        <td>评价结果</td>
                                                        <td>{credit.evalResults}</td>
                                                        <td>有效期</td>
                                                        <td>{credit.expiredDate}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }

                                </table>
                            </div>
                            {/* 全国公路建设市场信用 */}
                            <div style={{ display: roadCredit && roadCredit.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>全国公路建设市场信用</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table05' style={{ display: roadCredit && roadCredit.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">全国公路建设市场信用</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        roadCredit.map(credit => {
                                            return (
                                                <tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                    <tr>
                                                        <td>评价省份</td>
                                                        <td>{credit.evalOrgan}</td>
                                                        <td>评价结果</td>
                                                        <td>{credit.evalResults}</td>
                                                        <td>评价年份</td>
                                                        <td>{credit.evalYear}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }

                                </table>
                            </div>
                            {/* 信用交通-四川 */}
                            <div style={{ display: roadSichuanCredit && roadSichuanCredit.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>信用交通-四川</p>
                                <div className='ddgo_company_basic_line'></div>
                                <table className='ddgo_company_credit_table06' style={{ display: roadSichuanCredit && roadSichuanCredit.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">信用交通-四川</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        roadSichuanCredit.map(credit => {
                                            return (<tbody style={{ display: 'block', marginBottom: '20px' }}>
                                                <tr>
                                                    <td>等级</td>
                                                    <td>{credit.evalresults}</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                            </tbody>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                            <div style={{ display: zxgkCourtData.creditList && zxgkCourtData.creditList.length ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>中国执行信息公开网</p>
                                <div className='ddgo_company_basic_line'></div>
                                {/* 中国执行信息公开网 */}
                                <table className='ddgo_company_credit_table07' style={{ display: zxgkCourtData.creditList && zxgkCourtData.creditList.length ? '' : 'none' }}>
                                    {/*<thead>*/}
                                    {/*    <tr>*/}
                                    {/*        <th colspan="6">中国执行信息公开网</th>*/}
                                    {/*    </tr>*/}
                                    {/*</thead>*/}
                                    {
                                        zxgkCourtData.creditList.map((data) => (
                                            <tbody style={{ display: 'block', marginBottom: '20px' }}>

                                                <tr>
                                                    <td>公司名称</td>
                                                    <td>{data.builderName || '-'}</td>
                                                    <td>企业法人</td>
                                                    <td>{data.personName || '-'}</td>
                                                    <td>立案时间</td>
                                                    <td>{new Date(data.filingTime).format('yyyy-MM-dd') || '----/--/--'}</td>
                                                </tr>
                                                <tr>
                                                    <td>案号</td>
                                                    <td>
                                                        <a onClick={this.showCaptchaModal.bind(this, data.sourceUrl)}>
                                                            {data.filingNum || '-'}
                                                        </a>
                                                    </td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table>
                            </div>
                            {/* 信用中国 */}
                            <div style={{ display: blackList || administrativeSanction || redList ? '' : 'none' }}>
                                <p className='ddgo_company_credit_titeles'>信用中国</p>
                                <div className='ddgo_company_basic_line'></div>
                            </div>
                            <div className='ddgo_company_credit_table08' style={{ display: blackList || administrativeSanction || redList ? '' : 'none' }}>
                                {/*<p>信用中国</p>*/}
                                <div>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab={`守信红名单(${redList ? redList.length : 0})`} key="1">
                                            <table className='ddgo_company_credit_table08_001'>
                                                {
                                                    redList ? redList.map((red, index) => (
                                                        <tbody>
                                                            <tr>
                                                                <th colspan="6">A级纳税人</th>
                                                            </tr>
                                                            <tr>
                                                                <td>数据来源</td>
                                                                <td>{red['数据来源']}</td>
                                                                <td>序号</td>
                                                                <td>{red['序号']}</td>
                                                                <td>纳税人名称</td>
                                                                <td>{red['纳税人名称']}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>评价年度</td>
                                                                <td>{red['评价年度']}</td>
                                                                <td>最新更新</td>
                                                                <td>{red['最新更新日期']}</td>
                                                                <td>文件名</td>
                                                                <td>{red['文件名'] || '-'}</td>
                                                            </tr>
                                                        </tbody>)
                                                    ) : (
                                                            <tbody>
                                                                <div className='icon_user_abc' >
                                                                    <div></div>
                                                                    <p>暂无数据</p>
                                                                </div>
                                                            </tbody>
                                                        )
                                                }
                                            </table>
                                        </TabPane>
                                        <TabPane tab={`黑名单(${blackList ? blackList.length : 0})`} key="2">
                                            <table className='ddgo_company_credit_table08_002'>
                                                {
                                                    blackList ? blackList.map((black, index) => (
                                                        <tbody>
                                                            <tr>
                                                                <th colspan="6">失信黑名单-法人</th>
                                                            </tr>
                                                            <tr>
                                                                <td>数据来源</td>
                                                                <td>{black['数据来源'] || '-'}</td>
                                                                <td>案号</td>
                                                                <td>{black['案号'] || '-'}</td>
                                                                <td>失信被执行人名称</td>
                                                                <td>{black['失信被执行人名称'] || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>企业法人</td>
                                                                <td>{black['企业法人姓名'] || '-'}</td>
                                                                <td>执行法院</td>
                                                                <td>{black['执行法院'] || '-'}</td>
                                                                <td>作出执行依据单位</td>
                                                                <td>{black['作出执行依据单位'] || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>地域名称</td>
                                                                <td>{black['地域名称'] || '-'}</td>
                                                                <td>执行依据文号</td>
                                                                <td>{black['执行依据文号'] || '-'}</td>
                                                                <td>被执行人履行情况</td>
                                                                <td>{black['被执行人的履行情况'] || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>发布时间</td>
                                                                <td>{black['发布时间'] || '-'}</td>
                                                                <td>立案时间</td>
                                                                <td>{black['立案时间'] || '-'}</td>
                                                                <td>失信被执行人具体情况</td>
                                                                <td>{black['失信被执行人具体情形'] || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>已履行部分</td>
                                                                <td>{black['已履行部分'] || '-'}</td>
                                                                <td>未履行部分</td>
                                                                <td>{black['未履行部分'] || '-'}</td>
                                                                <td>最新更新</td>
                                                                <td>{black['最新更新日期'] || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>法律生效文书确定的义务</td>
                                                                <td colspan="5" className=''>{black['法律生效文书确定的义务'] || '-'}</td>
                                                            </tr>
                                                        </tbody>)
                                                    ) : (
                                                            <tbody>
                                                                <div className='icon_user_abc' >
                                                                    <div></div>
                                                                    <p>暂无数据</p>
                                                                </div>
                                                            </tbody>
                                                        )
                                                }
                                            </table>
                                        </TabPane>
                                        <TabPane tab={`行政处罚(${administrativeSanction ? administrativeSanction.length : 0})`} key="3">
                                            <table className='ddgo_company_credit_table08_003'>
                                                {
                                                    administrativeSanction ? administrativeSanction.map((data, index) => (
                                                        <tbody>
                                                            <tr>
                                                                <th colspan="6">处罚事由：{data.cfSy || '-'}</th>
                                                            </tr>
                                                            <tr>
                                                                <td>处罚名称</td>
                                                                <td colspan="3">{data['cfCfmc'] || '-'}</td>
                                                                <td>处罚机关</td>
                                                                <td>{data.cfXzjg || '-'}</td>
                                                            </tr>
                                                            <tr>

                                                                <td>法人代表</td>
                                                                <td>{data.cfFr || '-'}</td>
                                                                <td>处罚类别</td>
                                                                <td>{data.cfCflb1 || '-'}</td>
                                                                <td>处罚日期</td>
                                                                <td>{data.cfJdrq || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>处罚期限</td>
                                                                <td>{data.cfQx || '-'}</td>
                                                                <td>决定书文号</td>
                                                                <td>{data.cfWsh || '-'}</td>
                                                                <td>更新时间</td>
                                                                <td>{data.cfSjc || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>处罚依据</td>
                                                                <td colspan="5">{data.cfYj || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>处罚结果</td>
                                                                <td colspan="5">{data.cfJg || '-'}</td>
                                                            </tr>
                                                        </tbody>
                                                    )) : (
                                                            <tbody>
                                                                <div className='icon_user_abc' >
                                                                    <div></div>
                                                                    <p>暂无数据</p>
                                                                </div>
                                                            </tbody>
                                                        )
                                                }
                                            </table>
                                        </TabPane>
                                    </Tabs>
                                </div>

                            </div>
                            <div></div>
                            <div className='icon_user_abc' style={{ display: creditCondition ? "" : "none" }}>
                                <p>{(userLevel == 0 || !userLevel) ? "请升级为会员！" : userLevel == 1 ? "请升级为钻石会员！" : "暂无信用数据"}</p>
                            </div>
                        </TabPane>
                        {/* vip用户 */}
                        <TabPane tab="良好行为" key="5">
                            <div className='ddgo_company_goodBehavior_table'>
                                {/*<Table*/}
                                {/*    columns={[*/}
                                {/*        { title: '获奖名称', dataIndex: 'goodsName', key: 'goodsName' },*/}
                                {/*        { title: '获奖等级', dataIndex: 'goodsLevel', key: 'goodsLevel' },*/}
                                {/*        { title: '颁发机构', dataIndex: 'issuingBody', key: 'issuingBody' },*/}
                                {/*        { title: '类别名称', dataIndex: 'goodsType', key: 'goodsType' },*/}
                                {/*        { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },*/}
                                {/*        {*/}
                                {/*            title: '获奖日期', dataIndex: 'awardDate', key: 'awardDate',*/}
                                {/*            render: (text, row, index) => new Date(row.awardDate).format('yyyy/MM/dd')*/}
                                {/*        },*/}
                                {/*        {*/}
                                {/*            title: '详细内容', dataIndex: 'goodsDetail', key: 'index.less', render: (text, row, index) => {*/}
                                {/*                if (text && text.length > 0) {*/}
                                {/*                    return <a href="javascript:void(0);" onClick={this.showDetail.bind(this, row)} className="goodsDetail">*/}
                                {/*                        /!* {row.goodsDetail} *!/*/}
                                {/*                        查看*/}
                                {/*                    </a>*/}
                                {/*                } else {*/}
                                {/*                    return "";*/}
                                {/*                }*/}
                                {/*            }*/}
                                {/*        },*/}
                                {/*    ]}*/}
                                {/*    dataSource={goodsData.list}*/}
                                {/*    loading={goodsLoading}*/}
                                {/*    pagination={{ showSizeChanger: true, showQuickJumper: true, total: goodsData.pagination.total, current: goodsData.pagination.current, pageSize: goodsData.pagination.pageSize, showTotal: () => `共 ${goodsData.pagination.total} 记录` }}*/}
                                {/*    bordered*/}
                                {/*    onChange={this.changeGoodsBehaviorTable}*/}
                                {/*    locale={locale}*/}
                                {/*/>*/}
                                <table className='ddgo_company_goodBehavior_table'>
                                    {
                                        goodsData.list.length > 0 ? goodsData.list.map((data) => (
                                            <tbody style={{ display: 'block', marginBottom: '20px' }}>

                                                <tr>
                                                    <td>获奖等级</td>
                                                    <td>{data.goodsLevel || '-'}</td>
                                                    <td>获奖名称</td>
                                                    <td>{data.goodsName || '-'}</td>
                                                    <td>类别名称</td>
                                                    <td>{data.goodsType}</td>
                                                </tr>
                                                <tr>
                                                    <td>颁发机构</td>
                                                    <td>{data.issuingBody || '-'}</td>
                                                    <td>获奖日期</td>
                                                    <td>{new Date(data.awardDate).format('yyyy-MM-dd') || '----/--/--'}</td>
                                                    <td>项目名称</td>
                                                    <td>{data.projectName || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>详细内容</td>
                                                    <td colspan={5}>{data.goodsDetail || '-'}</td>
                                                </tr>
                                            </tbody>
                                        )) : (
                                                <tbody>
                                                    <div className='icon_user_abc' >
                                                        <div></div>
                                                        <p>暂无数据</p>
                                                    </div>
                                                </tbody>
                                            )
                                    }
                                </table>
                                <Pagination
                                    current={goodsData.pagination.current}
                                    pageSize={goodsData.pagination.pageSize}
                                    showQuickJumper
                                    showSizeChanger
                                    total={goodsData.pagination.total}
                                    showTotal={(total) => `共 ${goodsData.pagination.total} 条`}
                                    style={{ textAlign: "right", display: goodsData.list.length == 0 ? 'none' : '' }}
                                    onChange={this.onChangeGB.bind(this)}
                                    onShowSizeChange={this.onChangeGBSize.bind(this)}
                                />




                            </div>
                        </TabPane>
                        {/* vip用户 */}
                        <TabPane tab="不良行为" key="6">
                            <div className='ddgo_company_badBehavior_table'>
                                {/*<Table*/}
                                {/*    columns={[*/}
                                {/*        { title: '行为代码', dataIndex: 'actionId', key: 'actionId' },*/}
                                {/*        { title: '行为描述', dataIndex: 'badsDetail', key: 'badsDetail' },*/}
                                {/*        { title: '扣除分数', dataIndex: 'reduceScore', key: 'reduceScore' },*/}
                                {/*        { title: '行为事实', dataIndex: 'description', key: 'description' },*/}
                                {/*        { title: '处罚机构', dataIndex: 'punishmentBody', key: 'punishmentBody' },*/}
                                {/*        {*/}
                                {/*            title: '发布有效期', dataIndex: 'endDate', key: 'endDate',*/}
                                {/*            render: (text, row, index) => new Date(row.endDate).format('yyyy/MM/dd')*/}
                                {/*        },*/}
                                {/*    ]}*/}
                                {/*    dataSource={badsData.list}*/}
                                {/*    loading={badsLoading}*/}
                                {/*    pagination={{ showSizeChanger: true, showQuickJumper: true, total: badsData.pagination.total, current: badsData.pagination.current, pageSize: badsData.pagination.pageSize, showTotal: () => `共 ${badsData.pagination.total} 记录` }}*/}
                                {/*    bordered*/}
                                {/*    onChange={this.changeBadsBehaviorTable}*/}
                                {/*    locale={locale}*/}
                                {/*/>*/}

                                <table className='ddgo_company_badBehavior_table'>
                                    {
                                        badsData.list.length > 0 ? badsData.list.map((data) => (
                                            <tbody style={{ display: 'block', marginBottom: '20px', marginTop: '20px' }}>

                                                <tr>
                                                    <td>行为代码</td>
                                                    <td>{data.actionId || '-'}</td>
                                                    <td>扣除分数</td>
                                                    <td>{data.reduceScore}</td>
                                                    <td>发布有效期</td>
                                                    <td>{new Date(data.endDate).format('yyyy-MM-dd') || '----/--/--'}</td>


                                                </tr>
                                                <tr>
                                                    <td>处罚机构</td>
                                                    <td>{data.punishmentBody || '-'}</td>
                                                    <td>行为描述</td>
                                                    <td colspan={4}>{data.badsDetail || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>行为事实</td>
                                                    <td colspan={5}>{data.description || '-'}</td>
                                                </tr>

                                            </tbody>
                                        )) : (
                                                <tbody>
                                                    <div className='icon_user_abc' >
                                                        <div></div>
                                                        <p>暂无数据</p>
                                                    </div>
                                                </tbody>
                                            )
                                    }
                                </table>
                                <Pagination
                                    current={badsData.pagination.current}
                                    pageSize={badsData.pagination.pageSize}
                                    showQuickJumper
                                    showSizeChanger
                                    total={badsData.pagination.total}
                                    showTotal={(total) => `共 ${badsData.pagination.total} 条`}
                                    style={{ textAlign: "right", display: badsData.list.length == 0 ? 'none' : '' }}
                                    onChange={this.onChangeBB.bind(this)}
                                    onShowSizeChange={this.onChangeBBSize.bind(this)}
                                />


                            </div>
                        </TabPane>
                        {/*<Table*/}
                        {/*    columns={yjColumns}*/}
                        {/*    dataSource={achieveData.list}*/}
                        {/*    loading={achieveLoading}*/}
                        {/*    pagination={{ showSizeChanger: true, showQuickJumper: true, total: achieveData.pagination.total, current: achieveData.pagination.current, pageSize: achieveData.pagination.pageSize, showTotal: () => `共 ${achieveData.pagination.total} 记录` }}*/}
                        {/*    bordered*/}
                        {/*    onChange={this.changeAchievementTable}*/}
                        {/*    locale={locale}*/}
                        {/*/>*/}

                        {/*<TabPane tab="Template" key="7">*/}
                        {/*    <div className='ddgo_company_badBehavior_table'>*/}
                        {/*        <List*/}
                        {/*            itemLayout="vertical"*/}
                        {/*            size="large"*/}
                        {/*            bordered={false}*/}
                        {/*            dataSource={achieveData.list}*/}
                        {/*            renderItem={item => (*/}
                        {/*                <List.Item style={{*/}
                        {/*                    // textAlign: 'center',*/}
                        {/*                }}>*/}
                        {/*                    <div>*/}
                        {/*                        /!*<a style={{fontSize: '16px'}}>{item.projectName}</a>*!/*/}
                        {/*                        {this.jump2SourceOrDDgo(item)}*/}
                        {/*                        <Row>*/}
                        {/*                            <Col span={4}>业绩状态：{this.due2ProjectStatus(item.projectStatus)}</Col>*/}
                        {/*                            <Col span={5}>项目类型：{this.due2Blue(item.projectTypeName)}</Col>*/}
                        {/*                            <Col span={5}>项目地址：{this.string2Tooltips(item.projectSite)}</Col>*/}
                        {/*                            <Col span={5}>项目负责人：{item.projectLeader}</Col>*/}
                        {/*                            <Col span={5}>发布时间：{item.bidDate || item.startDate || item.endDate}</Col>*/}
                        {/*                        </Row>*/}
                        {/*                        <Row>*/}
                        {/*                            <Col span={4}>角色主体：{item.role}</Col>*/}
                        {/*                            <Col span={5}>中标金额 ：{this.string2Tooltips(item.bidPrice)}</Col>*/}
                        {/*                        </Row>*/}
                        {/*                    </div>*/}
                        {/*                </List.Item>*/}
                        {/*            )}*/}
                        {/*        />*/}
                        {/*        <Pagination*/}
                        {/*            current={achieveData.pagination.current}*/}
                        {/*            pageSize={achieveData.pagination.pageSize}*/}
                        {/*            showQuickJumper*/}
                        {/*            showSizeChanger*/}
                        {/*            total={achieveData.pagination.total}*/}
                        {/*            showTotal={(total) => `共 ${achieveData.pagination.total} 记录`}*/}
                        {/*            style={{textAlign: "right"}}*/}
                        {/*            onChange={this.onChangePage.bind(this)}*/}
                        {/*            onShowSizeChange={this.onChangeShowSize.bind(this)}*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</TabPane>*/}

                    </Tabs>
                </div>
                <div className='ddgo_zgzxxxgkw_modalBox'>
                    <Modal
                        title="中国执行信息公开网验证码"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        mask="true"
                        onCancel={this.handleCancel}
                    >
                        <Row>
                            <Col md={{ span: 18 }} lg={{ span: 18 }} xl={{ span: 18 }} xxl={{ span: 18 }}>
                                <Input placeholder="请输入验证码" value={captchaValue} onChange={this.changeCaptchaValue} />
                            </Col>
                            <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                                <img src={this.state.imgSrc} onClick={this.changeImageSrc} />
                            </Col>
                        </Row>
                    </Modal>
                    <Modal
                        title="提示"
                        visible={this.state.growUpVisiable}
                        onCancel={this.handleCancel}
                        wrapClassName={"ddgo_company_details_smallBox"}
                        onOk={this.handleGrowUpOk}
                        closable={false}
                    >
                        <p>是否升级为VIP会员？</p>

                    </Modal>
                    <Modal
                        title="详细信息"
                        visible={this.state.detailVisiable}
                        onCancel={this.handleCancel}
                        wrapClassName={"ddgo_company_goodBehavior_table_box"}
                        onOk={this.handleDetailOk}
                        footer={null}
                    >
                        <p>
                            {this.state.goodsDetail}
                        </p>
                    </Modal>
                </div>
            </div>
        )

    }
}
DdgoCompanyDetail = Form.create({})(DdgoCompanyDetail)
export default DdgoCompanyDetail;
