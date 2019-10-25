import React, { Component } from 'react';
import { Row, Col, Form, Button, Icon, Cascader, InputNumber, DatePicker, Drawer, Table, AutoComplete, Select, Modal, Tag, message } from 'antd';
import './ddgo_comprehensive_search.css'
import request from '../../utils/request'
import Utils from '../../utils/appUtils';
import { stringify } from 'qs';
import genelink from '../../utils/linkutil';
import emitter from "../../event";

const FormItem = Form.Item;
class DdgoComprehensive extends Component {
    state = {
        showConditionTip: false,
        visible: false,
        list: [],
        isChange: false,
        loading: false,
        pagination: {},
        formValues: {},
        builderPermitOptions: [],
        personCertOptions: [],
        builderPermitTags: [],
        targetOption5: {},
        targetOption6: {},
        personCertTags: [],
        personMoreCertTags: [],
        personMoreCertConditions: [],
        creditTypeConditions: [],
        performCategory: [],
        isMoreCerts: false,
        creditType: '',
        outerLocation: [],
        innerLocation: [],
        credit5Type: '',
        credit6Type: '',
        achievementType: '',
        projectType: '',
        achievementMoney: '',
        achievementSize: '',
        achievementStart: '',
        achievementEnd: '',
        isLocal: '',
        recordWebsite: '',
        registLocation: '',
        credit1Level: '',
        credit1ValidityDate: '',
        credit2Level: '',
        credit2Province: '',
        credit3Level: '',
        credit4Score: '',
        credit5Level: '',
        credit5Score: '',
        credit6RankStart: '',
        credit6RankEnd: '',
        credit6ScoreStart: '',
        credit6ScoreEnd: '',
        credit7Type: '',
        userLevel: -1,
        credit1ChooseYear: '',
        credit2ChooseYear: '',
    };

    componentDidMount() {
        this.fetchBuilderPermitType();
        this.fetchPersonPermitType();
        this.fetchPerformCategory();
        this.fetchouterLocation();
        this.fetchinnerLocation();
        this.handlerSearch();
        let level = Utils.getUserType();
        let isValid = Utils.isValid();
        let isUser = Utils.isUser();
        //没登录时，即游客绕过"过期"判断
        if(isUser) {
            this.setState({ userLevel: isValid ? level : 0 });
        }else {
            this.setState({ userLevel: -1});
        }

        this.eventEmitter = emitter.addListener("updateUserLevel", (level) => {
            this.setState({
                userLevel: level
            });
        });

    }
    fetchouterLocation = () => {
        request(`/api/builder/location?isLocal=0`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                outerLocation: data,
            });
        })
    }
    fetchinnerLocation = () => {
        request(`/api/builder/location?isLocal=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                innerLocation: data,
            });
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
            data = data.filter(i => i.projectTypeName != "勘察" && i.projectTypeName != "设计" && i.projectTypeName != "监理")
            this.setState({
                performCategory: data,
            });
        })
    }
    fetchBuilderPermitType = () => {
        let REQUEST_URL = "/api/builder/permitList";
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            data.map(m => {
				m.children.map(ch => {
					if(ch.children){
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
            let convertData = JSON.stringify(data).split('permitTypeId').join('value').split('permitTypeName').join('label')
            .split('permitItemId').join('value').split('permitItemName').join('label')
            .split('permitLevelNum').join('value').split('permitLevelName').join('label');
            let jsonData = JSON.parse(convertData);
            // jsonData.map(function (value, key) {
            //     let isleaf = { isLeaf: false };
            //     return Object.assign(value, isleaf);
            // });

            this.setState({
                builderPermitOptions: jsonData,
            });
            console.log(jsonData)
        })
    }
    fetchPersonPermitType = () => {
        let REQUEST_URL = "/api/person/permitList";
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let convertData = JSON.stringify(data).split('personCertTypeId').join('value').split('personCertTypeName').join('label')
                .split('personCertItemId').join('value').split('personCertItemName').join('label')
                .split('personCertLevelNo').join('value').split('personCertLevelName').join('label');
            // console.log(convertData)
            let jsonData = JSON.parse(convertData);
            // jsonData.map(function (value, key) {
            //     let isleaf = { isLeaf: false };
            //     return Object.assign(value, isleaf);
            // });
            this.setState({
                personCertOptions: jsonData,
            });
        })
    }
    // fetchBuilderPermitItem = (targetOption) => {
    //     const { value } = targetOption;
    //     this.setState({ targetOption8: targetOption });
    //     let REQUEST_URL = `/api/builder/permit/items/${value}`;
    //     request(REQUEST_URL, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }, (data) => {
    //         let convertData = JSON.stringify(data).split('permitItemId').join('value').split('permitItemName').join('label');
    //         let jsonData = JSON.parse(convertData);
    //         jsonData.map(function (value, key) {
    //             let isleaf = { isLeaf: false };
    //             return Object.assign(value, isleaf);
    //         });
    //         this.state.targetOption8.children = jsonData;
    //         this.setState({
    //             children: this.state.targetOption8.children,
    //         });
    //     })
    // }
    // fetchBuilderPermitLevel = (targetOption) => {
    //     const { value } = targetOption;
    //     this.setState({ targetOption7: targetOption });
    //     let REQUEST_URL = `/api/builder/permit/levels/${value}`;
    //     request(REQUEST_URL, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }, (data) => {
    //         let convertData = JSON.stringify(data).split('permitLevelNum').join('value').split('permitLevelName').join('label');
    //         let jsonData = JSON.parse(convertData);
    //         jsonData.map(function (value, key) {
    //             let isleaf = { isLeaf: true };
    //             return Object.assign(value, isleaf);
    //         });
    //         this.state.targetOption7.children = jsonData;
    //         this.setState({
    //             children: this.state.targetOption7.children,
    //         });
    //     })
    // }
    handleSearchChange = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            let { builderPermitTags, personCertTags, isMoreCerts, creditType, achievementType, projectType, achievementMoney, achievementSize,
                achievementStart, achievementEnd, isLocal, recordWebsite, registLocation, credit1Level, credit1ValidityDate, credit2Level,
                credit2Province, credit3Level, credit4Score, credit5Type, credit5Level, credit5Score, credit6Type, credit6RankStart, credit6RankEnd,
                credit6ScoreStart, credit6ScoreEnd, credit7Type, pagination, personMoreCertConditions, credit1ChooseYear, credit2ChooseYear } = this.state;
            console.log(personMoreCertConditions)
            let paramTags = builderPermitTags.map(tag => tag.split(':')[0]).join(',');
            let paramCertTag = personCertTags.map(tag => tag.split(':')[0]).join(',');
            let pt = achievementType.split(':');
            let ptId = '';
            let pn = '';
            if (pt.length > 0) {
                ptId = pt[1];
                pn = pt[0];
            }
            if (pn == '不限') {
                pn = "";
            }
            let creditCondition = []

            if (credit1Level || credit1ValidityDate || credit1ChooseYear || creditType == 1) {
                creditCondition.push({
                    creditType: 1,
                    level: this.countLevels(credit1Level.split(':')[0]),
                    expiredDate: credit1ValidityDate,
                    publicDate: credit1ChooseYear.split(':')[1],
                });
            }
            if (credit2Level || credit2Province || credit2ChooseYear || creditType == 2) {
                creditCondition.push({
                    creditType: 2,
                    level: this.countLevels(credit2Level.split(':')[0]),
                    province: credit2Province.split(':')[0],
                    evalYear: credit2ChooseYear.split(':')[1],
                });
            }
            if (credit3Level || creditType == 3) {
                creditCondition.push({
                    creditType: 3,
                    level: this.countLevels(credit3Level.split(':')[0]),
                });
            }
            if (credit4Score || creditType == 4) {
                creditCondition.push({
                    creditType: 4,
                    creditScore: credit4Score,
                });
            }
            if (credit5Level || credit5Score || credit5Type || creditType == 5) {
                creditCondition.push({
                    creditType: 5,
                    creditChengduType: credit5Type ? credit5Type.split(':')[1] : '',
                    level: this.countLevels(credit5Level.split(':')[0]),
                    creditScore: credit5Score,
                });
            }
            if (credit6Type || (credit6RankStart && credit6RankEnd) || (credit6ScoreStart && credit6ScoreEnd) || creditType == 6) {
                creditCondition.push({
                    creditType: 6,
                    rankChengduType: credit6Type.split(':')[0],
                    score60Start: credit6ScoreStart,
                    score60End: credit6ScoreEnd,
                    rank60Start: credit6RankStart,
                    rank60End: credit6RankEnd,
                });
            }
            if (credit7Type || creditType == 7) {
                creditCondition.push({
                    creditType: 7,
                    creditChinaType: credit7Type.split(':')[0],
                });
            }
            // console.log(creditCondition)
            let location = registLocation.split(':')[0];
            let website = recordWebsite.split(':')[0];
            projectType = projectType.split(':')[0];
            // let publicDate = credit1ChooseYear.split(':')[1];
            // let evalYear = credit2ChooseYear.split(':')[1];
            const param = {
                projectStart: achievementStart,
                projectEnd: achievementEnd,
                builderPermits: paramTags,
                personPermits: paramCertTag,
                // currentPage: pagination.current,
                // pageSize: pagination.pageSize,
                projectPrice: achievementMoney ? achievementMoney * 10000 : achievementMoney,
                projectNum: achievementSize,
                isLocal: isLocal=='-1' ? '' : isLocal,
                recordWebsite: website,
                projectType: ptId >= 0 ? ptId : '',
                projectName: ptId >= 0 ? '' : pn,
                projectStatus: projectType == -1 ? '' : projectType,
                location: location,
                personMoreCertConditions: personMoreCertConditions,
                creditConditions: creditCondition,
                // publicDate: publicDate,
                // evalYear: evalYear
            };
            console.log(param)
            // 判断资质证书条件，人员条件，一人多证等条件是否已选
            // if((personMoreCertConditions && personMoreCertConditions.length) ||  (paramCertTag && paramCertTag.length) || (paramTags && paramTags.length)) {
            //     if(!showConditionTip) {
            //         this.setState({ visible: true }, () => {
            //             showConditionTip = true;
            //             localStorage.setItem("condition-tip", true)
            //         });
            //     }
            // }

            this.setState({
                formValues: param
            })
            this.handlerSearch(param);
        });
    }

    handlerSearch = (param) => {
        let REQUEST_URL = `/api/builder/filter/composite?${stringify(param)}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let { pageSize, current } = data.pagination;
            let startno = (current - 1) * pageSize;
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
        })
    }
    handleBuilderPermitChange = (val, selectedOptions) => {
        console.log(val)
        if (val.length === 0) {
            return;
        }
        let state = this.state;
        let { builderPermitTags } = state;
        let SelectedKeys = selectedOptions.map(o => o.value).join('/'); // 1/1/1
        let SelectedVals = selectedOptions.map(o => o.label).join('/'); // a/b/c
        let forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];

        const forSectedkey2 = SelectedKeys.split("/")[0] + "/";
        let result;
        if(SelectedKeys.split('/').length===2) {
            result = builderPermitTags.find(item => item.split(':')[0].startsWith(forSectedkey2) && item.split(':')[1].endsWith("级") == true);
        }else {
            result = builderPermitTags.find(item => item.split(':')[0].startsWith(forSectedkey) == true); // 去除重复的项
        }

        if (result != undefined) { // 同类型同项目有重复，不再添加
            builderPermitTags = this.state.builderPermitTags.filter(tag => tag !== result);
        }
        const text = `${SelectedKeys}:${SelectedVals}`;
        if (builderPermitTags.indexOf(text) === -1) {
            builderPermitTags = [...builderPermitTags, text];
            // console.log(builderPermitTags);
            this.setState({
                builderPermitTags,
            }, () => {
                this.handleSearchChange();
            });
        }
        setTimeout(() => {
            //   清空
            this.props.form.setFieldsValue({
                builderPermits: [],
            })
        }, 100);
    }
    loadBuilderPermitData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        let len = selectedOptions.length;
        if (len == 1) {
            this.fetchBuilderPermitItem(targetOption);
        } else {
            this.fetchBuilderPermitLevel(targetOption);
        }
    }
    closeBuilderPermitTag = (removedTag, isSearch = true, event) => {
        // console.log(removedTag)
        let { builderPermitTags } = this.state;
        // console.log(builderPermitTags)
        builderPermitTags = builderPermitTags.filter(tag => tag !== removedTag)
        this.setState({
            builderPermitTags: builderPermitTags,
            isChange: true,
        }, () => {
            if (isSearch) this.handleSearchChange();
        })
    }
    closePersonCertTag = (removedTag, isSearch = true, event) => {
        // console.log(removedTag)
        let { personCertTags } = this.state;
        // console.log(personCertTags)
        personCertTags = personCertTags.filter(tag => tag !== removedTag)
        this.setState({
            personCertTags: personCertTags,
            isChange: true,
        }, () => {
            if (isSearch) this.handleSearchChange();
        })
    }
    closeMorePersonCertTag = (removedTag, isSearch = true, event) => {
        // console.log(removedTag)
        let { personMoreCertConditions } = this.state;
        // console.log(personMoreCertConditions);
        delete personMoreCertConditions[removedTag];
        this.setState({
            personMoreCertConditions: personMoreCertConditions,
            isChange: true,
        }, () => {
            if (isSearch) this.handleSearchChange();
        })
    }
    handlePersonCertsPermitClose = (removedTag) => {
        let { personMoreCertTags } = this.state;
        personMoreCertTags = personMoreCertTags.filter(tag => tag !== removedTag)
        this.setState({ personMoreCertTags })
    }
    loadPersonPermitData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // targetOption.loading = true;
        let len = selectedOptions.length;
        if (len == 1) {
            this.fetchPersonPermitItem(targetOption);
        } else {
            this.fetchPersonPermitLevel(targetOption);
        }
    };
    fetchPersonPermitItem = (targetOption) => {
        const { value } = targetOption;
        this.setState({ targetOption5: targetOption });
        let REQUEST_URL = `/api/person/permit/items/${value}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            let convertData = JSON.stringify(data).split('personCertItemId').join('value').split('personCertItemName').join('label');
            let jsonData = JSON.parse(convertData);
            jsonData.map(function (value, key) {
                let isleaf = { isLeaf: false };
                return Object.assign(value, isleaf);
            });
            this.state.targetOption5.children = jsonData;
            this.setState({
                children: this.state.targetOption5.children,
            });
        })
    }
    fetchPersonPermitLevel = (targetOption) => {
        const { value } = targetOption;
        this.setState({ targetOption6: targetOption });
        let REQUEST_URL = `/api/person/permit/levels/${value}`;
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data, ) => {
            let convertData = JSON.stringify(data).split('personCertLevelNo').join('value').split('personCertLevelName').join('label');
            let jsonData = JSON.parse(convertData);
            jsonData.map(function (value, key) {
                let isleaf = { isLeaf: true };
                return Object.assign(value, isleaf);
            });
            this.state.targetOption6.children = jsonData;
            this.setState({
                children: this.state.targetOption6.children,
            });
        })
    }
    handlePersonPermitChange = (val, selectedOptions) => {
        if (val.length === 0) {
            return;
        }
        let { personCertTags } = this.state;
        const SelectedKeys = selectedOptions.map(o => o.value).join('/');
        const SelectedVals = selectedOptions.map(o => o.label).join('/');
        const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
        const forSectedkey2 = SelectedKeys.split("/")[0] + "/";
        let result;
        if(SelectedKeys.split('/').length===2) {
            result = personCertTags.find(item => item.split(':')[0].startsWith(forSectedkey2) && item.split(':')[1].endsWith("级") == true);
        }else {
            result = personCertTags.find(item => item.split(':')[0].startsWith(forSectedkey) && item.split(':')[1].endsWith("级") == true);
        }
        if (result != undefined) { // 同类型同项目有重复，不再添加
            personCertTags = this.state.personCertTags.filter(tag => tag !== result);
        }
        const text = `${SelectedKeys}-1:${SelectedVals}`;
        if (personCertTags.indexOf(text) === -1) {
            personCertTags = [...personCertTags, text];
            this.setState({
                personCertTags,
                visible: true
            }, () => {
                this.handleSearchChange();
            });
        }
        setTimeout(() => {
            this.props.form.setFieldsValue({
                personPermits: [],
            })
        }, 100);
    }
    handlePersonCertsPermitChange = (val, selectedOptions) => {
        if (val.length === 0) {
            return;
        }
        let { personMoreCertTags } = this.state;
        const SelectedKeys = selectedOptions.map(o => o.value).join('/');
        const SelectedVals = selectedOptions.map(o => o.label).join('/');
        const forSectedkey = SelectedKeys.split("/")[0] + "/" + SelectedKeys.split("/")[1];
        const forSectedkey2 = SelectedKeys.split("/")[0] + "/";
        let result;
        if(SelectedKeys.split('/').length===2) {
            result = personMoreCertTags.find(item => item.split(':')[0].startsWith(forSectedkey2) && item.split(':')[1].endsWith("级"));
        }else {
            result = personMoreCertTags.find(item => item.split(':')[0].startsWith(forSectedkey) && item.split(':')[1].endsWith("级"));
        }

        if (result != undefined) { // 同类型同项目有重复，不再添加
            personMoreCertTags = this.state.personMoreCertTags.filter(tag => tag !== result);
        }
        const text = `${SelectedKeys}:${SelectedVals}`;
        if (personMoreCertTags.indexOf(text) === -1) {
            personMoreCertTags = [...personMoreCertTags, text];
            this.setState({
                personMoreCertTags,
            });
        }
        setTimeout(() => {
            this.props.form.setFieldsValue({
                personCertsPermits: [],
            })
        }, 100);
    }
    changePersonCertNum = (index, val) => {
        let { personCertTags } = this.state;
        if (personCertTags.length <= index) {
            return;
        }
        let tag = personCertTags[index];
        let splitTag = tag.split(':');
        let split = splitTag[0].split('-');
        split[1] = val;
        splitTag[0] = split.join('-');
        tag = splitTag.join(':');
        personCertTags[index] = tag;
        // console.log(personCertTags)
        this.setState({
            personCertTags: personCertTags,
            isChange: true,
        });
    }
    changeMorePersonCertNum = (key, val) => {
        let { personMoreCertConditions } = this.state;
        personMoreCertConditions[key] = val;
        // console.log(personMoreCertConditions)
        this.setState({
            personMoreCertConditions: personMoreCertConditions,
            isChange: true,
        });
    }
    handleIsLocalChange = (value) => {
        const { form } = this.props;
        form.resetFields('registLocation');
        this.setState({
            isLocal: value,
        });
        // this.changeSearch({ isLocal: value });
    }

    handleCompositeTableChange = (pagination, filtersArg, sorter) => {
        // console.log(pagination)
        const {userLevel} = this.state;
        if(userLevel <= 0) {
            this.popUpLoginModal(userLevel);
            return;
        }
        this.setState({ pagination }, () => {
            let { formValues } = this.state;
            this.handlerSearch({
                ...formValues,
                currentPage: pagination.current,
                pageSize: pagination.pageSize
            });
        })
    }
    showDrawer = () => {
        this.setState({
            visible: true,
            isChange: false,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
        if (this.state.isChange) {
            this.handleSearchChange();
        }
    };
    changeIsMoreCerts = (event) => {
        this.setState({
            isMoreCerts: event.target.checked
        }, () => {
            this.handleSearchChange();
        })
    }
    changeCreditTypes = (val) => {

        let { creditType, creditTypeConditions, credit1Level, credit1ValidityDate, credit2Level, credit2Province, credit3Level, credit4Score, credit5Level,
            credit5Score, credit6Type, credit6RankStart, credit6RankEnd, credit6ScoreStart, credit6ScoreEnd, credit7Type, credit1ChooseYear, credit2ChooseYear } = this.state;
        if (val == undefined) {
            creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
        } else {
            creditTypeConditions = creditTypeConditions.filter(i => i != val)
            if (creditType == 1) {
                if (!credit1Level && !credit1ValidityDate && !credit1ChooseYear) {// 1旗下没数据就过滤掉1的数据
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 2) {
                if (!credit2Level && !credit2Province && !credit2ChooseYear) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 3) {
                if (!credit3Level) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 4) {
                if (!credit4Score) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 5) {
                if (!credit5Level && !credit5Score) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 6) {
                if (!credit6Type && !credit6RankStart && !credit6RankEnd && !credit6ScoreStart && !credit6ScoreEnd) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            if (creditType == 7) {
                if (!credit7Type) {
                    creditTypeConditions = creditTypeConditions.filter(i => i != creditType)
                }
            }
            creditTypeConditions = [val, ...creditTypeConditions]
        }

        this.setState({
            creditType: val,
            creditTypeConditions: creditTypeConditions
        }, () => {
            this.handleSearchChange();
        })
        console.log('changeCreditTypes', val, creditTypeConditions)
    }
    changeCredit5Type = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit5Type: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit5Type: '' })
        }
    }
    credit6TypeChange = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit6Type: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit6Type: '' })
        }
    }
    changeAchievementTypes = (val) => {
        // val = -1;
        if (val) {
            let achievementTypes = this.state.performCategory;
            let result = -2;
            for (let i in achievementTypes) {
                if (achievementTypes[i].projectTypeName == val) {
                    result = achievementTypes[i].projectTypeId;
                    break;
                }
            }
            this.setState({ achievementType: `${val}:${result}` }, () => {
                this.handleSearchChange();
            });
        } else {
            this.setState({ achievementType: '' });
        }
    }
    changeProjectTypes = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ projectType: `${val}:${label}` }, () => {
                this.handleSearchChange();
            });
        } else {
            this.setState({ projectType: '' })
        }
    }
    changeAchievementMoney = (val) => {
        this.setState({ achievementMoney: val }, () => {
            this.handleSearchChange();
        });
    }
    changeAchievementSize = (val) => {
        this.setState({ achievementSize: val }, () => {
            this.handleSearchChange();
        });
    }
    changeAchievementStart = (date, format) => {
        this.setState({ achievementStart: format }, () => {
            this.handleSearchChange();
        })
    }
    changeAchievementEnd = (date, format) => {
        this.setState({ achievementEnd: format }, () => {
            this.handleSearchChange();
        })
    }
    changeRecordWebsite = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ recordWebsite: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ recordWebsite: '' })
        }

    }
    changeRegistLocation = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ registLocation: `${val}:${label}` }, () => {
                this.handleSearchChange();
            });
        } else {
            this.setState({ registLocation: "" });
        }
    }
    changeCredit1Level = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit1Level: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit1Level: '' })
        }
    }
    changeCredit2Level = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit2Level: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit2Level: '' })
        }
    }
    changeCredit1ValidityDate = (date, format) => {
        this.setState({ credit1ValidityDate: format })
    }
    changeCredit1ChooseYear = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit1ChooseYear: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit1ChooseYear: '' })
        }
    }
    changeCredit2ChooseYear = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit2ChooseYear: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit2ChooseYear: '' })
        }
    }
    changeCredit2Province = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit2Province: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit2Province: '' })
        }
    }
    changeCredit3Level = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit3Level: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit3Level: '' })
        }
    }
    changeCredit4Score = (val) => {
        this.setState({ credit4Score: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit5Level = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit5Level: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit5Level: '' })
        }
    }
    changeCredit5Score = (val) => {
        this.setState({ credit5Score: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit6RankStart = (val) => {
        this.setState({ credit6RankStart: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit6RankEnd = (val) => {
        this.setState({ credit6RankEnd: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit6ScoreStart = (val) => {
        this.setState({ credit6ScoreStart: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit6ScoreEnd = (val) => {
        this.setState({ credit6ScoreEnd: val }, () => {
            this.handleSearchChange();
        })
    }
    changeCredit7Type = (val, dom) => {
        if (val) {
            let label = dom.props.children;
            this.setState({ credit7Type: `${val}:${label}` }, () => {
                this.handleSearchChange();
            })
        } else {
            this.setState({ credit7Type: "" })
        }
    }
    handleMoreCertsOk = (e) => {
        let { personMoreCertTags } = this.state;
        let personCertsNumber = this.props.form.getFieldValue('personCertsNumber');
        if (personMoreCertTags && personMoreCertTags.length > 0) {
            let { personMoreCertConditions } = this.state;
            personMoreCertConditions[personMoreCertTags] = personCertsNumber;
            this.setState({
                personMoreCertConditions: personMoreCertConditions,
                personMoreCertTags: [],
            }, () => {
                this.handleSearchChange();
            });
        }
        this.setState({ isMoreCerts: false })
        this.resetPersonCertsModal()
    }
    handleMoreCertsCancel = (e) => {
        this.setState({ isMoreCerts: false })
        this.resetPersonCertsModal();
    }
    resetPersonCertsModal = () => {
        this.props.form.resetFields(["personCertsPermits", "personCertsNumber"]);
    }
    showMoreCerts = (e) => {
        this.setState({
            isMoreCerts: true
        })
    }

    countLevels = (level) => {
        let arr = ['A', 'B', 'C', 'D']
        let result = [];
        if (level && level.length > 0) {
            let len = level.length;
            let first = level[0];
            let index = arr[0] == first ? 0 : arr[1] == first ? 1 : arr[2] == first ? 2 : arr[3] == first ? 3 : -1;
            if (index >= 0) {
                for (let i = 0; i < index; i++) {
                    result.push(arr[i] + arr[i] + arr[i])
                    result.push(arr[i] + arr[i])
                    result.push(arr[i])
                }
                if (len == 2) {
                    result.push(first + first + first)
                } else if (len == 1) {
                    result.push(first + first + first)
                    result.push(first + first)
                }
                if (level == 'A++') { }
                else if (level == 'A+') {
                    result.push("A++")
                } else {
                    result.push("A++")
                    result.push("A+")
                }
                result.push(level);
                return result.join(",");
            } else {
                return "";
            }
        }
        return "";
    }

    resetForm = () => {
        this.props.form.resetFields();
        this.setState({
            builderPermitTags: [],
            personCertTags: [],
            creditTypeConditions: [],
            isMoreCerts: false,
            creditType: '',
            credit5Type: '',
            credit6Type: '',
            achievementType: '',
            projectType: '',
            credit1ChooseYear: '',
            credit2ChooseYear: '',
            achievementMoney: '',
            achievementSize: '',
            achievementStart: '',
            achievementEnd: '',
            isLocal: '',
            recordWebsite: '',
            registLocation: '',
            credit1Level: '',
            credit1ValidityDate: '',
            credit2Level: '',
            credit2Province: '',
            credit3Level: '',
            credit4Score: '',
            credit5Level: '',
            credit5Score: '',
            credit6RankStart: '',
            credit6RankEnd: '',
            credit6ScoreStart: '',
            credit6ScoreEnd: '',
            credit7Type: '',
            visible: false,
            personMoreCertConditions: [],
        }, () => {
            this.handlerSearch({});
        })
    }
    countOtherConditionLength = () => {
        let length = 0;
        let { recordWebsite, isLocal, registLocation, isMoreCerts } = this.state;
        if (recordWebsite) { length++ }
        if (isLocal) {
            length++;
            if (registLocation) { length++ }
        }
        // if (isMoreCerts) { length++ }
        return length;
    }
    countAchievementConditionLength = () => {
        let { achievementType, projectType, achievementMoney, achievementSize, achievementStart, achievementEnd } = this.state;
        let length = 0;
        if (achievementType) { length++; }
        if (projectType) { length++; }
        if (achievementMoney) { length++; }
        if (achievementSize) { length++; }
        // if (achievementStart && achievementEnd) { length++; }
        if (achievementStart) { length++; }
        return length;
    }
    countCreditConditionLength = () => {
        let { creditTypeConditions, creditType, credit1Level, credit1ValidityDate, credit2Level, credit2Province, credit3Level, credit4Score, credit5Level,
            credit5Score, credit6Type, credit6RankStart, credit6RankEnd, credit6ScoreStart, credit6ScoreEnd, credit7Type, credit1ChooseYear, credit2ChooseYear } = this.state;
        let length = 0;
        if (creditTypeConditions) { length += creditTypeConditions.length }
        for (let type of creditTypeConditions) {
            if (type == 1) {
                if (credit1Level) { length++ }
                if (credit1ValidityDate) { length++ }
                if (credit1ChooseYear) { length++ }
            }
            if (type == 2) {
                if (credit2Level) { length++ }
                if (credit2Province) { length++ }
                if (credit2ChooseYear) { length++ }
            }
            if (type == 3) {
                if (credit3Level) { length++ }
            }
            if (type == 4) {
                if (credit4Score) { length++ }
            }
            if (type == 5) {
                if (credit5Level) { length++ }
                if (credit5Score) { length++ }
            }
            if (type == 6) {
                if (credit6Type) { length++ }
                if (credit6RankStart && credit6RankEnd) { length++ }
                if (credit6ScoreStart && credit6ScoreEnd) { length++ }
            }
            if (type == 7) {
                if (credit7Type) { length++ }
            }
        }

        return length;
    }

    countCredit6Length = () => {
        let { creditTypeConditions, credit6Type, credit6RankStart, credit6RankEnd, credit6ScoreStart, credit6ScoreEnd, } = this.state;
        let credit6Length = 0;
        for (let type of creditTypeConditions) {
            if (type == 6) {
                if (credit6Type) { credit6Length++ }
                if (credit6RankStart && credit6RankEnd) { credit6Length++ }
                if (credit6ScoreStart && credit6ScoreEnd) { credit6Length++ }
            }
        }
        return credit6Length;
    }

    conditionClose = (condition, condition2, condition3) => {
        let state = this.state;
        state[condition] = '';
        if (condition2) {
            state[condition2] = '';
        }
        if (condition3) {
            state[condition3] = '';
        }
        state['isChange'] = true;
        this.setState(state, () => {
            this.props.form.resetFields([condition, condition2, condition3])
        });
    }

    conditionCreditClose = (item, condition, condition2, condition3, condition4) => {
        let state = this.state;
        let cons = state['creditTypeConditions'];
        state[condition] = '';
        if (condition2) {
            state[condition2] = '';
        }
        if (condition3) {
            state[condition3] = '';
        }
        if (condition4) {
            state[condition4] = '';
        }
        cons.splice(cons.indexOf(item), 1);
        // state['creditTypeConditions'] = cons;
        state['isChange'] = true;
        this.setState(state, () => {
            this.props.form.resetFields([condition, condition2, condition3, condition4])
        });
    }

    conditionCredit6Close = (length, condition, condition2, condition3) => {
        let state = this.state;
        let cons = state['creditTypeConditions'];
        state[condition] = '';
        if (condition2) {
            state[condition2] = '';
        }
        if (condition3) {
            state[condition3] = '';
        }
        if(length===1) {
            condition3 = 'creditSource';
            state[condition3] = '';
            cons.splice(cons.indexOf('6'), 1);
        }
        state['isChange'] = true;
        this.setState(state, () => {
            this.props.form.resetFields([condition, condition2, condition3])
        });

    }

    growUpTip = (e) => {
        e.preventDefault();
        window.open("/user");
    }

    showTip = () => {
        message.info("功能升级优化中，敬请期待！");
    }

    disableProjectdDate = (date) => {
        // 1356969600000 2013/1/1 上午12:00:00
        return date && (date.valueOf() < 1356969600000 || date.valueOf() > new Date().getTime());
    }

    popUpLoginModal = (level) => {
        switch (level) {
            case -1:
                emitter.emit("loginModal", true);
                break;
            case 0:
                message.info('请升级为会员！');
                break;
        }
    }

    render() {
        let { outerLocation, innerLocation, creditType, creditTypeConditions, credit5Type, credit6Type, builderPermitTags, personCertTags, isMoreCerts, performCategory
            , achievementType, projectType, achievementMoney, achievementSize, achievementStart, achievementEnd, recordWebsite, userLevel,
            isLocal, registLocation, credit1Level, credit1ValidityDate, credit2Level, credit2Province, credit3Level, credit4Score, personMoreCertConditions,
            credit5Level, credit5Score, credit6RankStart, credit6RankEnd, credit6ScoreStart, credit6ScoreEnd, credit7Type, personMoreCertTags,
            credit1ChooseYear, credit2ChooseYear } = this.state;
        console.info('render zuhe search!!!!');
        const yearFormat = 'YYYY';
        const dateFormat = 'YYYY-MM-DD';
        const monthFormat = 'YYYY-MM';
        const creditTypes = [
            {
                name: "全国水利建设市场信用信息",
                value: 1
            },
            {
                name: "全国公路建设市场信用信息",
                value: 2
            },
            {
                name: "信用交通-四川",
                value: 3
            },
            {
                name: "四川建筑行业共享平台信用评分",
                value: 4
            },
            {
                name: "成都工程招标投标-施工类信用信息",
                value: 5
            },
            {
                name: "成都建筑市场信用信息排名",
                value: 6
            },
            {
                name: "信用中国",
                value: 7
            }
        ]
        const achievementTypes = performCategory.map(o => o.projectTypeName);

        const columns = [
            {
                title: '序号',
                dataIndex: 'no',
            },
            {
                title: '企业名称',
                dataIndex: 'builderName',
                align: 'center',
                render: (text, row, index) => {
                    return userLevel<=0 ? (<a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>
                            {row.builderName.replace(row.builderName.substring(2, 8), '******')}</a>) :
                        (<a target="_blank" href={genelink('/show/ente/' + row.builderId, false)}>{row.builderName}</a>)
                }
            },
            {
                title: '法定代表人',
                dataIndex: 'legalPerson',
                render: (text, row) => {
                    return userLevel<=0 ? (<span>{row.legalPerson.replace(row.legalPerson.substring(0, 1), '*')}</span>) : (<span>{row.legalPerson}</span>)
                }
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'builderIDCard',
                render: (text, row) => {
                    return userLevel<=0 ? (<span>{row.builderIDCard.replace(row.builderIDCard.substring(5, 11), '******')}</span>) : (<span>{row.builderIDCard}</span>)
                }
            },
            {
                title: '属地',
                dataIndex: 'location',
            },
            {
                title: '操作',
                dataIndex: 'builderId',
                render: val => {
                    return userLevel<=0 ? (<a target="_blank" onClick={this.popUpLoginModal.bind(this, userLevel)}>查看</a>):
                        (<a target="_blank" href={genelink('/show/ente/' + val, false)}>查看</a>)
                }

            },
        ];
        const { getFieldDecorator } = this.props.form;
        let otherConditionLength = this.countOtherConditionLength();
        let achievementConditionLength = this.countAchievementConditionLength();
        let creditConditionLength = this.countCreditConditionLength();
        let credit6Length = this.countCredit6Length();
        let personMoreCertsLength = Object.keys(personMoreCertConditions).length;
        let conditionsLength = creditConditionLength + achievementConditionLength
            + builderPermitTags.length + personCertTags.length + otherConditionLength + personMoreCertsLength;
        // console.log(!!(credit6ScoreStart && credit6ScoreEnd))
        let enteLocation;
        // console.log(isLocal)
        if (isLocal == 1) {
            enteLocation = innerLocation;
        } else if (isLocal !== "" && isLocal == 0) {
            enteLocation = outerLocation;
        } else {
            enteLocation = [];
        }
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.pagination.total,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            showTotal: () => `总共 ${this.state.pagination.total} 记录`
        };
        return (
            <div className='ddgo_comprehensive_search'>
                <Form>
                    <Row className='ddgo_comprehensive_box'>
                        <Col className="nomal" md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                            <Row>
                                <Col className='ddgo_comprehensive_titel'>
                                    <div className='ddgo_comprehensive_smalltitel01'>
                                        <div>
                                            <i className='ddgo_userI01'></i>
                                            <span>|</span>
                                            <span>普通会员</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="企业资质">
                                        {getFieldDecorator('builderPermits')(
                                            <Cascader
                                                options={this.state.builderPermitOptions}
                                                loadData={this.loadBuilderPermitData}
                                                onChange={this.handleBuilderPermitChange}
                                                allowClear={true}
                                                placeholder="请选择..."
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="人员证书">
                                        {getFieldDecorator('personPermits')(
                                            <Cascader
                                                options={this.state.personCertOptions}
                                                // loadData={this.loadPersonPermitData}
                                                onChange={this.handlePersonPermitChange}
                                                placeholder="请选择..." />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="川内川外" >
                                        {getFieldDecorator('isLocal')(
                                            <Select placeholder="请选择" onChange={this.handleIsLocalChange} allowClear="true">
                                                <Select.Option value="-1">不限</Select.Option>
                                                <Select.Option value="1">川内</Select.Option>
                                                <Select.Option value="0">川外</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="注册地区" >
                                        {getFieldDecorator('registLocation')(
                                            <Select placeholder="请选择" onChange={this.changeRegistLocation} allowClear="true">
                                                <Select.Option value="">不限</Select.Option>
                                                {
                                                    enteLocation.map(lo => <Select.Option key={lo}>{lo}</Select.Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="modal vip" md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                            {/*<div className="blackModal" style={{ display: userLevel >= 1 ? "none" : "" }}>*/}
                            {/*    <button className="blackModal_but01" onClick={this.growUpTip}>升级为VIP会员</button>*/}
                            {/*</div>*/}

                            <Row className="ddgo_UserRights-box">
                                <Col className='ddgo_comprehensive_titel'>
                                    <div className='ddgo_comprehensive_smalltitel02'>
                                        <div>
                                            <i></i>
                                            <span>|</span>
                                            <span>VIP会员</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem className='FilingWebsite' label="一人多证">
                                        <Button placeholder="请选择" style={{width:'100%',color: '#bfbfbf', textAlign: 'left'}} onClick={() => {this.setState({isMoreCerts: true})}}>请选择</Button>
                                        {/*<Button placeholder="功能升级中..." style={{width:'100%',color: '#bfbfbf', textAlign: 'left'}} onClick={() => { message.info("功能升级中，敬请期待。") }}>功能升级中...</Button>*/}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem className='FilingWebsite' label="备案网站">
                                        {getFieldDecorator('recordWebsite')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeRecordWebsite}>
                                                <Select.Option value="1">全国公路建设市场信用信息管理系统</Select.Option>
                                                <Select.Option value="2">全国水利建设市场信用信息平台</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="信用来源" >
                                        {getFieldDecorator('creditSource')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCreditTypes}>
                                                <Select.Option value="">不限</Select.Option>
                                                {
                                                    creditTypes.map(lo => <Select.Option key={lo.value}>{lo.name}</Select.Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {/* 全国水利建设市场信用信息  */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 1 ? "block" : "none" }}>
                                    <FormItem label="选择年份" >
                                        {getFieldDecorator('credit1ChooseYear')(
                                            <Select placeholder="选择年份" onChange={this.changeCredit1ChooseYear} allowClear="true">
                                                <Select.Option value="0">2019</Select.Option>
                                                <Select.Option value="1">2018</Select.Option>
                                                <Select.Option value="2">2017</Select.Option>
                                                <Select.Option value="3">2016</Select.Option>
                                                <Select.Option value="4">2015</Select.Option>
                                                <Select.Option value="5">2014</Select.Option>
                                                <Select.Option value="6">2013</Select.Option>
                                                <Select.Option value="7">2012</Select.Option>
                                                <Select.Option value="8">2011</Select.Option>
                                                <Select.Option value="9">2010</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 1 ? "block" : "none" }}>
                                    <FormItem label="等级">
                                        {getFieldDecorator('credit1Level')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit1Level}>
                                                <Select.Option value="AAA">AAA</Select.Option>
                                                <Select.Option value="AA">AA</Select.Option>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="BBB">BBB</Select.Option>
                                                <Select.Option value="CCC">CCC</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 1 ? "block" : "none" }}>
                                    <FormItem label="有效期" >
                                        {getFieldDecorator('credit1ValidityDate')(
                                            //  disabledDate={this.disableProjectdDate}
                                            <DatePicker format={dateFormat} onChange={this.changeCredit1ValidityDate} placeholder="请选择" />
                                        )}
                                    </FormItem>
                                </Col>

                                {/* 全国公路建设市场信用信息  */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 2 ? "block" : "none" }}>
                                    <FormItem label="选择年份" >
                                        {getFieldDecorator('credit2ChooseYear')(
                                            <Select placeholder="选择年份" onChange={this.changeCredit2ChooseYear} allowClear="true">
                                                <Select.Option value="0">2019</Select.Option>
                                                <Select.Option value="1">2018</Select.Option>
                                                <Select.Option value="2">2017</Select.Option>
                                                <Select.Option value="3">2016</Select.Option>
                                                <Select.Option value="4">2015</Select.Option>
                                                <Select.Option value="5">2014</Select.Option>
                                                <Select.Option value="6">2013</Select.Option>
                                                <Select.Option value="7">2012</Select.Option>
                                                <Select.Option value="8">2011</Select.Option>
                                                <Select.Option value="9">2010</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 2 ? "block" : "none" }}>
                                    <FormItem label="等级" >
                                        {getFieldDecorator('credit2Level')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit2Level}>
                                                <Select.Option value="AA">AA</Select.Option>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="B">B</Select.Option>
                                                <Select.Option value="C">C</Select.Option>
                                                <Select.Option value="D">D</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 2 ? "block" : "none" }}>
                                    <FormItem label="省份">
                                        {getFieldDecorator('credit2Province')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit2Province}>
                                                <Select.Option key={"四川省"}>{"四川省"}</Select.Option>
                                                {
                                                    outerLocation.map(lo => <Select.Option key={lo}>{lo}</Select.Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {/* 信用交通-四川  */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 3 ? "block" : "none" }}>
                                    <FormItem label="等级" >
                                        {getFieldDecorator('credit3Level')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit3Level}>
                                                <Select.Option value="AA">AA</Select.Option>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="B">B</Select.Option>
                                                <Select.Option value="C">C</Select.Option>
                                                <Select.Option value="D">D</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {/*  四川省建筑行业共享平台信用评分 */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 4 ? "block" : "none" }}>
                                    <FormItem label="分值" >
                                        {getFieldDecorator('credit4Score')(
                                            <InputNumber min={1} onChange={this.changeCredit4Score} placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                {/*  成都工程招标投标-施工类信用信息 */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 5 ? "block" : "none" }}>
                                    <FormItem label="类型" >
                                        {getFieldDecorator('credit5Type')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit5Type}>
                                                <Select.Option value="1">水利类</Select.Option>
                                                <Select.Option value="2">交通类</Select.Option>
                                                <Select.Option value="3">信息化类</Select.Option>
                                                <Select.Option value="4">国土类</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 5 ? credit5Type.indexOf('4') >= 0 ? "none" : "block" : "none" }}>
                                    <FormItem label="等级">
                                        {getFieldDecorator('credit5Level')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit5Level}>
                                                <Select.Option value="A++">A++</Select.Option>
                                                <Select.Option value="A+">A+</Select.Option>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="B">B</Select.Option>
                                                <Select.Option value="C">C</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 5 ? "block" : "none" }}>
                                    <FormItem label="分值" >
                                        {getFieldDecorator('credit5Score')(
                                            <InputNumber min={1} onChange={this.changeCredit5Score} placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                {/*  成都市建筑市场信用信息排名 */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 6 ? "block" : "none" }}>
                                    <FormItem label="排名类型">
                                        {getFieldDecorator('credit6Type')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.credit6TypeChange}>
                                                <Select.Option value="1">施工房建</Select.Option>
                                                <Select.Option value="2">施工市政</Select.Option>
                                                <Select.Option value="3">监理房建</Select.Option>
                                                <Select.Option value="4">监理市政</Select.Option>
                                                <Select.Option value="5">设计房建</Select.Option>
                                                <Select.Option value="6">设计市政</Select.Option>
                                                <Select.Option value="7">勘察</Select.Option>
                                                <Select.Option value="8">造价咨询</Select.Option>
                                                <Select.Option value="9">招标代理</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 6 ? "block" : "none" }}>
                                    <FormItem label="60日排名">
                                        <div className='comprehensive_chooseNumber'>
                                            {getFieldDecorator('credit6RankStart')(
                                                <InputNumber min={1} onChange={this.changeCredit6RankStart} placeholder="请输入" />
                                            )}
                                            <span> &nbsp;-&nbsp;</span>
                                            {getFieldDecorator('credit6RankEnd')(
                                                <InputNumber min={1} onChange={this.changeCredit6RankEnd} placeholder="请输入" />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 6 ? "block" : "none" }}>
                                    <FormItem label="60日得分">
                                        <div className='comprehensive_chooseNumber'>
                                            {getFieldDecorator('credit6ScoreStart')(
                                                <InputNumber min={1} onChange={this.changeCredit6ScoreStart} placeholder="请输入" />
                                            )}
                                            <span> &nbsp;-&nbsp;</span>
                                            {getFieldDecorator('credit6ScoreEnd')(
                                                <InputNumber min={1} onChange={this.changeCredit6ScoreEnd} placeholder="请输入" />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                {/* 信用中国 */}
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }} style={{ display: creditType == 7 ? "block" : "none" }}>
                                    <FormItem label="信用内容">
                                        {getFieldDecorator('credit7Type')(
                                            <Select placeholder="请选择" allowClear="true" onChange={this.changeCredit7Type}>
                                                <Select.Option value="">无</Select.Option>
                                                <Select.Option value="1">守信红名单</Select.Option>
                                                <Select.Option value="2">行政处罚</Select.Option>
                                                <Select.Option value="3">黑名单</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {/*<Col style={{ display: userLevel >= 1 ? "none" : "" }}>*/}
                                <Col style={{ display: "none" }}>
                                    <div className='ddgo_credit_websites'>
                                        <p>信用网站：</p>
                                        <p>1、中国信用</p>
                                        <p>2、四川省建筑行业共享平台信用评分</p>
                                        <p>3、全国水利建设市场信用信息</p>
                                        <p>4、全国公路建设市场信用信息</p>
                                        <p>5、信用交通-四川</p>
                                        <p>6、成都市建筑市场信用信息排名</p>
                                        <p>7、成都工程招标投标</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="modal vip" md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
                            {/*<div className="blackModal" style={{ display: userLevel == 2 ? "none" : "" }}>*/}
                            {/*    <button className="blackModal_but02" onClick={this.growUpTip}>升级为钻石会员</button>*/}
                            {/*</div>*/}
                            <Row>
                                <Col className='ddgo_comprehensive_titel'>
                                    <div className='ddgo_comprehensive_smalltitel03'>
                                        <div>
                                            <i></i>
                                            <span>|</span>
                                            <span>钻石会员</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="业绩类型" >
                                        {getFieldDecorator('achievementType')(
                                            <AutoComplete
                                                dataSource={achievementTypes}
                                                allowClear="true"
                                                placeholder="请输入业绩类型"
                                                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                onChange={this.changeAchievementTypes}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="业绩状态" >
                                        {getFieldDecorator('projectType')(
                                            <Select placeholder="请选择业绩状态" onChange={this.changeProjectTypes} allowClear="true">
                                                {/* <Select.Option value="-1">不限</Select.Option> */}
                                                <Select.Option value="0">中标业绩</Select.Option>
                                                <Select.Option value="1">在建业绩</Select.Option>
                                                <Select.Option value="2">完工业绩</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="业绩金额" >
                                        {getFieldDecorator('achievementMoney')(
                                            <InputNumber min={1} placeholder="请输入" onChange={this.changeAchievementMoney} />
                                        )}
                                        <span className='performanceAmount'>万元</span>
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="业绩数量" >
                                        {getFieldDecorator('achievementSize')(
                                            <InputNumber min={1} onChange={this.changeAchievementSize} placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                    <FormItem label="业绩时间">
                                        <div className='comprehensive_chooseTime'>
                                            {getFieldDecorator('achievementStart')(
                                                <DatePicker.MonthPicker disabledDate={this.disableProjectdDate} onChange={this.changeAchievementStart} format={monthFormat} placeholder="开始" />
                                            )}
                                            {/* &nbsp;-&nbsp;
                                            {getFieldDecorator('achievementEnd')(
                                                <DatePicker.MonthPicker onChange={this.changeAchievementEnd} format={monthFormat} placeholder="结束" />
                                            )} */}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* ----------------------------按钮---------------------------------------------- */}
                    <Row>
                        <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                            <FormItem >
                                <div className='ddgo_comprehensiveSearchSubmit'>
                                    <Button htmlType="button" block onClick={this.showDrawer}>查看已选条件 <span className='ddgo_comprehensiveNum'>({conditionsLength || 0})</span></Button>
                                    <Button htmlType="submit" type="primary" onClick={this.handleSearchChange}>查询</Button>
                                    <Button htmlType="button" onClick={this.resetForm} type="danger" style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div className='ddgo_comprehensive_table'>
                    <Table
                        dataSource={this.state.list}
                        rowKey={record => record.key}
                        loading={this.state.loading}
                        // pagination={{ total: this.state.pagination.total, current: this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 条记录` }}
                        pagination={paginationProps}
                        columns={columns}
                        onChange={this.handleCompositeTableChange}
                    />
                </div>
                <Drawer
                    title="综合查询已选条件"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    {/* 企业资质 */}
                    <div style={{ display: builderPermitTags.length > 0 ? "block" : "none" }}>
                        <p>企业资质</p>
                        <table className='comprehensive_enterpriseQualificationTable'>
                            <tr>
                                <th>资质类型</th>
                                <th>操作</th>
                            </tr>
                            {this.state.builderPermitTags.map(tag => {
                                let displayTag = tag.split(':')[1];
                                return (
                                    <tr>
                                        <td>{displayTag}</td>
                                        <td><Icon type="close" onClick={this.closeBuilderPermitTag.bind(this, tag, false)} /></td>
                                    </tr>)
                            })}
                        </table>
                    </div>
                    {/* 人员证书 */}
                    <div style={{ display: personCertTags.length > 0 ? "block" : "none" }}>
                        <p>人员证书</p>
                        <table className='comprehensive_personnelCertificatesTable'>
                            <tr>
                                <th>证书类型</th>
                                <th>证书数量</th>
                                <th>操作</th>
                            </tr>
                            {this.state.personCertTags.map((tag, i) => {
                                let displayTag = tag.split(':');
                                let num = displayTag[0].split('-')[1];
                                return (
                                    <tr>
                                        <td>{displayTag[1]}</td>
                                        <td><InputNumber min={1} value={num} onChange={this.changePersonCertNum.bind(this, i)} /></td>
                                        <td><Icon type="close" onClick={this.closePersonCertTag.bind(this, tag, false)} /></td>
                                    </tr>)
                            })}
                        </table>
                    </div>
                    {/* 一人多证 */}
                    <div style={{ display: personMoreCertsLength > 0 ? "block" : "none" }}>
                        <p>一人多证</p>
                        <table className='comprehensive_onePersonMoreCardTable'>
                            <tr>
                                <th>证书类型</th>
                                <th>人员数量</th>
                                <th>操作</th>
                            </tr>
                            {Object.keys(personMoreCertConditions).map((tag, i) => {
                                let num = personMoreCertConditions[tag];
                                console.log(tag)
                                let tags = tag.split(",");
                                return (
                                    <tr>
                                        <td>
                                            <ul>
                                                {
                                                    tags.map(tag => <li>{tag.split(':')[1]}</li>)
                                                }
                                            </ul>
                                        </td>
                                        <td><InputNumber min={1} value={num} onChange={this.changeMorePersonCertNum.bind(this, tag)} /></td>
                                        <td><Icon type="close" onClick={this.closeMorePersonCertTag.bind(this, tag, false)} /></td>
                                    </tr>)
                            })}
                        </table>
                    </div>
                    {/* 企业业绩 */}
                    <div style={{ display: achievementConditionLength > 0 ? "block" : "none" }}>
                        <p>企业业绩</p>
                        <table className='comprehensive_corporatePerformanceTable'>
                            <tr>
                                <th>业绩分类</th>
                                <th>业绩内容</th>
                                <th>操作</th>
                            </tr>
                            <tr style={{ display: achievementType ? "" : "none" }}>
                                <td>业绩类别</td>
                                <td>{achievementType.split(':')[0]}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'achievementType')} /></td>
                            </tr>
                            <tr style={{ display: projectType ? "" : "none" }}>
                                <td>业绩类型</td>
                                <td>{projectType.split(':')[1]}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'projectType')} /></td>
                            </tr>
                            <tr style={{ display: achievementMoney ? "" : "none" }}>
                                <td>业绩金额</td>
                                <td>{achievementMoney}万元</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'achievementMoney')} /></td>
                            </tr>
                            <tr style={{ display: achievementSize ? "" : "none" }}>
                                <td>业绩数量</td>
                                <td>{achievementSize}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'achievementSize')} /></td>
                            </tr>
                            <tr style={{ display: achievementStart || achievementEnd ? "" : "none" }}>
                                <td>业绩时间</td>
                                <td>{achievementStart}-{(achievementStart && !achievementEnd) ? "至今" : achievementEnd}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'achievementStart', 'achievementEnd')} /></td>
                            </tr>
                        </table>
                    </div>
                    {/* 信用来源 */}
                    <div className='comprehensive_sourcesoOfCreditTables' style={{ display: creditConditionLength > 0 ? 'block' : 'none' }}>
                        <p>信用来源</p>
                        <table className='comprehensive_sourcesoOfCredit01' style={{ display: creditTypeConditions.contains(1) ? "" : "none" }}>
                            <tr>
                                <th colspan="9">全国水利建设市场信用信息</th>
                                <th colspan="1">操作</th>
                            </tr>
                            <tr style={{ display: credit1Level || credit1ValidityDate || credit1ChooseYear ? '' : 'none' }}>
                                <td colspan="1">等级</td>
                                <td colspan="2">{credit1Level ? credit1Level.split(':')[1] : '--'}</td>
                                <td colspan="1">有效期</td>
                                <td colspan="2">{credit1ValidityDate || '--'}</td>
                                <td colspan="2">选择年份</td>
                                <td colspan="1">{credit1ChooseYear.split(':')[1] || '--'}</td>
                                <td colspan="1"><Icon type="close" onClick={this.conditionCreditClose.bind(this, '1', 'creditSource', 'credit1Level', 'credit1ValidityDate', 'credit1ChooseYear')} /></td>
                            </tr>
                        </table>
                        <table className='comprehensive_sourcesoOfCredit02' style={{ display: creditTypeConditions.contains(2) ? "" : "none" }}>
                            <tr>
                                <th colspan="9">全国公路建设市场信用信息</th>
                                <th colspan="1">操作</th>
                            </tr>
                            <tr style={{ display: credit2Level || credit2Province || credit2ChooseYear ? '' : 'none' }}>
                                <td colspan="1">等级</td>
                                <td colspan="2">{credit2Level ? credit2Level.split(':')[1] : '--'}</td>
                                <td colspan="1">省份</td>
                                <td colspan="2">{credit2Province ? credit2Province.split(':')[1] : '--'}</td>
                                <td colspan="2">选择年份</td>
                                <td colspan="1">{ credit2ChooseYear.split(':')[1] || '--'}</td>
                                <td colspan="1"><Icon type="close" onClick={this.conditionCreditClose.bind(this, '2', 'creditSource', 'credit2Level', 'credit2Province', 'credit2ChooseYear')} /></td>
                            </tr>
                        </table>
                        <table className='comprehensive_sourcesoOfCredit04' style={{ display: creditTypeConditions.contains(3) ? "" : "none" }}>
                            <tr>
                                <th colspan="6">信用交通-四川</th>
                                <th colspan="1">操作</th>
                            </tr>
                            <tr style={{ display: credit3Level ? '' : 'none' }}>
                                <td>等级</td>
                                <td colSpan='5'>{credit3Level.split(':')[1]}</td>
                                <td><Icon type="close" onClick={this.conditionCreditClose.bind(this, '3', 'creditSource', 'credit3Level')} /></td>
                            </tr>
                        </table>
                        <table className='comprehensive_sourcesoOfCredit03' style={{ display: creditTypeConditions.contains(4) ? "" : "none" }}>
                            <tr>
                                <th colspan="4">四川建筑行业共享信用评分</th>
                                <th colspan="1">操作</th>
                            </tr>
                            <tr style={{ display: credit4Score ? '' : 'none' }}>
                                <td colspan="1">分值</td>
                                <td colspan="3">{credit4Score}</td>
                                <td colspan="1"><Icon type="close" onClick={this.conditionCreditClose.bind(this, '4', 'creditSource', 'credit4Score')} /></td>
                            </tr>
                        </table>
                        <table className='comprehensive_sourcesoOfCredit05' style={{ display: creditTypeConditions.contains(5) ? "" : "none" }}>
                            <tr>
                                <th colSpan='7'>成都市工程招标投标-施工类信用信息</th>
                            </tr>
                            <tr>
                                <td colSpan='2'>类型</td>
                                <td colSpan='2'>等级</td>
                                <td colSpan='2'>分值</td>
                                <td>操作</td>
                            </tr>
                            <tr style={{ display: credit5Level || credit5Score || credit5Type ? '' : 'none' }}>
                                <td colSpan='2'>{credit5Type ? credit5Type.split(':')[1] : '--'}</td>
                                <td colSpan='2'>{credit5Level ? credit5Level.split(":")[1] : '--'}</td>
                                <td colSpan='2'>{credit5Score || '--'}</td>
                                <td colSpan='2'><Icon type="close" onClick={this.conditionCreditClose.bind(this, '5', 'creditSource', 'credit5Type', 'credit5Level', 'credit5Score')} /></td>
                            </tr>
                        </table>
                        {/* style={{display:credit6Type || credit5Score || credit5Type ? 'block' : 'none'}} */}
                        <table className='comprehensive_sourcesoOfCredit06' style={{ display: creditTypeConditions.contains(6) ? "" : "none" }} >
                            <tr>
                                <th colSpan='3'>成都市建筑市场信用信息排名</th>
                                <th>操作</th>
                            </tr>
                            {/*<tbody style={{ display: credit6Type ? '' : 'none' }}>*/}
                            <tbody >
                                <tr style={{ display: credit6Type ? '' : 'none' }}>
                                    <td colSpan='1'>类型</td>
                                    <td colSpan='2'>{credit6Type.split(':')[1]}</td>
                                    <td><Icon type="close" onClick={this.conditionCredit6Close.bind(this, credit6Length, 'credit6Type')} /></td>
                                </tr>
                                <tr style={{ display: credit6RankStart && credit6RankEnd ? '' : 'none' }}>
                                    <td colSpan='1'>60日排名</td>
                                    <td colSpan='2'>{credit6RankStart}~{credit6RankEnd}</td>
                                    <td><Icon type="close" onClick={this.conditionCredit6Close.bind(this, credit6Length, 'credit6RankStart', 'credit6RankEnd')} /></td>
                                </tr>
                                <tr style={{ display: credit6ScoreStart && credit6ScoreEnd ? '' : 'none' }}>
                                    <td colSpan='1'>60日得分</td>
                                    <td colSpan='2'>{credit6ScoreStart}~{credit6ScoreEnd}</td>
                                    <td><Icon type="close" onClick={this.conditionCredit6Close.bind(this, credit6Length, 'credit6ScoreStart', 'credit6ScoreEnd')} /></td>
                                </tr>
                            </tbody>

                        </table>
                        <table className='comprehensive_sourcesoOfCredit07' style={{ display: creditTypeConditions.contains(7) ? "" : "none" }}>
                            <tr>
                                <th colSpan='4'>信用中国</th>
                                <th>操作</th>
                            </tr>
                            <tr style={{ display: credit7Type ? '' : 'none' }}>
                                <td colSpan='4'>{credit7Type.split(':')[1]}</td>
                                <td><Icon type="close" onClick={this.conditionCreditClose.bind(this, '7', 'creditSource', 'credit7Type')} /></td>
                            </tr>
                        </table>
                    </div>
                    <div style={{ display: isLocal ? 'block' : 'none' }}>
                        <p>地区</p>
                        <table className='comprehensive_areaTable1'>
                            <tr>
                                <td colSpan='4'>川内川外</td>
                                <td>{isLocal == "-1" ? "不限" : isLocal == "1" ? '川内' : '川外'}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'isLocal', 'registLocation')} /></td>
                            </tr>
                            <tr style={{ display: registLocation ? '' : 'none' }}>
                                <td colSpan='4'>地区</td>
                                <td>{registLocation.split(':')[1]}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'registLocation')} /></td>
                            </tr>
                        </table>
                    </div>
                    <div style={{ display: recordWebsite ? 'block' : 'none' }}>
                        <p>可选备案网站</p>
                        <table className='comprehensive_areaTable'>
                            <tr>
                                <th colSpan='6'>可选备案网站</th>
                                <th>操作</th>
                            </tr>
                            <tr>
                                <td colSpan='6'>{recordWebsite.split(':')[1]}</td>
                                <td><Icon type="close" onClick={this.conditionClose.bind(this, 'recordWebsite')} /></td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <Button onClick={this.handleSearchChange} type="primary" style={{ marginRight: 8 }}> 查询 </Button>
                        <Button onClick={this.resetForm}> 清空 </Button>
                    </div>
                </Drawer>
                <Modal
                    title="一人多证"
                    visible={this.state.isMoreCerts}
                    onOk={this.handleMoreCertsOk}
                    onCancel={this.handleMoreCertsCancel}
                >
                    <div className='ddgo_onePersonMoreCardChoose'>
                        <FormItem label="人员证书">
                            {getFieldDecorator('personCertsPermits')(
                                <Cascader
                                    options={this.state.personCertOptions}
                                    loadData={this.loadPersonPermitData}
                                    onChange={this.handlePersonCertsPermitChange}
                                    placeholder="请选择..." />
                            )}
                        </FormItem>
                    </div>
                    <div className='ddgo_onePersonMoreCardChoose'>
                        <table style={{ display: personMoreCertTags && personMoreCertTags.length ? '' : 'none' }}>
                            <thead>
                                <tr>
                                    <th>证书</th>
                                    <th>人员数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <ul>
                                            {
                                                personMoreCertTags.map((certs) => {
                                                    const displayTag = certs.split(':')[1];
                                                    const tagElem = (
                                                        <Tag key={certs} closable afterClose={() => this.handlePersonCertsPermitClose(certs)}>
                                                            {displayTag}
                                                        </Tag>
                                                    );
                                                    return <li>{tagElem}</li>;
                                                })
                                            }
                                        </ul>
                                    </td>
                                    <td>
                                        {getFieldDecorator('personCertsNumber', {
                                            initialValue: 1
                                        })(
                                            <InputNumber min={1} placeholder="请输入" />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        )
    }
}
DdgoComprehensive = Form.create({})(DdgoComprehensive)
export default DdgoComprehensive;
