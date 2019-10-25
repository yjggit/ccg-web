import React, { PureComponent } from 'react';
import {
    Form,
    Radio,
    Card,
    Input,
    Button,
    message,
    Icon,
    Modal,
    Select,
    DatePicker,
    Cascader,
    Row,
    Col,
    AutoComplete
} from 'antd';
import moment from 'moment';
import SelectEnterprise from '../../selectenterprise/index'
import request from '../../../utils/request';
import './index.css'

const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
class CosUserCreateForm extends PureComponent {
    state = {
        selectEnterModalVisible: false,
        enteId: '',
        enteName: '',
        vipDate: '',
        vipDateMem: {},
        targetValue: '',
        firsetset: false,
        pcd: '',
        bgdz: '',
        defaultbgdz: '',
        roleId: [],
        menuList: [],
        roleMenuList: [],
        roleMList: [],
        roleMenu: []
    }

    componentDidMount() {
        const { item: { userLevel, vipEndDate, diamondEndDate } } = this.props;
        switch (this.getUserType(userLevel)) {
            case 0:
                break;
            case 1:
                //console.log('vip', new Date(vipEndDate).format('yyyy-MM-dd'));
                this.setState({ vipDate: new Date(vipEndDate).format('yyyy-MM-dd') });
                break;
            case 2:
                //console.log('diamond', new Date(diamondEndDate).format('yyyy-MM-dd'));
                this.setState({ vipDate: new Date(diamondEndDate).format('yyyy-MM-dd') });
                break;
        }
    }

    getUserType = (level) => {
        if (level) {
            level = Number.parseInt(level)
            if (level == 1) {
                level = 0;
            } else {
                level = Math.floor((level - 2) / 3) + 1;
            }
        } else {
            level = 0;
        }
        return level;
    };

    aflerAddCall = (res) => {
        if (res.status === 'ok') {
            const { form } = this.props;
            message.success('添加成功');
            form.resetFields();
        } else {
            message.success(`添加失败:+${res.message}`);
        }
    };

    handleAddSubmit = (e) => {
        e.preventDefault();

        const { form, item } = this.props;
        // const { item: { userLevel, vipEndDate, diamondEndDate } } = this.props;
        let { enteId, vipDate, targetValue, } = this.state;
        const userRoleInner = [];

        if (targetValue == undefined || targetValue == null || targetValue.length == 0) {
            targetValue = '';
        }
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { xxdz } = fieldsValue;
            const values = {
                ...fieldsValue,
                userId: item.userId,
                vipEndDateStr: vipDate,
                enteId: (enteId === undefined || enteId === '' || enteId === null) ? item.enteId : enteId,
                enteAddress: targetValue + xxdz,
            };
            console.log('user create form values', values);
            // this.props.submitMethod(values);
            // form.resetFields();
            // this.setState({
            //     enteId: '',
            //     vipDateMem: {},
            //     firsetset: false,
            // });
            for (let i = 0; i < values.roleName.length; i++) {
                let userRole = {
                    userId: values.userId,
                    roleId: values.roleName[i],
                    vipEndDate: item.vipEndDate,
                };
                userRoleInner.push(userRole);
                // console.log('userRoleInner param', userRoleInner);
            }
            const data = JSON.stringify({userRoleInner});
            console.log('userRoleInner param', data);
            request('/api/role/addUserRole', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: data,
            }, res => {
                if(res) {
                    this.props.submitMethod(values);
                }else {
                    message.error('异常Error', 1);
                }
            });

        });

    }
    cancel = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.cancelMethod();
        this.setState({
            enteId: '',
            vipDateMem: {},
            firsetset: false,
        });
    }
    selectEnterpriseClick = () => {
        this.setState({
            selectEnterModalVisible: true,
        });
    }
    setEnteprise = () => {
        this.setState({
            selectEnterModalVisible: false,
        });
    }
    onSelectRow = (selectRow) => {
        this.props.form.setFieldsValue({
            enterpriseName: selectRow[0].builderName,
        });
        this.setState({
            enteId: selectRow[0].builderId,
        });
    }
    handleModalVisible = () => {
        this.setState({
            selectEnterModalVisible: false,
        });
    }
    femanChange = (e) => {
        this.setState({ bgdz: e.target.value });
    }
    vipEndDateStrOnChange = (value, dateString) => {
        this.setState({
            vipDate: dateString,
        })
        this.setState({ vipDateMem: value });
    }
    c2 = (data) => {
        if (data.status === 'ok') {
            this.callback();
        } else {
            // this.callback('该邮件地址已被占用，请重新输入');
        }
    }
    onPchage = (value) => {
        let level = 0;
        if (value) {
            level = Number.parseInt(value)
            if (level == 1) {
                level = 0;
            } else {
                level = Math.floor((level - 2) % 3) + 1;
            }
        } else {
            level = 0;
        }
        // 判断直接升级的用户
        if (value == this.props.item.userLevel + 3 && new Date().getTime() < this.props.item.vipEndDate) {
            let date = new Date(this.props.item.vipEndDate);
            let dateIni = moment(date.toLocaleDateString(), 'YYYY-MM-DD');
            this.setState({ vipDateMem: dateIni, vipDate: date.format("yyyy-MM-dd") });
            return;
        }
        if (level >= 0) {
            let bef = (level) * 365 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000;
            let d = new Date();
            let cu = new Date(d.getTime() + bef);
            let dateIni = moment(cu.toLocaleDateString(), 'YYYY-MM-DD');
            let vipDateStr = '';
            vipDateStr = cu.getFullYear() + "-" + (cu.getMonth() + 1) + "-" + cu.getDate();
            this.setState({ vipDateMem: dateIni, vipDate: vipDateStr });
        } else if (level == 0) {
            let xx = new Date();
            let cu = new Date(xx.getTime() + 8 * 60 * 60 * 1000);
            let dateIni = moment(cu.toLocaleDateString(), 'YYYY-MM-DD');
            let vipDateStr = '';
            vipDateStr = cu.getFullYear() + "-" + (cu.getMonth() + 1) + "-" + cu.getDate();
            this.setState({ vipDateMem: dateIni, vipDate: vipDateStr });
        }
    }

    //添加菜单
    roleNameChange = record => {
        // let { roleId } = this.state;
        // this.setState({roleId: record});
        if (record) {
            this.fetchRoleMenuList(record.toString());
        }
        console.log('roleMenu changed ', record.toString())
    }
    //获取菜单名称列表
    fetchRoleMenuList = (param) => {
        let end = '';
        if(param!='') {
            end = `id=${param}`
        }
        let REQUEST_URL = `/api/roleMenuList/find?${end}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.getRoleMenuList)
    }
    getRoleMenuList = (data) => {
        const { roleMenuList } = this.state;
        this.setState({ roleMenuList: data });

        // console.log(roleMList, roleMenuList)
        // this.setState({ roleMList: [], roleMenuList: [] });
        // let roleMenuName = '';
        // roleMenuList.push(data);
        // for (let i = 0; i < roleMList.length; i++) {
        //     for (let j = 0; j < roleMList[i].length; j++) {
        //         roleMenuName = roleMList[i][j].menuName;
        //         roleMenu.push(roleMenuName);
        //     }
        //     this.setState({ roleMenuList: [...roleMenu] });
        // }
    };

    onChange = (value, selectedOptions) => {
        this.setState({ firsetset: true })
        if (value === "" || value === null || value === undefined || value.length === 0) {
            this.setState({ targetValue: '' });
            console.log("xxxxx");
            return;
        } else {
            if (selectedOptions[0] != null && selectedOptions[1] != null && selectedOptions[2] != null) {
                let tx = selectedOptions[0].value + "///" + selectedOptions[1].value + "///" + selectedOptions[2].value + "$$$";
                let ppcd = [];
                ppcd[0] = selectedOptions[0].value;
                ppcd[1] = selectedOptions[1].value;
                ppcd[2] = selectedOptions[2].value;
                this.setState({ targetValue: tx, pcd: ppcd });
            } else {
                this.setState({ targetValue: '', pcd: [], firsetset: false });
            }
        }
    }

    builderNameChange = (value) => {
        this.setState({ buildName: value });
    };

    handleSearch = (value) => {
        if(!value){
            this.setState({ dataSource: [] });
            return;
        }
        this.setState({ dataSource: [] });
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
                });
                this.setState({ dataSource: dataSource });
            }
        })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { item, data } = this.props;
        const { selectEnterModalVisible, vipDateMem, firsetset, roleList, menuList, roleMenuList } = this.state;
        // console.log('167vipDateMem', vipDateMem);
        const dateFormat = 'YYYY-MM-DD';
        const bef = 3 * 24 * 60 * 60 * 1000;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };
        let dateIni = null;
        let pcd = [];
        let bgdz = '';
        console.log('vip dateMem: ', vipDateMem);
        if (vipDateMem == null || vipDateMem == undefined || vipDateMem._d == null) {
            if (item != null && item != undefined && item.userId != null) {
                dateIni = moment(new Date(item.vipEndDate).toLocaleDateString(), 'YYYY-MM-DD');
            } else {
                let d = new Date();
                let cu = new Date(d.getTime() + bef);
                dateIni = moment(cu.toLocaleDateString(), 'YYYY-MM-DD');
            }
        } else {
            console.log('vipDateMem', vipDateMem);// ''
            dateIni = vipDateMem;
        }
        if (item != null && item != undefined && item.userId != null && firsetset == false) {
            let ad = item.enteAddress;
            // console.log("ad:" + ad);
            if (ad != null && ad != '' && ad != undefined) {
                let ind = ad.indexOf("$$$");
                if (ind > -1) {
                    let dx = ad.substring(0, ind);
                    let tad = ad.substring(0, ind + 3);
                    let xdx = ad.substring(ind + 3, ad.length);
                    let xsd = dx.split("///");
                    pcd = xsd;
                    bgdz = xdx;
                    this.setState({ targetValue: dx + "$$$" });
                } else {
                    bgdz = ad;
                }
            }
        }

        const options = [
            {
                value: '四川省',
                label: '四川省',
                children: [
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
        const { TextArea } = Input;
        return (
            <Card bordered={false}>
                <Form
                    onSubmit={this.handleAddSubmit}
                    style={{ marginTop: 0 }}
                >
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="真实姓名"
                            >
                                {getFieldDecorator('userRealName', {
                                    initialValue: item ? item.userRealName : '',
                                    rules: [{
                                        required: true, message: '请输入用户真实姓名',
                                    }],
                                })(
                                    <Input placeholder="用户真实姓名" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="手机号码"
                            >
                                {getFieldDecorator('phoneNo', {
                                    initialValue: item ? item.phoneNo : '',
                                    rules: [{
                                        required: true, message: '请输入用户手机号码',
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: '手机号格式错误！',
                                    },],
                                })(
                                    <Input placeholder="用户手机号码" disabled={!!(item && item.userId)} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="用户类型"
                            >
                                {getFieldDecorator('userType', {
                                    rules: [{
                                        required: true, message: '请选择用户类型',
                                    }],
                                    initialValue: (!item || item.userType === null || item.userType === 0 || item.userType === undefined) ? '1' : `${item.userType}`,
                                })(
                                    <Select placeholder="请选择">
                                        {/* 会员级别（1普通会员，2 vip会员1年，3 vip会员2年，4 vip会员3年，5 钻石会员1年，6 钻石会员2年，7 钻石会员3年） */}
                                        <Option value="1">个人用户</Option>
                                        <Option value="2">企业用户</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="用户级别"
                            >
                                {getFieldDecorator('userLevel', {
                                    rules: [{
                                        required: true, message: '请填写用户级别',
                                    }],
                                    initialValue: (!item || item.userLevel === null || item.userLevel === 0 || item.userLevel === undefined) ? '1' : `${item.userLevel}`,
                                })(
                                    <Select placeholder="请选择" onChange={this.onPchage} >
                                        {/* 会员级别（1普通会员，2 vip会员1年，3 vip会员2年，4 vip会员3年，5 钻石会员1年，6 钻石会员2年，7 钻石会员3年） */}
                                        <Option value="1">普通用户</Option>
                                        <Option value="2">VIP会员 1 年</Option>
                                        <Option value="3">VIP会员 2 年</Option>
                                        <Option value="4">VIP会员 3 年</Option>
                                        <Option value="5">钻石会员 1 年</Option>
                                        <Option value="6">钻石会员 2 年</Option>
                                        <Option value="7">钻石会员 3 年</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="VIP有效期"
                            >
                                {getFieldDecorator('vipEndDateStr', {initialValue: dateIni,})(
                                    <div>
                                        <DatePicker value={dateIni} format="YYYY-MM-DD" onChange={this.vipEndDateStrOnChange} />
                                    </div>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="企业名称"
                            >
                                {/*<Input placeholder="请输入企业名称" size="10" style={{ width: '82%' }} disabled="true" />*/}
                                {getFieldDecorator('enterpriseName', {
                                    initialValue: item ? item.enterpriseName : '',
                                })(

                                    <AutoComplete
                                        style={{ width: '82%' }}
                                        value={this.state.buildName}
                                        onChange={this.builderNameChange}
                                        dataSource={this.state.dataSource}
                                        onSearch={this.handleSearch}
                                        placeholder="请输入企业名称" />


                                )}
                                <span><Icon onClick={() => this.selectEnterpriseClick()} style={{ fontSize: 18, color: '#08c', marginLeft: 5 }} type="select" /></span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="办公地址">
                                {getFieldDecorator('pcd', {
                                    initialValue: pcd,
                                    rules: [{
                                        required: false, message: '请输入办公地址',
                                    }
                                    ]
                                })(
                                    <Cascader
                                        options={options}
                                        onChange={this.onChange}
                                        changeOnSelect={false}
                                        placeholder=" "
                                        showSearch={{ filter }}
                                    />
                                )
                                }
                            </FormItem>

                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="详细地址"
                            >
                                {getFieldDecorator('xxdz', {
                                    initialValue: item ? bgdz : '',
                                    rules: [{
                                        required: false, message: '请输入办公详细地址',
                                    },
                                    ],
                                })(
                                    <Input placeholder="详细地址" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="角色名称"
                            >
                                {getFieldDecorator('roleName', {
                                    rules: [{
                                        required: true, message: '请选择角色名称',
                                    }],
                                    // initialValue: (!data || data.roleName != null || data.roleName != undefined) || `${data[0].roleName}`,
                                })(
                                    <Select placeholder="请选择角色名称"
                                        mode="multiple"
                                        style={{ width: "450px" }}
                                        allowClear="true"
                                        onChange={this.roleNameChange}
                                        // onDeselect={this.roleNameDes} //取消选中时调用，参数为选中项的 value (或 key) 值
                                    >
                                        {data.map((data, i) => (
                                            <Select.Option value={data.roleId}>{data.roleName}</Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                className='textArea'
                                label="菜单名称"
                            >
                                {getFieldDecorator('menuName', {
                                    // rules: [{
                                    //     required: true, message: '请填写菜单名称',
                                    // }],
                                    initialValue: (!roleMenuList || roleMenuList == '' || roleMenuList == undefined) ? "" : `${
                                        roleMenuList.map(menuItem => menuItem.menuName)}`,
                                })(
                                    <TextArea autosize='true' disabled='true' style={{ resize: "none" }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="用户性别"
                            >
                                {getFieldDecorator('userSex', {
                                    initialValue: (!item || item.userSex === null || item.userSex === '-' || item.userSex === undefined) ? 'M' : `${item.userSex}`,
                                })(
                                    <Radio.Group disabled={!!(item && item.userId)} >
                                        <Radio value="M">男</Radio>
                                        <Radio value="F">女</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="企业管理员"
                            >
                                {getFieldDecorator('isEnterAdmin', {
                                    initialValue: (!item || item.isEnterAdmin === null || item.userSex === undefined) ? '1' : `${item.isEnterAdmin}`,
                                })(
                                    <Radio.Group >
                                        <Radio value="2">是</Radio>
                                        <Radio value="1">否</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button key="submit" type="primary" onClick={this.handleAddSubmit}>
                            保存
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.cancel}>
                            取消
                        </Button>
                    </div>
                </Form>
                <Modal
                    title="选择企业"
                    visible={selectEnterModalVisible}
                    closable={false}
                    footer={null}
                >
                    <SelectEnterprise
                        cancelMethod={this.handleModalVisible}
                        setEnteprise={this.setEnteprise}
                        onSelectRow={this.onSelectRow}
                        dispatch={this.props.dispatch}
                    />
                </Modal>
            </Card>);
    }
}
CosUserCreateForm = Form.create({})(CosUserCreateForm)
export default CosUserCreateForm;
