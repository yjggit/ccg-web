import React, { PureComponent } from 'react';
import {Table, Card, Row, Form, Select, Col, Input, Cascader, Button} from 'antd';
import './singleSearch.css';
import { stringify } from 'qs';
import PropTypes from "proptypes";
import styles from "./singleSearch.less";
import request from "../../utils/request";

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const FormItem = Form.Item;
const Search = Input.Search;
class SingleSearch extends PureComponent {

    state = {
        info: '',
        cate: 0,
        dataSource: {},
        phaseData: [],
        prices: {},
        pagination: {},
        loading: false,
        startDate: '',
        endDate: '',
        phase: [],
        cityArea: [],
        conditions: {
            infoType: 0,
            cities: [JSON.stringify({
                cityName: '成都市',
            })],
            infoName: '',
            months: ['四川省2019年01月信息价表']
        }
    };

    componentDidMount() {
        //初始内容请求参数
        const params = {
            infoType: 0,
            cities: [
                JSON.stringify({
                cityName: '成都市',
                // areas: ['大邑县'],
            }), ],
            infoName: '',//搜索的内容
            months: ['四川省2019年01月信息价表', '四川省2019年02月信息价表']
        };
        this.fetchSingle(params);

        this.fetchPhaseGroup();
    }

    fetchSingle = (param) => {
        this.setState({ loading: true });
        request(`/api/costs/filter?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            // data: {
            //     list: [{name, prices: {'': ''}}, {}],
            //     pagination: {},
            // }
            this.setState({
                dataSource: data,
                pagination: data.pagination,
                loading: false,
                prices: data.list.length > 0 ? data.list[0].prices : []
            });
        })
    };

    fetchPhaseGroup = () => {
        request(`/api/costs/periodGroup`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                phaseData: data,
            });
        })
    };

    handleSubmit() {

    }

    onSearch = (value, event) => {//infoName
        const { conditions } = this.state;
        this.setState({info: value});

        conditions.infoName = value;
        console.log(conditions);
        this.fetchSingle({
            ...conditions
        })
    };

    renderFormValue = (value) => {
        switch (value) {
            case 0:
                this.props.form.setFieldsValue({
                    city: ['成都市'],
                    phase: ['2019', '四川省2019年01月信息价表'],
                });
                this.setState({
                    cityArea: ['成都市'],
                    phase: ['2019', '四川省2019年01月信息价表']
                });
                break;
            case 1:
                this.props.form.setFieldsValue({
                    city: ['成都市'],
                    phase: ['2019', '成都市2019年01月信息价表'],
                });
                this.setState({
                    cityArea: ['成都市'],
                    phase: ['2019', '成都市2019年01月信息价表']
                });
                break;
            case 2:
                this.props.form.setFieldsValue({
                    city: ['绵阳市'],
                    phase: ['2019', '绵阳市2019年01月-02月信息价表'],
                });
                this.setState({
                    cityArea: ['绵阳市'],
                    phase: ['2019', '绵阳市2019年01月-02月信息价表']
                });
                break;
            case 3:
                this.props.form.setFieldsValue({
                    city: ['乐山市'],
                    phase: ['2019', '乐山市2019年01月信息价表'],
                });
                this.setState({
                    cityArea: ['乐山市'],
                    phase: ['2019', '乐山市2019年01月信息价表']
                });
                break;
        }
    };

    onChangeCate = (value) => {
        console.log(value);
        const { form } = this.props;
        const {cate, info} = this.state;
        if(value === cate) return;

        this.setState({cate: value}, () => {
            this.handleSearchChange();
        });
        this.renderFormValue(value);

    };

    handleSearchChange = () => {
        const {cate, info, phase, cityArea} = this.state;
        console.log('search before: phase ', phase);
        console.log('search before: city ', cityArea);
        const areas = [...cityArea];
        const params = {
            infoType: cate,
            infoName: info,
        };
        if(areas.length>1) {
            params.cities = [JSON.stringify({
                cityName: areas.shift(),
                areas: areas,
            })]
        }else if(areas.length === 1){
            params.cities = [JSON.stringify({
                cityName: areas.shift(),
            })]
        }else {
            switch (cate) {
                case 0:
                    params.cities = [JSON.stringify({
                        cityName: '成都市',
                    })];
                    break;
                case 1:
                    params.cities = [JSON.stringify({
                        cityName: '成都市',
                    })];
                    break;
                case 2:
                    params.cities = [JSON.stringify({
                        cityName: '绵阳市',
                    })];
                    break;
                case 3:
                    params.cities = [JSON.stringify({
                        cityName: '乐山市',
                    })];
                    break;
            }
        }

        if(phase.length>1) {
            phase.shift();
            params.months = phase;
        }else if(phase.length === 1) {
            params.months = phase;
        }else {
            switch (cate) {
                case 0:
                    params.months = ['四川省2019年01月信息价表'];
                    break;
                case 1:
                    params.months = ['成都市2019年01月信息价表'];
                    break;
                case 2:
                    params.months = ['绵阳市2019年01月-02月信息价表'];
                    break;
                case 3:
                    params.months = ['乐山市2019年01月信息价表'];
                    break;
            }
        }
        console.log('city after: ', params);
        this.setState({conditions: params});
        this.fetchSingle(params);

    };

    handleCityChange = (value, selectedOptions) => {
        // console.log('value: ', value);
        // console.log('selectedOptions: ', selectedOptions)
        const { form } = this.props;
        const {cate, info, phase} = this.state;

        this.setState({cityArea: value}, ()=> {
            this.handleSearchChange();
        });

    };

    handlePhaseChange = (value, selectedOptions) => {
        // console.log('value: ', value);
        // console.log('selectedOptions: ', selectedOptions)
        const { form } = this.props;
        const {cate, info} = this.state;
        this.setState({phase: value}, () => {
            this.handleSearchChange();
        });

    };

    displayRender = (label) => {
        // console.log("label", label)
        const {phase} = this.state;
        return label.length > 0 ? label[label.length - 1] : phase[phase.length - 1];
    };

    displayRenderCity = (label) => {
        // console.log("label city", label);
        const {cityArea} = this.state;
        return label.length > 0 ? label[label.length - 1] : cityArea[cityArea.length - 1];
    };

    renderSimpleForm() {
        console.log('enter render simple form')
        const { getFieldDecorator } = this.props.form;
        const {cate, phaseData} = this.state;
        // console.log('cate which? ', cate)
        let cities;
        let phase;
        // console.log('city which? ', cities)
        const phaseSC = [
            {
                value: '2019',
                label: '2019',
                children: []
            },
            {
                value: '2018',
                label: '2018',
                children: []
            },
        ];
        const phaseCD = [
            {
                value: '2019',
                label: '2019',
                children: []
            },
            {
                value: '2018',
                label: '2018',
                children: []
            },
        ];
        const phaseMY = [
            {
                value: '2019',
                label: '2019',
                children: []
            },
            {
                value: '2018',
                label: '2018',
                children: []
            },
        ];
        const phaseLS = [
            {
                value: '2019',
                label: '2019',
                children: []
            },
            {
                value: '2018',
                label: '2018',
                children: []
            },
        ];
        if(phaseData.length>0) {
            phaseData.forEach(item => {
                if(item.period.indexOf('四川省') >= 0) {
                    switch (item.year) {
                        case 2019:
                            phaseSC[0].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                        case 2018:
                            phaseSC[1].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                    }
                }else if(item.period.indexOf('成都市') >= 0) {
                    switch (item.year) {
                        case 2019:
                            phaseCD[0].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                        case 2018:
                            phaseCD[1].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                    }
                }else if(item.period.indexOf('绵阳市') >= 0) {
                    switch (item.year) {
                        case 2019:
                            phaseMY[0].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                        case 2018:
                            phaseMY[1].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                    }
                }else if(item.period.indexOf('乐山市') >= 0) {
                    switch (item.year) {
                        case 2019:
                            phaseLS[0].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                        case 2018:
                            phaseLS[1].children.push({
                                value: item.period,
                                label: item.period,
                            });
                            break;
                    }
                }
            })
        }
        // console.log('SC: ', phaseSC);
        // console.log('CD: ', phaseCD);
        // console.log('MY: ', phaseMY);

        switch (cate) {
            case 0:
                cities = [
                    {
                        value: '成都市',
                        label: '成都市',
                        children: [
                            {
                                value: '大邑县',
                                label: '大邑县',
                            }, {
                                value: '崇州市',
                                label: '崇州市',
                            }, {
                                value: '高新区',
                                label: '高新区',
                            }, {
                                value: '成都市区',
                                label: '成都市区',
                            }, {
                                value: '彭州市',
                                label: '彭州市',
                            }, {
                                value: '成都市',
                                label: '成都市',
                            }, {
                                value: '新津县',
                                label: '新津县',
                            }, {
                                value: '新都区',
                                label: '新都区',
                            }, {
                                value: '温江区',
                                label: '温江区',
                            }, {
                                value: '蒲江县',
                                label: '蒲江县',
                            }, {
                                value: '邛崃市',
                                label: '邛崃市',
                            }, {
                                value: '郫都区',
                                label: '郫都区',
                            }, {
                                value: '都江堰市',
                                label: '都江堰市',
                            }, {
                                value: '金堂县',
                                label: '金堂县',
                            }, {
                                value: '青白江区',
                                label: '青白江区',
                            }, {
                                value: '龙泉驿区',
                                label: '龙泉驿区',
                            }, {
                                value: '天府新区',
                                label: '天府新区',
                            }, {
                                value: '双流区',
                                label: '双流区',
                            }, {
                                value: '简阳市',
                                label: '简阳市',
                            }, ],
                    },
                    {
                        value: '绵阳市',
                        label: '绵阳市',
                        children: [
                            {
                                value: '三台县',
                                label: '三台县',
                            }, {
                                value: '北川县',
                                label: '北川县',
                            }, {
                                value: '安州区',
                                label: '安州区',
                            }, {
                                value: '市区',
                                label: '市区',
                            }, {
                                value: '平武县',
                                label: '平武县',
                            }, {
                                value: '梓潼县',
                                label: '梓潼县',
                            }, {
                                value: '江油市',
                                label: '江油市',
                            }, {
                                value: '盐亭县',
                                label: '盐亭县',
                            }, {
                                value: '绵阳市区',
                                label: '绵阳市区',
                            }]
                    },
                    {
                        value: '自贡市',
                        label: '自贡市',
                        children: [
                            {
                                value: '富顺县',
                                label: '富顺县',
                            }, {
                                value: '自贡市区',
                                label: '自贡市区',
                            }, {
                                value: '荣县',
                                label: '荣县',
                            }]
                    },
                    {
                        value: '攀枝花市',
                        label: '攀枝花市',
                        children: [
                            {
                                value: '攀枝花市区',
                                label: '攀枝花市区',
                            }, {
                                value: '米易县',
                                label: '米易县',
                            }, {
                                value: '盐边北部',
                                label: '盐边北部',
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
                                value: '叙永县',
                                label: '叙永县',
                            }, {
                                value: '古蔺县',
                                label: '古蔺县',
                            }, {
                                value: '合江县',
                                label: '合江县',
                            }, {
                                value: '泸县',
                                label: '泸县',
                            }, {
                                value: '泸州市区',
                                label: '泸州市区',
                            }, {
                                value: '龙马潭区',
                                label: '龙马潭区',
                            }, {
                                value: '纳溪区',
                                label: '纳溪区',
                            },]
                    },
                    {
                        value: '德阳市',
                        label: '德阳市',
                        children: [
                            {
                                value: '中江县',
                                label: '中江县',
                            }, {
                                value: '什邡市',
                                label: '什邡市',
                            }, {
                                value: '广汉市',
                                label: '广汉市',
                            }, {
                                value: '德阳市区',
                                label: '德阳市区',
                            }, {
                                value: '绵竹市',
                                label: '绵竹市',
                            }, {
                                value: '罗江县',
                                label: '罗江县',
                            }, ]
                    },
                    {
                        value: '广元市',
                        label: '广元市',
                        children: [
                            {
                                value: '广元市',
                                label: '广元市',
                            }]
                    },
                    {
                        value: '遂宁市',
                        label: '遂宁市',
                        children: [
                            {
                                value: '大英县',
                                label: '大英县',
                            }, {
                                value: '安居区',
                                label: '安居区',
                            }, {
                                value: '射洪县',
                                label: '射洪县',
                            }, {
                                value: '蓬溪县',
                                label: '蓬溪县',
                            }, {
                                value: '遂宁市区',
                                label: '遂宁市区',
                            }]
                    },
                    {
                        value: '内江市',
                        label: '内江市',
                        children: [
                            {
                                value: '内江市区',
                                label: '内江市区',
                            }, {
                                value: '威远县',
                                label: '威远县',
                            }, {
                                value: '资中县',
                                label: '资中县',
                            },  {
                                value: '隆昌县',
                                label: '隆昌县',
                            }]
                    },
                    {
                        value: '乐山市',
                        label: '乐山市',
                        children: [
                            {
                                value: '乐山市区',
                                label: '乐山市区',
                            }, {
                                value: '峨眉山市',
                                label: '峨眉山市',
                            }, {
                                value: '犍为',
                                label: '犍为',
                            }, {
                                value: '峨边',
                                label: '峨边',
                            }, {
                                value: '夹江',
                                label: '夹江',
                            }, {
                                value: '金口河',
                                label: '金口河',
                            },  {
                                value: '井研',
                                label: '井研',
                            }, {
                                value: '马边',
                                label: '马边',
                            }, {
                                value: '沐川',
                                label: '沐川',
                            }, {
                                value: '沙湾',
                                label: '沙湾',
                            }, {
                                value: '五通',
                                label: '五通',
                            }, ]
                    },
                    {
                        value: '资阳市',
                        label: '资阳市',
                        children: [
                            {
                                value: '乐至县',
                                label: '乐至县',
                            }, {
                                value: '安岳县',
                                label: '安岳县',
                            }, {
                                value: '资阳市区',
                                label: '资阳市区',
                            }, ],
                    },
                    {
                        value: '宜宾市',
                        label: '宜宾市',
                        children: [
                            {
                                value: '兴文县',
                                label: '兴文县',
                            }, {
                                value: '南溪区',
                                label: '南溪区',
                            }, {
                                value: '宜宾市区',
                                label: '宜宾市区',
                            }, {
                                value: '屏山县',
                                label: '屏山县',
                            }, {
                                value: '屏山新城',
                                label: '屏山新城',
                            }, {
                                value: '市区',
                                label: '市区',
                            }, {
                                value: '江安县',
                                label: '江安县',
                            }, {
                                value: '珙县',
                                label: '珙县',
                            }, {
                                value: '筠连县',
                                label: '筠连县',
                            }, {
                                value: '长宁县',
                                label: '长宁县',
                            }, {
                                value: '高县',
                                label: '高县',
                            }, {
                                value: '屏山书楼镇',
                                label: '屏山书楼镇',
                            }, {
                                value: '屏山其他乡镇',
                                label: '屏山其他乡镇',
                            }, ]
                    },
                    {
                        value: '南充市',
                        label: '南充市',
                        children: [
                            {
                                value: '仪陇县',
                                label: '仪陇县',
                            }, {
                                value: '南充市区',
                                label: '南充市区',
                            }, {
                                value: '南部县',
                                label: '南部县',
                            }, {
                                value: '营山县',
                                label: '营山县',
                            }, {
                                value: '蓬安县',
                                label: '蓬安县',
                            }, {
                                value: '西充县',
                                label: '西充县',
                            }, {
                                value: '阆中市',
                                label: '阆中市',
                            }, ]
                    },
                    {
                        value: '达州市',
                        label: '达州市',
                        children: [
                            {
                                value: '万源市',
                                label: '万源市',
                            }, {
                                value: '大竹县',
                                label: '大竹县',
                            }, {
                                value: '宣汉县',
                                label: '宣汉县',
                            }, {
                                value: '开江县',
                                label: '开江县',
                            }, {
                                value: '渠县',
                                label: '渠县',
                            },  {
                                value: '达州市区',
                                label: '达州市区',
                            }, {
                                value: '通川区',
                                label: '通川区',
                            }, {
                                value: '达州经开区',
                                label: '达州经开区',
                            }, {
                                value: '达川区',
                                label: '达川区',
                            }, ]
                    },
                    {
                        value: '雅安市',
                        label: '雅安市',
                        children: [
                            {
                                value: '名山区',
                                label: '名山区',
                            }, {
                                value: '雅安市区',
                                label: '雅安市区',
                            }, {
                                value: '荥经县',
                                label: '荥经县',
                            }, {
                                value: '汉源县',
                                label: '汉源县',
                            }, {
                                value: '石棉县',
                                label: '石棉县',
                            }, {
                                value: '天全县',
                                label: '天全县',
                            }, {
                                value: '庐山县',
                                label: '庐山县',
                            }, {
                                value: '宝兴县',
                                label: '宝兴县',
                            }]
                    },
                    {
                        value: '阿坝州',
                        label: '阿坝州',
                        children: [
                            {
                                value: '九寨沟县',
                                label: '九寨沟县',
                            }, {
                                value: '壤塘县',
                                label: '壤塘县',
                            }, {
                                value: '小金县',
                                label: '小金县',
                            }, {
                                value: '松潘县',
                                label: '松潘县',
                            }, {
                                value: '汶川县',
                                label: '汶川县',
                            }, {
                                value: '理县',
                                label: '理县',
                            }, {
                                value: '红原县',
                                label: '红原县',
                            }, {
                                value: '若尔盖县',
                                label: '若尔盖县',
                            }, {
                                value: '茂县',
                                label: '茂县',
                            }, {
                                value: '金川县',
                                label: '金川县',
                            }, {
                                value: '阿坝县',
                                label: '阿坝县',
                            }, {
                                value: '马尔康',
                                label: '马尔康',
                            }, {
                                value: '黑水县',
                                label: '黑水县',
                            }, ],
                    },
                    {
                        value: '甘孜州',
                        label: '甘孜州',
                        children: [
                            {
                                value: '丹巴县',
                                label: '丹巴县',
                            }, {
                                value: '九龙县',
                                label: '九龙县',
                            }, {
                                value: '康定市',
                                label: '康定市',
                            }, {
                                value: '新龙县',
                                label: '新龙县',
                            }, {
                                value: '泸定县',
                                label: '泸定县',
                            }, {
                                value: '理塘县',
                                label: '理塘县',
                            }, {
                                value: '甘孜县',
                                label: '甘孜县',
                            }, {
                                value: '甘孜州',
                                label: '甘孜州',
                            }, {
                                value: '石渠县',
                                label: '石渠县',
                            }, {
                                value: '道孚县',
                                label: '道孚县',
                            }, {
                                value: '雅江县',
                                label: '雅江县',
                            }, {
                                value: '德格县',
                                label: '德格县',
                            }, {
                                value: '色达县',
                                label: '色达县',
                            }, {
                                value: '巴塘县',
                                label: '巴塘县',
                            }, {
                                value: '炉霍县',
                                label: '炉霍县',
                            }, {
                                value: '白玉县',
                                label: '白玉县',
                            }, {
                                value: '得荣县',
                                label: '得荣县',
                            }, {
                                value: '乡城县',
                                label: '乡城县',
                            }, {
                                value: '稻城县',
                                label: '稻城县',
                            }, ],
                    },
                    {
                        value: '凉山州',
                        label: '凉山州',
                        children: [
                            {
                                value: '会东县',
                                label: '会东县',
                            }, {
                                value: '会理县',
                                label: '会理县',
                            }, {
                                value: '冕宁县',
                                label: '冕宁县',
                            }, {
                                value: '喜德县',
                                label: '喜德县',
                            }, {
                                value: '宁南县',
                                label: '宁南县',
                            }, {
                                value: '布拖县',
                                label: '布拖县',
                            }, {
                                value: '德昌县',
                                label: '德昌县',
                            }, {
                                value: '昭觉县',
                                label: '昭觉县',
                            }, {
                                value: '普格县',
                                label: '普格县',
                            }, {
                                value: '木里县',
                                label: '木里县',
                            }, {
                                value: '甘洛县',
                                label: '甘洛县',
                            }, {
                                value: '盐源县',
                                label: '盐源县',
                            }, {
                                value: '美姑县',
                                label: '美姑县',
                            }, {
                                value: '西昌市',
                                label: '西昌市',
                            }, {
                                value: '越西县',
                                label: '越西县',
                            }, {
                                value: '金阳县',
                                label: '金阳县',
                            }, {
                                value: '雷波县',
                                label: '雷波县',
                            }, ],
                    },
                    {
                        value: '广安市',
                        label: '广安市',
                        children: [
                            {
                                value: '华蓥市',
                                label: '华蓥市',
                            }, {
                                value: '岳池区',
                                label: '岳池区',
                            }, {
                                value: '广安市区',
                                label: '广安市区',
                            }, {
                                value: '武胜县',
                                label: '武胜县',
                            }, {
                                value: '邻水县',
                                label: '邻水县',
                            }, {
                                value: '前锋区',
                                label: '前锋区',
                            }, ]
                    },
                    {
                        value: '巴中市',
                        label: '巴中市',
                        children: [
                            {
                                value: '南江县',
                                label: '南江县',
                            }, {
                                value: '巴中市区',
                                label: '巴中市区',
                            }, {
                                value: '平昌县',
                                label: '平昌县',
                            }, {
                                value: '通江县',
                                label: '通江县',
                            }]
                    },
                    {
                        value: '眉山市',
                        label: '眉山市',
                        children: [
                            {
                                value: '丹棱县',
                                label: '丹棱县',
                            }, {
                                value: '仁寿县',
                                label: '仁寿县',
                            }, {
                                value: '彭山区',
                                label: '彭山区',
                            }, {
                                value: '洪雅县',
                                label: '洪雅县',
                            }, {
                                value: '眉山市区',
                                label: '眉山市区',
                            }, {
                                value: '青神县',
                                label: '青神县',
                            },],
                    },

                ];
                phase = phaseSC;
                break;
            case 1:
                cities = [{
                    value: '成都市',
                    label: '成都市',
                    children: [
                        {
                            value: '双流县',
                            label: '双流县',
                        }, {
                            value: '大邑县',
                            label: '大邑县',
                        }, {
                            value: '崇州市',
                            label: '崇州市',
                        }, {
                            value: '市区',
                            label: '市区',
                        }, {
                            value: '彭州市',
                            label: '彭州市',
                        }, {
                            value: '新津县',
                            label: '新津县',
                        }, {
                            value: '新都区',
                            label: '新都区',
                        }, {
                            value: '温江区',
                            label: '温江区',
                        }, {
                            value: '蒲江县',
                            label: '蒲江县',
                        }, {
                            value: '邛崃市',
                            label: '邛崃市',
                        }, {
                            value: '都江堰市',
                            label: '都江堰市',
                        }, {
                            value: '金堂县',
                            label: '金堂县',
                        }, {
                            value: '青白江区',
                            label: '青白江区',
                        }, {
                            value: '龙泉驿区',
                            label: '龙泉驿区',
                        }, {
                            value: '天府新区',
                            label: '天府新区',
                        }, {
                            value: '双流区',
                            label: '双流区',
                        }, {
                            value: '简阳市',
                            label: '简阳市',
                        }, {
                            value: '郫都区',
                            label: '郫都区',
                        }, {
                            value: '天府机场片区',
                            label: '天府机场片区',
                        }, {
                            value: '成都市高新东区',
                            label: '成都市高新东区',
                        }
                    ]
                }];
                phase = phaseCD;
                break;
            case 2:
                cities = [{
                    value: '绵阳市',
                    label: '绵阳市',
                    children: [
                        {
                            value: '绵阳市',
                            label: '绵阳市',
                        }
                    ]
                }];
                phase = phaseMY;
                break;
            case 3:
                cities = [{
                    value: '乐山市',
                    label: '乐山市',
                    children: [
                        {
                            value: '市中区',
                            label: '市中区',
                        },
                        {
                            value: '沙湾区',
                            label: '沙湾区',
                        },
                        {
                            value: '五通桥区',
                            label: '五通桥区',
                        },
                        {
                            value: '金口河区',
                            label: '金口河区',
                        },
                        {
                            value: '犍为县',
                            label: '犍为县',
                        },
                        {
                            value: '井研县',
                            label: '井研区',
                        },
                        {
                            value: '夹江县',
                            label: '夹江县',
                        },
                        {
                            value: '沐川县',
                            label: '沐川县',
                        },
                        {
                            value: '峨边彝族自治县',
                            label: '峨边彝族自治县',
                        },
                        {
                            value: '马边彝族自治县',
                            label: '马边彝族自治县',
                        },
                        {
                            value: '峨眉山市',
                            label: '峨眉山市',
                        },
                        {
                            value: '乐山市区',
                            label: '乐山市区',
                        },
                    ]
                }];
                phase = phaseLS;
                break;
        }


        return (
            <div >
                <Row>
                    <Form onSubmit={this.handleSubmit} layout="inline">
                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="信息分类：">
                                {getFieldDecorator('category', {initialValue: 0})(
                                    <Select placeholder="请选择" style={{width:300}} onChange={this.onChangeCate}>
                                        <Select.Option value={0}>四川省站造价信息</Select.Option>
                                        <Select.Option value={1}>成都市站造价信息</Select.Option>
                                        <Select.Option value={2}>绵阳市站造价信息</Select.Option>
                                        <Select.Option value={3}>乐山市站造价信息</Select.Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="城市：">
                                {getFieldDecorator('city', {initialValue: ['成都市']})(
                                    <Cascader
                                        style={{width: 300}}
                                        expandTrigger="hover"
                                        options={cities}
                                        displayRender={this.displayRenderCity}
                                        onChange={this.handleCityChange}
                                        placeholder="请选择"
                                        changeOnSelect
                                        // allowClear={true}
                                    />
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="期数：">
                                {getFieldDecorator('phase', {initialValue: ['2019', '四川省2019年01月信息价表']})(
                                    <Cascader
                                        style={{width: 300}}
                                        // expandTrigger="hover"
                                        displayRender={this.displayRender}
                                        options={phase}
                                        onChange={this.handlePhaseChange}
                                        // allowClear={true}
                                        placeholder="请选择"
                                    />
                                )}
                            </FormItem>
                        </Col>


                    </Form>
                </Row>
            </div>
        )
    }

    handleTableChange = (pagination, filtersArg, sorter) => {
        this.setState({ pagination }, () => {
            let { conditions } = this.state;
            this.fetchSingle({
                ...conditions,
                currentPage: pagination.current,
                pageSize: pagination.pageSize
            })
        });
    };

    handleReset = () => {
        const {conditions} = this.state;
        this.setState({
            info: ''
        });

        this.fetchSingle({
           ...conditions,
           infoName: ''
        });
    };

    render() {

        const {dataSource, prices, cityArea, loading, pagination} = this.state;
        // console.log('choose cityArea: ', cityArea);
        const cols = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '规格',
                dataIndex: 'specs',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
            {
                title: '除税价（元）',
                children: [],
            }
        ];

        if(cityArea.length>1) {//细分到区、县时，列表只显示1列
            if (prices.hasOwnProperty(cityArea[cityArea.length - 1]))
                cols[cols.length - 1].children.push({
                    title: cityArea[cityArea.length - 1],
                    dataIndex: cityArea[cityArea.length - 1],
                });
        }else {
            for(let p in prices) {
                if (prices.hasOwnProperty(p))
                    cols[cols.length-1].children.push({
                        title: p,
                        dataIndex: p,
                    });
            }
        }


        // console.log('cols: ', cols);

        const sheet = [];
        if(dataSource.list) {
            dataSource.list.forEach(item => {
                sheet.push({
                    id: item._id,
                    name: item.name,
                    specs: item.specification,
                    unit: item.unit,
                    ...item.prices,
                })
            });
        }
        // console.log('sheets: ', sheet);

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: pagination.total,
            current: pagination.current,
            pageSize: pagination.pageSize,
            showTotal: () => `总共 ${pagination.total} 记录`
        };

        return (

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div >
                            <div className={styles.tableListForm}>
                                {this.renderSimpleForm()}
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <Search
                                    style={{width: 400}}
                                    placeholder="输入名称规格"
                                    enterButton="搜索"
                                    size="large"
                                    value={this.state.info}
                                    onChange={(e) => this.setState({info: e.target.value})}
                                    onSearch={this.onSearch}
                                />
                                <Button size='large' type="danger" onClick={this.handleReset}
                                        style={{marginLeft: 20, backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19'}}>重置</Button>
                            </div>

                            <div className="header">
                                <span className="tips">提示：</span>
                                <span >材料信息价中除“白水泥、页岩多孔砖、页岩配砖、锯材”外，其他材料信息价，均不包含“运杂费、运输损耗费、采购及保管费及运至施工现场仓库的费用”</span>
                            </div>
                            <Table
                                bordered={true}
                                columns={cols}
                                dataSource={sheet}
                                rowKey={record => record.id}
                                // rowSelection={rowSelection}
                                pagination={paginationProps}
                                loading={loading}
                                onChange={this.handleTableChange}
                            />


                        </div>
                    </div>
                </Card>


        );
    }
}
// News.contextTypes = {
//     router: PropTypes.object.isRequired
// };
SingleSearch = Form.create({})(SingleSearch);
export default SingleSearch;
