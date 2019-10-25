import React, { Component } from 'react';
import { message, Cascader, Input, Radio, AutoComplete } from 'antd';
import './person_basic.css';
import PropTypes from "proptypes";
import emitter from "../../event";
import Utils from '../../utils/appUtils';

import request from '../../utils/request'
class PersonBasic extends Component {

    state = {
        userId: 0,
        enteId: 0,
        enteName: '',
        phoneNo: '',
        saveCount: 0,
        gender: '',
        vipEndDateStr: '',
        userName: '',
        targetValue: '',
        bgdz: '',
        detailAddr: '',
        user: {},
        dataSource: [],
        userLevel: 0,
    }

    handleSave = () => {
        let { userName, gender, enteId, targetValue, bgdz, detailAddr, enteName, userId } = this.state;
        this.setState({ saveCount: 1 });
        // if (enteName == null || enteName == undefined || enteName === 0) {
        //     message.success('请输入公司名称', 1)
        //     return;
        // }
        if (!bgdz || bgdz === '') {
            message.success('请选择办公地址', 1)
            return;
        }
        if (!detailAddr || detailAddr === '') {
            message.success('请填写详细地址', 1)
            return;
        }
        let address = targetValue + detailAddr;
        var fieldsValue = {
            userId: userId,
            userRealName: userName,
            userSex: gender,
            enteId: enteId,
            enteAddress: address,
            enterpriseName: enteName,
        }
        this.setState({
            buttondisable: true,
            userName: userName,
        })
        request(`/api/user/addUser`, {
            credentials: 'include',
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ ...fieldsValue })
        }, this.saveSuccess)
    }

    saveSuccess = (data) => {
        console.log(data)
        this.setState({ saveCount: 0 });
        if (data.status === 'ok') {
            message.success('保存成功', 1)
            emitter.emit("callMe", this.state.userName, null);
            emitter.emit("callPersonConst", this.state.userName);
        } else {
            message.success('保存失败：' + data.message, 1)
        }
    }
    fetchData = () => {
        let userId = null;
        let userinfot = sessionStorage.getItem("userinfo");
        if (userinfot != null && userinfot != undefined) {
            let userObj = JSON.parse(userinfot);
            if (userObj) {
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
        }, (data) => {
            this.setState({ 
                userId: data.userId, 
                enteId: data.enteId, 
                phoneNo : data.phoneNo,
                gender: data.userSex,
                enteName: data.enterpriseName,
                enteNameAutoComponentDisabled: data.enterpriseName ? true : false,
                tagreAddress: data.enteAddress,
                userName: data.userRealName,
                user: data
            });
            let ad = data.enteAddress;
            if (ad != null && ad != '' && ad != undefined) {
                let ind = ad.indexOf("$$$");
                if (ind > -1) {
                    let dx = ad.substring(0, ind);
                    let tad = ad.substring(0, ind + 3);
                    let xdx = ad.substring(ind + 3, ad.length);
                    let xsd = dx.split("///");
                    this.setState({ bgdz: xsd, detailAddr: xdx, targetValue: tad })
                }
            }
        })
    }
    componentDidMount() {
        let level = Utils.getUserType();
        let isValid = Utils.isValid();
        this.setState({ userLevel: isValid ? level : 0 });
        this.fetchData();
    }
    onChange = (value, selectedOptions) => {
        if (selectedOptions[0] != null && selectedOptions[1] != null && selectedOptions[2] != null) {
            let tx = selectedOptions[0].value + "///" + selectedOptions[1].value + "///" + selectedOptions[2].value + "$$$";

            let ppcd = [];
            ppcd[0] = selectedOptions[0].value;
            ppcd[1] = selectedOptions[1].value;
            ppcd[2] = selectedOptions[2].value;
            this.setState({ targetValue: tx, bgdz: ppcd });
        } else {
            this.setState({ targetValue: '', bgdz: [] });
        }
    }
    userRealNameChange = (e) => {
        let value = e.target.value;
        this.setState({ userName: value });
    }
    genderChange = (e) => {
        let value = e.target.value;
        this.setState({ gender: value });
    }
    builderNameChange = (value) => {
        this.setState({ enteName: value });
    }
    detailAddrChange = (e) => {
        this.setState({ detailAddr: e.target.value })
    }

    handleSearch = (value) => {
        if(!value){
            this.setState({ dataSource: [] })
            return;
        }
        this.setState({ dataSource: [] })
        request("/api/builder/names/" + value,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, res => {
            // console.log(res);
            if(res && res.length > 0){
                let dataSource = res.map(d => {
                    return d["builderName"];
                })
                this.setState({ dataSource: dataSource });
            }
        })
    }

    render() {
        const { userName, enteName, gender, phoneNo, detailAddr, bgdz, dataSource, enteNameAutoComponentDisabled, user, userLevel } = this.state;
        const { TextArea } = Input;
        const options = [
            {
                value: '四川省',
                label: '四川省',
                children: [
                    {
                        value: '成都市',
                        label: '成都市',
                        children: [
                            {
                                value: '武侯区',
                                label: '武侯区',
                            }, {
                                value: '金牛区',
                                label: '金牛区',
                            }, {
                                value: '青羊区',
                                label: '青羊区',
                            }, {
                                value: '成华区',
                                label: '成华区',
                            }, {
                                value: '高新区',
                                label: '高新区',
                            }, {
                                value: '锦江区',
                                label: '锦江区',
                            }, {
                                value: '郫都区',
                                label: '郫都区',
                            }, {
                                value: '双流区',
                                label: '双流区',
                            }, {
                                value: '高新西区',
                                label: '高新西区',
                            }, {
                                value: '简阳市',
                                label: '简阳市',
                            }, {
                                value: '龙泉驿区',
                                label: '龙泉驿区',
                            }, {
                                value: '新都区',
                                label: '新都区',
                            }, {
                                value: '温江区',
                                label: '温江区',
                            }, {
                                value: '都江堰区',
                                label: '都江堰区',
                            }, {
                                value: '彭州市',
                                label: '彭州市',
                            }, {
                                value: '青白江区',
                                label: '青白江区',
                            }, {
                                value: '崇州市',
                                label: '崇州市',
                            }, {
                                value: '金堂县',
                                label: '金堂县',
                            }, {
                                value: '新津县',
                                label: '新津县',
                            }, {
                                value: '邛崃市',
                                label: '邛崃市',
                            }, {
                                value: '大邑县',
                                label: '大邑县',
                            }, {
                                value: '浦江县',
                                label: '浦江县',
                            }],
                    },
                    {
                        value: '自贡市',
                        label: '自贡市',
                        children: [
                            {
                                value: '自流井区',
                                label: '自流井区',
                            }, {
                                value: '沿滩区',
                                label: '沿滩区',
                            }, {
                                value: '荣县',
                                label: '荣县',
                            }, {
                                value: '富顺县',
                                label: '富顺县',
                            }, {
                                value: '大安区',
                                label: '大安区',
                            }, {
                                value: '贡井区',
                                label: '贡井区',
                            }]
                    },
                    {
                        value: '眉山市',
                        label: '眉山市',
                        children: [
                            {
                                value: '仁寿县',
                                label: '仁寿县',
                            }, {
                                value: '彭山区',
                                label: '彭山区',
                            }, {
                                value: '洪雅县',
                                label: '洪雅县',
                            }, {
                                value: '丹棱县',
                                label: '丹棱县',
                            }, {
                                value: '青神县',
                                label: '青神县',
                            }, {
                                value: '东坡区',
                                label: '东坡区',
                            }],
                    },
                    {
                        value: '资阳市',
                        label: '资阳市',
                        children: [
                            {
                                value: '雁江区',
                                label: '雁江区',
                            }, {
                                value: '安岳县',
                                label: '安岳县',
                            }, {
                                value: '乐至县',
                                label: '乐至县',
                            }],
                    },
                    {
                        value: '阿坝州',
                        label: '阿坝州',
                        children: [
                            {
                                value: '马尔康市',
                                label: '马尔康市',
                            }, {
                                value: '九寨沟县',
                                label: '九寨沟县',
                            }, {
                                value: '红原县',
                                label: '红原县',
                            }, {
                                value: '阿坝县',
                                label: '阿坝县',
                            }, {
                                value: '理县',
                                label: '理县',
                            }, {
                                value: '若尔盖县',
                                label: '若尔盖县',
                            }, {
                                value: '金川县',
                                label: '金川县',
                            }, {
                                value: '小金县',
                                label: '小金县',
                            }, {
                                value: '黑水县',
                                label: '黑水县',
                            }, {
                                value: '松潘县',
                                label: '松潘县',
                            }, {
                                value: '壤塘县',
                                label: '壤塘县',
                            }, {
                                value: '茂县',
                                label: '茂县',
                            }, {
                                value: '汶川县',
                                label: '汶川县',
                            }],
                    },
                    {
                        value: '凉山州',
                        label: '凉山州',
                        children: [
                            {
                                value: '美姑县',
                                label: '美姑县',
                            }, {
                                value: '昭觉县',
                                label: '昭觉县',
                            }, {
                                value: '会理县',
                                label: '会理县',
                            }, {
                                value: '会东县',
                                label: '会东县',
                            }, {
                                value: '普格县',
                                label: '普格县',
                            }, {
                                value: '宁南县',
                                label: '宁南县',
                            }, {
                                value: '德昌县',
                                label: '德昌县',
                            }, {
                                value: '冕宁县',
                                label: '冕宁县',
                            }, {
                                value: '盐源县',
                                label: '盐源县',
                            }, {
                                value: '金阳县',
                                label: '金阳县',
                            }, {
                                value: '布拖县',
                                label: '布拖县',
                            }, {
                                value: '雷波县',
                                label: '雷波县',
                            }, {
                                value: '越西县',
                                label: '越西县',
                            }, {
                                value: '喜德县',
                                label: '喜德县',
                            }, {
                                value: '甘洛县',
                                label: '甘洛县',
                            }, {
                                value: '木里县',
                                label: '木里县',
                            }, {
                                value: '西昌市',
                                label: '西昌市',
                            }],
                    },
                    {
                        value: '甘孜州',
                        label: '甘孜州',
                        children: [
                            {
                                value: '康定市',
                                label: '康定市',
                            }, {
                                value: '泸定县',
                                label: '泸定县',
                            }, {
                                value: '九龙县',
                                label: '九龙县',
                            }, {
                                value: '丹巴县',
                                label: '丹巴县',
                            }, {
                                value: '道孚县',
                                label: '道孚县',
                            }, {
                                value: '炉霍县',
                                label: '炉霍县',
                            }, {
                                value: '色达县',
                                label: '色达县',
                            }, {
                                value: '甘孜县',
                                label: '甘孜县',
                            }, {
                                value: '新龙县',
                                label: '新龙县',
                            }, {
                                value: '白玉县',
                                label: '白玉县',
                            }, {
                                value: '德格县',
                                label: '德格县',
                            }, {
                                value: '石渠县',
                                label: '石渠县',
                            }, {
                                value: '雅江县',
                                label: '雅江县',
                            }, {
                                value: '理塘县',
                                label: '理塘县',
                            }, {
                                value: '稻城县',
                                label: '稻城县',
                            }, {
                                value: '乡城县',
                                label: '乡城县',
                            }, {
                                value: '得荣县',
                                label: '得荣县',
                            }],
                    },
                    {
                        value: '攀枝花市',
                        label: '攀枝花市',
                        children: [
                            {
                                value: '仁和区',
                                label: '仁和区',
                            }, {
                                value: '西区',
                                label: '西区',
                            }, {
                                value: '东区',
                                label: '东区',
                            }, {
                                value: '米易县',
                                label: '米易县',
                            }, {
                                value: '盐边县',
                                label: '盐边县',
                            }]
                    },
                    {
                        value: '泸州市',
                        label: '泸州市',
                        children: [
                            {
                                value: '纳溪区',
                                label: '纳溪区',
                            }, {
                                value: '江阳区',
                                label: '江阳区',
                            }, {
                                value: '龙马潭区',
                                label: '龙马潭区',
                            }, {
                                value: '泸县',
                                label: '泸县',
                            }, {
                                value: '合江县',
                                label: '合江县',
                            }, {
                                value: '叙永县',
                                label: '叙永县',
                            }, {
                                value: '古蔺县',
                                label: '古蔺县',
                            }]
                    },
                    {
                        value: '绵阳市',
                        label: '绵阳市',
                        children: [
                            {
                                value: '江油市',
                                label: '江油市',
                            }, {
                                value: '涪城区',
                                label: '涪城区',
                            }, {
                                value: '游仙区',
                                label: '游仙区',
                            }, {
                                value: '高新区',
                                label: '高新区',
                            }, {
                                value: '经开区',
                                label: '经开区',
                            }, {
                                value: '盐亭县',
                                label: '盐亭县',
                            }, {
                                value: '三台县',
                                label: '三台县',
                            }, {
                                value: '平武县',
                                label: '平武县',
                            }, {
                                value: '北川县',
                                label: '北川县',
                            }, {
                                value: '安州区',
                                label: '安州区',
                            }, {
                                value: '梓潼县',
                                label: '梓潼县',
                            }]
                    },
                    {
                        value: '德阳市',
                        label: '德阳市',
                        children: [
                            {
                                value: '广汉市',
                                label: '广汉市',
                            }, {
                                value: '什邡市',
                                label: '什邡市',
                            }, {
                                value: '旌阳区',
                                label: '旌阳区',
                            }, {
                                value: '绵竹市',
                                label: '绵竹市',
                            }, {
                                value: '罗江县',
                                label: '罗江县',
                            }, {
                                value: '中江县',
                                label: '中江县',
                            }]
                    },
                    {
                        value: '广元市',
                        label: '广元市',
                        children: [
                            {
                                value: '昭化区',
                                label: '昭化区',
                            }, {
                                value: '朝天区',
                                label: '朝天区',
                            }, {
                                value: '利州区',
                                label: '利州区',
                            }, {
                                value: '青川县',
                                label: '青川县',
                            }, {
                                value: '旺苍县',
                                label: '旺苍县',
                            }, {
                                value: '剑阁县',
                                label: '剑阁县',
                            }, {
                                value: '苍溪县',
                                label: '苍溪县',
                            }]
                    },
                    {
                        value: '遂宁市',
                        label: '遂宁市',
                        children: [
                            {
                                value: '船山区',
                                label: '船山区',
                            }, {
                                value: '射洪县',
                                label: '射洪县',
                            }, {
                                value: '蓬溪县',
                                label: '蓬溪县',
                            }, {
                                value: '大英县',
                                label: '大英县',
                            }, {
                                value: '安居区',
                                label: '安居区',
                            }]
                    },
                    {
                        value: '内江市',
                        label: '内江市',
                        children: [
                            {
                                value: '东兴区',
                                label: '东兴区',
                            }, {
                                value: '资中县',
                                label: '资中县',
                            }, {
                                value: '隆昌县',
                                label: '隆昌县',
                            }, {
                                value: '威远县',
                                label: '威远县',
                            }, {
                                value: '市中区',
                                label: '市中区',
                            }]
                    },
                    {
                        value: '乐山市',
                        label: '乐山市',
                        children: [
                            {
                                value: '市中区',
                                label: '市中区',
                            }, {
                                value: '峨眉山市',
                                label: '峨眉山市',
                            }, {
                                value: '五通桥区',
                                label: '五通桥区',
                            }, {
                                value: '沙湾区',
                                label: '沙湾区',
                            }, {
                                value: '金口河区',
                                label: '金口河区',
                            }, {
                                value: '夹江县',
                                label: '夹江县',
                            }, {
                                value: '井研县',
                                label: '井研县',
                            }, {
                                value: '犍为县',
                                label: '犍为县',
                            }, {
                                value: '沐川县',
                                label: '沐川县',
                            }, {
                                value: '峨边县',
                                label: '峨边县',
                            }, {
                                value: '马边县',
                                label: '马边县',
                            }]
                    },
                    {
                        value: '宜宾市',
                        label: '宜宾市',
                        children: [
                            {
                                value: '宜宾县',
                                label: '宜宾县',
                            }, {
                                value: '南溪区',
                                label: '南溪区',
                            }, {
                                value: '江安县',
                                label: '江安县',
                            }, {
                                value: '长宁县',
                                label: '长宁县',
                            }, {
                                value: '兴文县',
                                label: '兴文县',
                            }, {
                                value: '珙县',
                                label: '珙县',
                            }, {
                                value: '翠屏县',
                                label: '翠屏县',
                            }, {
                                value: '高县',
                                label: '高县',
                            }, {
                                value: '屏山县',
                                label: '屏山县',
                            }, {
                                value: '筠连县',
                                label: '筠连县',
                            }]
                    },
                    {
                        value: '广安市',
                        label: '广安市',
                        children: [
                            {
                                value: '前锋区',
                                label: '前锋区',
                            }, {
                                value: '岳池区',
                                label: '岳池区',
                            }, {
                                value: '武胜县',
                                label: '武胜县',
                            }, {
                                value: '邻水县',
                                label: '邻水县',
                            }, {
                                value: '广安区',
                                label: '广安区',
                            }, {
                                value: '华蓥市',
                                label: '华蓥市',
                            }]
                    },
                    {
                        value: '南充市',
                        label: '南充市',
                        children: [
                            {
                                value: '顺庆区',
                                label: '顺庆区',
                            }, {
                                value: '高坪区',
                                label: '高坪区',
                            }, {
                                value: '嘉陵区',
                                label: '嘉陵区',
                            }, {
                                value: '西充县',
                                label: '西充县',
                            }, {
                                value: '阆中市',
                                label: '阆中市',
                            }, {
                                value: '南部县',
                                label: '南部县',
                            }, {
                                value: '仪陇县',
                                label: '仪陇县',
                            }, {
                                value: '蓬安县',
                                label: '蓬安县',
                            }, {
                                value: '营山县',
                                label: '营山县',
                            }]
                    },
                    {
                        value: '达州市',
                        label: '达州市',
                        children: [
                            {
                                value: '通川区',
                                label: '通川区',
                            }, {
                                value: '达川区',
                                label: '达川区',
                            }, {
                                value: '大竹县',
                                label: '大竹县',
                            }, {
                                value: '渠县',
                                label: '渠县',
                            }, {
                                value: '万源市',
                                label: '万源市',
                            }, {
                                value: '宣汉县',
                                label: '宣汉县',
                            }, {
                                value: '开江县',
                                label: '开江县',
                            }]
                    },
                    {
                        value: '巴中市',
                        label: '巴中市',
                        children: [
                            {
                                value: '巴州区',
                                label: '巴州区',
                            }, {
                                value: '恩阳区',
                                label: '恩阳区',
                            }, {
                                value: '南江县',
                                label: '南江县',
                            }, {
                                value: '平昌县',
                                label: '平昌县',
                            }, {
                                value: '通江县',
                                label: '通江县',
                            }]
                    },
                    {
                        value: '雅安市',
                        label: '雅安市',
                        children: [
                            {
                                value: '庐山县',
                                label: '庐山县',
                            }, {
                                value: '石棉县',
                                label: '石棉县',
                            }, {
                                value: '名山区',
                                label: '名山区',
                            }, {
                                value: '天全县',
                                label: '天全县',
                            }, {
                                value: '荥经县',
                                label: '荥经县',
                            }, {
                                value: '汉源县',
                                label: '汉源县',
                            }, {
                                value: '宝兴县',
                                label: '宝兴县',
                            }, {
                                value: '雨城区',
                                label: '雨城区',
                            }]
                    }


                ],
            }

        ];

        function filter(inputValue, path) {
            return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }

        return (
            <div className='personBasic'>
                <h3>基本信息</h3>
                <p>用户姓名：
                    <input className="personBasicInput" value={userName} type="text" onChange={this.userRealNameChange} />
                </p>
                <div>
                    <p> <span>*</span>电话号码：
                        <input className="personBasicInput" value={phoneNo} type="text" disabled="disabled" />
                    </p>
                    <p className="personBasicWarn"><span>*</span>填写后不能修改，修改请联系客服并审核营业执照</p>
                </div>
                <p>用户性别：
                    <Radio.Group onChange={this.genderChange} value={gender}>
                        <Radio value={"M"}>男</Radio>
                        <Radio value={"F"}>女</Radio>
                    </Radio.Group>
                </p>
                <div className='ddgo_personBasicName'>
                    <p><span>*</span>公司名称：
                    <AutoComplete
                        disabled={enteNameAutoComponentDisabled}
                        value={enteName}
                        onChange={this.builderNameChange}
                        dataSource={dataSource}
                        onSearch={this.handleSearch}
                        placeholder="请输入公司名称" />
                    </p>
                    <p className="personBasicWarn"><span>*</span>填写后不能修改，修改请联系客服并审核营业执照</p>
                </div>
                <p className="companyAddr"><span>*</span>办公地址：
                    <Cascader
                        options={options}
                        onChange={this.onChange}
                        changeOnSelect={false}
                        placeholder=""
                        defaultValue={bgdz}
                        value={bgdz}
                        showSearch={{ filter }}
                    />
                </p>
                <p className="detailedAddr"> <span>*</span><span>详细地址：</span>
                    <TextArea onChange={this.detailAddrChange} value={detailAddr} />
                </p>
                <p>普通会员到期：<span style={{ color: "#000" }} >长期</span></p>
                <p>vip会员到期：<span style={{ color: "#000" }} >
                    {userLevel == 2 ? new Date(user.diamondEndDate).format('yyyy-MM-dd') : user.vipEndDate > 0 ? user.vipEndDate < new Date().getTime() ? "已过期" : new Date(user.vipEndDate).format('yyyy-MM-dd') : "未开通"}
                </span></p>
                <p>钻石会员到期：<span style={{ color: "#000" }} >
                    {user.diamondEndDate > 0 ? user.diamondEndDate < new Date().getTime() ? "已过期" : new Date(user.diamondEndDate).format('yyyy-MM-dd') : "未开通"}
                </span></p>
                <button className="personBasicButton" type="button" onClick={this.handleSave}>保存</button>
            </div>
        )
    }
}
PersonBasic.contextTypes = {
    router: PropTypes.object.isRequired
};
export default PersonBasic;

