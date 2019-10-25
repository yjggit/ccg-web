import React, {PureComponent} from 'react';
import {Card, Checkbox, Col, Divider, Form, Input, Popover, Row, Table, Button} from 'antd';
import './combine.css';
import { stringify } from 'qs';
import RadioGroup from "antd/lib/radio/group";
import RadioButton from "antd/lib/radio/radioButton";
import request from "../../utils/request";

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
class CombineSearch extends PureComponent {

    state = {
        info: '',
        phaseData: [],
        dataSource: [],
        pagination: {},
        loading: false,
        cate: 0,
        year: -1,
        options: [],
        optionCD: [],
        optionMY: [],
        years: [],
        phaseSC: [],
        phaseCD: [],
        phaseMY: [],
        groupData: [],
        checkedAreas: [],
        checkedYears: [],
        cityObject: {},
        conditions: {}
    };

    componentDidMount() {


        // this.fetchCombine();
        const options = [
            {
                value: '成都市',
                label: '成都市',
                children: [
                    {
                        value: '成都市:大邑县',
                        label: '大邑县',
                    }, {
                        value: '成都市:崇州市',
                        label: '崇州市',
                    }, {
                        value: '成都市:成都市区',
                        label: '成都市区',
                    }, {
                        value: '成都市:彭州市',
                        label: '彭州市',
                    }, {
                        value: '成都市:成都市',
                        label: '成都市',
                    }, {
                        value: '成都市:新津县',
                        label: '新津县',
                    }, {
                        value: '成都市:新都区',
                        label: '新都区',
                    }, {
                        value: '成都市:温江区',
                        label: '温江区',
                    }, {
                        value: '成都市:蒲江县',
                        label: '蒲江县',
                    }, {
                        value: '成都市:邛崃市',
                        label: '邛崃市',
                    }, {
                        value: '成都市:郫都区',
                        label: '郫都区',
                    }, {
                        value: '成都市:都江堰市',
                        label: '都江堰市',
                    }, {
                        value: '成都市:金堂县',
                        label: '金堂县',
                    }, {
                        value: '成都市:青白江区',
                        label: '青白江区',
                    }, {
                        value: '成都市:龙泉驿区',
                        label: '龙泉驿区',
                    }, {
                        value: '成都市:天府新区',
                        label: '天府新区',
                    }, {
                        value: '成都市:双流区',
                        label: '双流区',
                    }, {
                        value: '成都市:简阳市',
                        label: '简阳市',
                    }, ],
            },
            {
                value: '绵阳市',
                label: '绵阳市',
                children: [
                    {
                        value: '绵阳市:三台县',
                        label: '三台县',
                    }, {
                        value: '绵阳市:北川县',
                        label: '北川县',
                    }, {
                        value: '绵阳市:安州区',
                        label: '安州区',
                    }, {
                        value: '绵阳市:市区',
                        label: '市区',
                    }, {
                        value: '绵阳市:平武县',
                        label: '平武县',
                    }, {
                        value: '绵阳市:梓潼县',
                        label: '梓潼县',
                    }, {
                        value: '绵阳市:江油市',
                        label: '江油市',
                    }, {
                        value: '绵阳市:盐亭县',
                        label: '盐亭县',
                    }, {
                        value: '绵阳市:绵阳市区',
                        label: '绵阳市区',
                    }]
            },
            {
                value: '自贡市',
                label: '自贡市',
                children: [
                    {
                        value: '自贡市:富顺县',
                        label: '富顺县',
                    }, {
                        value: '自贡市:自贡市区',
                        label: '自贡市区',
                    }, {
                        value: '自贡市:荣县',
                        label: '荣县',
                    }]
            },
            {
                value: '攀枝花市',
                label: '攀枝花市',
                children: [
                    {
                        value: '攀枝花市:攀枝花市区',
                        label: '攀枝花市区',
                    }, {
                        value: '攀枝花市:米易县',
                        label: '米易县',
                    }, {
                        value: '攀枝花市:盐边北部',
                        label: '盐边北部',
                    }, {
                        value: '攀枝花市:盐边县',
                        label: '盐边县',
                    }]
            },
            {
                value: '泸州市',
                label: '泸州市',
                children: [
                    {
                        value: '泸州市:叙永县',
                        label: '叙永县',
                    }, {
                        value: '泸州市:古蔺县',
                        label: '古蔺县',
                    }, {
                        value: '泸州市:合江县',
                        label: '合江县',
                    }, {
                        value: '泸州市:泸县',
                        label: '泸县',
                    }, {
                        value: '泸州市:泸州市区',
                        label: '泸州市区',
                    }, {
                        value: '泸州市:龙马潭区',
                        label: '龙马潭区',
                    }, {
                        value: '泸州市:纳溪区',
                        label: '纳溪区',
                    },]
            },
            {
                value: '德阳市',
                label: '德阳市',
                children: [
                    {
                        value: '德阳市:中江县',
                        label: '中江县',
                    }, {
                        value: '德阳市:什邡市',
                        label: '什邡市',
                    }, {
                        value: '德阳市:广汉市',
                        label: '广汉市',
                    }, {
                        value: '德阳市:德阳市区',
                        label: '德阳市区',
                    }, {
                        value: '德阳市:绵竹市',
                        label: '绵竹市',
                    }, {
                        value: '德阳市:罗江县',
                        label: '罗江县',
                    }, ]
            },
            {
                value: '广元市',
                label: '广元市',
                children: [
                    {
                        value: '广元市:广元市',
                        label: '广元市',
                    }]
            },
            {
                value: '遂宁市',
                label: '遂宁市',
                children: [
                    {
                        value: '遂宁市:大英县',
                        label: '大英县',
                    }, {
                        value: '遂宁市:安居区',
                        label: '安居区',
                    }, {
                        value: '遂宁市:射洪县',
                        label: '射洪县',
                    }, {
                        value: '遂宁市:蓬溪县',
                        label: '蓬溪县',
                    }, {
                        value: '遂宁市:遂宁市区',
                        label: '遂宁市区',
                    }]
            },
            {
                value: '内江市',
                label: '内江市',
                children: [
                    {
                        value: '内江市:内江市区',
                        label: '内江市区',
                    }, {
                        value: '内江市:威远县',
                        label: '威远县',
                    }, {
                        value: '内江市:资中县',
                        label: '资中县',
                    },  {
                        value: '内江市:隆昌县',
                        label: '隆昌县',
                    }]
            },
            {
                value: '乐山市',
                label: '乐山市',
                children: [
                    {
                        value: '乐山市:乐山市区',
                        label: '乐山市区',
                    }, {
                        value: '乐山市:峨眉山市',
                        label: '峨眉山市',
                    }, {
                        value: '乐山市:犍为',
                        label: '犍为',
                    }, {
                        value: '乐山市:峨边',
                        label: '峨边',
                    }, {
                        value: '乐山市:夹江',
                        label: '夹江',
                    }, {
                        value: '乐山市:金口河',
                        label: '金口河',
                    },  {
                        value: '乐山市:井研',
                        label: '井研',
                    }, {
                        value: '乐山市:马边',
                        label: '马边',
                    }, {
                        value: '乐山市:沐川',
                        label: '沐川',
                    }, {
                        value: '乐山市:沙湾',
                        label: '沙湾',
                    }, {
                        value: '乐山市:五通',
                        label: '五通',
                    }, ]
            },
            {
                value: '资阳市',
                label: '资阳市',
                children: [
                    {
                        value: '资阳市:乐至县',
                        label: '乐至县',
                    }, {
                        value: '资阳市:安岳县',
                        label: '安岳县',
                    }, {
                        value: '资阳市:资阳市区',
                        label: '资阳市区',
                    }, ],
            },
            {
                value: '宜宾市',
                label: '宜宾市',
                children: [
                    {
                        value: '宜宾市:兴文县',
                        label: '兴文县',
                    }, {
                        value: '宜宾市:南溪区',
                        label: '南溪区',
                    }, {
                        value: '宜宾市:宜宾市区',
                        label: '宜宾市区',
                    }, {
                        value: '宜宾市:屏山县',
                        label: '屏山县',
                    }, {
                        value: '宜宾市:屏山新城',
                        label: '屏山新城',
                    }, {
                        value: '宜宾市:市区',
                        label: '市区',
                    }, {
                        value: '宜宾市:江安县',
                        label: '江安县',
                    }, {
                        value: '宜宾市:珙县',
                        label: '珙县',
                    }, {
                        value: '宜宾市:筠连县',
                        label: '筠连县',
                    }, {
                        value: '宜宾市:长宁县',
                        label: '长宁县',
                    }, {
                        value: '宜宾市:高县',
                        label: '高县',
                    }, {
                        value: '宜宾市:屏山书楼镇',
                        label: '屏山书楼镇',
                    }, {
                        value: '宜宾市:屏山其他乡镇',
                        label: '屏山其他乡镇',
                    }, ]
            },
            {
                value: '南充市',
                label: '南充市',
                children: [
                    {
                        value: '南充市:仪陇县',
                        label: '仪陇县',
                    }, {
                        value: '南充市:南充市区',
                        label: '南充市区',
                    }, {
                        value: '南充市:南部县',
                        label: '南部县',
                    }, {
                        value: '南充市:营山县',
                        label: '营山县',
                    }, {
                        value: '南充市:蓬安县',
                        label: '蓬安县',
                    }, {
                        value: '南充市:西充县',
                        label: '西充县',
                    }, {
                        value: '南充市:阆中市',
                        label: '阆中市',
                    }, ]
            },
            {
                value: '达州市',
                label: '达州市',
                children: [
                    {
                        value: '达州市:万源市',
                        label: '万源市',
                    }, {
                        value: '达州市:大竹县',
                        label: '大竹县',
                    }, {
                        value: '达州市:宣汉县',
                        label: '宣汉县',
                    }, {
                        value: '达州市:开江县',
                        label: '开江县',
                    }, {
                        value: '达州市:渠县',
                        label: '渠县',
                    },  {
                        value: '达州市:达州市区',
                        label: '达州市区',
                    }, {
                        value: '达州市:通川区',
                        label: '通川区',
                    }, {
                        value: '达州市:达州经开区',
                        label: '达州经开区',
                    }, {
                        value: '达州市:达川区',
                        label: '达川区',
                    }, ]
            },
            {
                value: '雅安市',
                label: '雅安市',
                children: [
                    {
                        value: '雅安市:名山区',
                        label: '名山区',
                    }, {
                        value: '雅安市:雅安市区',
                        label: '雅安市区',
                    }, {
                        value: '雅安市:荥经县',
                        label: '荥经县',
                    }, {
                        value: '雅安市:汉源县',
                        label: '汉源县',
                    }, {
                        value: '雅安市:石棉县',
                        label: '石棉县',
                    }, {
                        value: '雅安市:天全县',
                        label: '天全县',
                    }, {
                        value: '雅安市:庐山县',
                        label: '庐山县',
                    }, {
                        value: '雅安市:宝兴县',
                        label: '宝兴县',
                    }]
            },
            {
                value: '阿坝州',
                label: '阿坝州',
                children: [
                    {
                        value: '阿坝州:九寨沟县',
                        label: '九寨沟县',
                    }, {
                        value: '阿坝州:壤塘县',
                        label: '壤塘县',
                    }, {
                        value: '阿坝州:小金县',
                        label: '小金县',
                    }, {
                        value: '阿坝州:松潘县',
                        label: '松潘县',
                    }, {
                        value: '阿坝州:汶川县',
                        label: '汶川县',
                    }, {
                        value: '阿坝州:理县',
                        label: '理县',
                    }, {
                        value: '阿坝州:红原县',
                        label: '红原县',
                    }, {
                        value: '阿坝州:若尔盖县',
                        label: '若尔盖县',
                    }, {
                        value: '阿坝州:茂县',
                        label: '茂县',
                    }, {
                        value: '阿坝州:金川县',
                        label: '金川县',
                    }, {
                        value: '阿坝州:阿坝县',
                        label: '阿坝县',
                    }, {
                        value: '阿坝州:马尔康',
                        label: '马尔康',
                    }, {
                        value: '阿坝州:黑水县',
                        label: '黑水县',
                    }, ],
            },
            {
                value: '甘孜州',
                label: '甘孜州',
                children: [
                    {
                        value: '甘孜州:丹巴县',
                        label: '丹巴县',
                    }, {
                        value: '甘孜州:九龙县',
                        label: '九龙县',
                    }, {
                        value: '甘孜州:康定市',
                        label: '康定市',
                    }, {
                        value: '甘孜州:新龙县',
                        label: '新龙县',
                    }, {
                        value: '甘孜州:泸定县',
                        label: '泸定县',
                    }, {
                        value: '甘孜州:理塘县',
                        label: '理塘县',
                    }, {
                        value: '甘孜州:甘孜县',
                        label: '甘孜县',
                    }, {
                        value: '甘孜州:甘孜州',
                        label: '甘孜州',
                    }, {
                        value: '甘孜州:石渠县',
                        label: '石渠县',
                    }, {
                        value: '甘孜州:道孚县',
                        label: '道孚县',
                    }, {
                        value: '甘孜州:雅江县',
                        label: '雅江县',
                    }, {
                        value: '甘孜州:德格县',
                        label: '德格县',
                    }, {
                        value: '甘孜州:色达县',
                        label: '色达县',
                    }, {
                        value: '甘孜州:巴塘县',
                        label: '巴塘县',
                    }, {
                        value: '甘孜州:炉霍县',
                        label: '炉霍县',
                    }, {
                        value: '甘孜州:白玉县',
                        label: '白玉县',
                    }, {
                        value: '甘孜州:得荣县',
                        label: '得荣县',
                    }, {
                        value: '甘孜州:乡城县',
                        label: '乡城县',
                    }, {
                        value: '甘孜州:稻城县',
                        label: '稻城县',
                    }, ],
            },
            {
                value: '凉山州',
                label: '凉山州',
                children: [
                    {
                        value: '凉山州:会东县',
                        label: '会东县',
                    }, {
                        value: '凉山州:会理县',
                        label: '会理县',
                    }, {
                        value: '凉山州:冕宁县',
                        label: '冕宁县',
                    }, {
                        value: '凉山州:喜德县',
                        label: '喜德县',
                    }, {
                        value: '凉山州:宁南县',
                        label: '宁南县',
                    }, {
                        value: '凉山州:布拖县',
                        label: '布拖县',
                    }, {
                        value: '凉山州:德昌县',
                        label: '德昌县',
                    }, {
                        value: '凉山州:昭觉县',
                        label: '昭觉县',
                    }, {
                        value: '凉山州:普格县',
                        label: '普格县',
                    }, {
                        value: '凉山州:木里县',
                        label: '木里县',
                    }, {
                        value: '凉山州:甘洛县',
                        label: '甘洛县',
                    }, {
                        value: '凉山州:盐源县',
                        label: '盐源县',
                    }, {
                        value: '凉山州:美姑县',
                        label: '美姑县',
                    }, {
                        value: '凉山州:西昌市',
                        label: '西昌市',
                    }, {
                        value: '凉山州:越西县',
                        label: '越西县',
                    }, {
                        value: '凉山州:金阳县',
                        label: '金阳县',
                    }, {
                        value: '凉山州:雷波县',
                        label: '雷波县',
                    }, ],
            },
            {
                value: '广安市',
                label: '广安市',
                children: [
                    {
                        value: '广安市:华蓥市',
                        label: '华蓥市',
                    }, {
                        value: '广安市:岳池区',
                        label: '岳池区',
                    }, {
                        value: '广安市:广安市区',
                        label: '广安市区',
                    }, {
                        value: '广安市:武胜县',
                        label: '武胜县',
                    }, {
                        value: '广安市:邻水县',
                        label: '邻水县',
                    }, {
                        value: '广安市:前锋区',
                        label: '前锋区',
                    }, ]
            },
            {
                value: '巴中市',
                label: '巴中市',
                children: [
                    {
                        value: '巴中市:南江县',
                        label: '南江县',
                    }, {
                        value: '巴中市:巴中市区',
                        label: '巴中市区',
                    }, {
                        value: '巴中市:平昌县',
                        label: '平昌县',
                    }, {
                        value: '巴中市:通江县',
                        label: '通江县',
                    }]
            },
            {
                value: '眉山市',
                label: '眉山市',
                children: [
                    {
                        value: '眉山市:丹棱县',
                        label: '丹棱县',
                    }, {
                        value: '眉山市:仁寿县',
                        label: '仁寿县',
                    }, {
                        value: '眉山市:彭山区',
                        label: '彭山区',
                    }, {
                        value: '眉山市:洪雅县',
                        label: '洪雅县',
                    }, {
                        value: '眉山市:眉山市区',
                        label: '眉山市区',
                    }, {
                        value: '眉山市:青神县',
                        label: '青神县',
                    },],
            },

        ];
        const optionCD = [{
            value: '成都市',
            label: '成都市',
            children: [
                {
                    value: '成都市:双流县',
                    label: '双流县',
                }, {
                    value: '成都市:大邑县',
                    label: '大邑县',
                }, {
                    value: '成都市:崇州市',
                    label: '崇州市',
                }, {
                    value: '成都市:市区',
                    label: '市区',
                }, {
                    value: '成都市:彭州市',
                    label: '彭州市',
                }, {
                    value: '成都市:新津县',
                    label: '新津县',
                }, {
                    value: '成都市:新都区',
                    label: '新都区',
                }, {
                    value: '成都市:温江区',
                    label: '温江区',
                }, {
                    value: '成都市:蒲江县',
                    label: '蒲江县',
                }, {
                    value: '成都市:邛崃市',
                    label: '邛崃市',
                }, {
                    value: '成都市:都江堰市',
                    label: '都江堰市',
                }, {
                    value: '成都市:金堂县',
                    label: '金堂县',
                }, {
                    value: '成都市:青白江区',
                    label: '青白江区',
                }, {
                    value: '成都市:龙泉驿区',
                    label: '龙泉驿区',
                }, {
                    value: '成都市:天府新区',
                    label: '天府新区',
                }, {
                    value: '成都市:双流区',
                    label: '双流区',
                }, {
                    value: '成都市:简阳市',
                    label: '简阳市',
                }, {
                    value: '成都市:郫都区',
                    label: '郫都区',
                }, {
                    value: '成都市:天府机场片区',
                    label: '天府机场片区',
                }, {
                    value: '成都市:成都市高新东区',
                    label: '成都市高新东区',
                }
            ]
        }];
        const optionMY = [{
            value: '绵阳市',
            label: '绵阳市',
            children: [
                {
                    value: '绵阳市:绵阳市',
                    label: '绵阳市',
                }
            ]
        }];

        this.fetchCombineGroup();
        options.forEach(item => {
            item.checked = false
        });
        optionCD.forEach(item => {
            item.checked = false
        });
        optionMY.forEach(item => {
            item.checked = false
        });


        const years = [{year: "2019年", checked: false}, {year: "2018年", checked: false}];

        this.setState({options, optionCD, optionMY, years, groupData: options,});
        // console.log('initialCities: ', initialCities);
    }

    fetchCombine = (param) => {
        this.setState({ loading: true });
        request(`/api/costs/composite?${stringify(param)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            this.setState({
                dataSource: data.list,
                pagination: data.pagination,
                loading: false,
                // prices: data.list.length > 0 ? data.list[0].prices : []
            });
        })
    };

    fetchCombineGroup = () => {
        request(`/api/costs/periodGroup`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, (data) => {
            const phaseSC = [
                {
                    value: '2019年',
                    label: '2019年',
                    checked: false,
                    children: []
                },
                {
                    value: '2018年',
                    label: '2018年',
                    checked: false,
                    children: []
                },
            ];
            const phaseCD = [
                {
                    value: '2019年',
                    label: '2019年',
                    checked: false,
                    children: []
                },
                {
                    value: '2018年',
                    label: '2018年',
                    checked: false,
                    children: []
                },
            ];
            const phaseMY = [
                {
                    value: '2019年',
                    label: '2019年',
                    checked: false,
                    children: []
                },
                {
                    value: '2018年',
                    label: '2018年',
                    checked: false,
                    children: []
                },
            ];
            if(data.length>0) {
                data.forEach(item => {
                    if(item.period.indexOf('四川省') >= 0) {
                        switch (item.year) {
                            case 2019:
                                phaseSC[0].children.push(item.period);
                                break;
                            case 2018:
                                phaseSC[1].children.push(item.period);
                                break;
                        }
                    }else if(item.period.indexOf('成都市') >= 0) {
                        switch (item.year) {
                            case 2019:
                                phaseCD[0].children.push(item.period);
                                break;
                            case 2018:
                                phaseCD[1].children.push(item.period);
                                break;
                        }
                    }else if(item.period.indexOf('绵阳市') >= 0) {
                        switch (item.year) {
                            case 2019:
                                phaseMY[0].children.push(item.period);
                                break;
                            case 2018:
                                phaseMY[1].children.push(item.period);
                                break;
                        }
                    }
                })
            }
            const params = {
                infoType: 0,
                infoName: '',
                months: phaseSC[0].children
            };
            console.log('did mount:', params);

            this.setState({
                phaseData: data,
                phaseSC: phaseSC[0].children,
                phaseCD: phaseCD[0].children,
                phaseMY: phaseMY[0].children,
                // checkedYears: phaseSC[0].children,
                conditions: params,
            }, () => {
                this.fetchCombine(params);
            });
        })
    };

    onChangeCate = (e) => {
        //切换信息分类
        const {options, optionCD, optionMY, years, phaseMY, phaseCD, phaseSC} = this.state;
        options.forEach(item => {
            item.checked = false
        });
        optionCD.forEach(item => {
            item.checked = false
        });
        optionMY.forEach(item => {
            item.checked = false
        });
        years.forEach(item => {
            item.checked = false
        });

        // console.log('change cate params:', e.target.value==0? phaseSC: e.target.value==1? phaseCD: phaseMY);

        this.fetchCombine({
            infoType: e.target.value,
            infoName: '',
            months: e.target.value==0? phaseSC: e.target.value==1? phaseCD: phaseMY
        });

        this.setState({
            cate: e.target.value,
            groupData: e.target.value === 0 ? options : e.target.value === 1 ? optionCD : optionMY,
            years: [...years],
            checkedAreas: [],
            checkedYears: [],
            cityObject: {},
            info: '',
        })

        
    };

    onChangeYear = (e) => {
        this.setState({
            year: e.target.value
        })
    };

    onSelectedCities(checkedValues) {
        console.log('check group selected city: ', checkedValues);
    }

    onChangeCity(item, index, e) {// 城市里面的checkbox变化
        console.log('city! changed checkbox');
        const {cate, options, optionCD, optionMY} = this.state;


        switch (cate) {
            case 0:
                options[index].checked = e.target.checked;
                this.setState({options: [...options]});
                break;
            case 1:
                optionCD[index].checked = e.target.checked;
                this.setState({optionCD: [...optionCD]});
                break;
            case 2:
                optionMY[index].checked = e.target.checked;
                this.setState({optionMY: [...optionMY]});
                break;
        }
        // console.log('change', index);
        // console.log('change before:', item)
        // console.log('change after:', options)

        // this.setState({options: [...options]});
    }

    onSelectedAreas(city, index, checkedValues){// 城市的县、区...的checkbox变化
        console.log('select what? ', checkedValues, index, city);

        const { cate, options, optionCD, optionMY, groupData, cityObject, info, checkedYears} = this.state;
        const allChecked = [...checkedValues];
        const tempAreas = [];
        allChecked.forEach(lo => {
           if(lo.indexOf(city)>=0) {
               tempAreas.push(lo.split(':')[1]);
           }
        });

        console.log('select cpu Areas:', tempAreas);
        groupData[index].checked = tempAreas.length > 0;

        cityObject[city] = tempAreas;
        console.log("select cityObject:", cityObject, index);

        const params = {
            infoType: cate,
            cities: allChecked.map(lo => lo.split(':')[1]),
            infoName: info,
            months: checkedYears
        };

        // for(let p in cityObject) {
        //     if (cityObject.hasOwnProperty(p) && cityObject[p].length>0) {
        //         params.cities.push(
        //             JSON.stringify({
        //                 cityName: p,
        //                 areas: cityObject[p],
        //             }),
        //         );
        //     }
        // }

        console.log('select params:', params);
        this.fetchCombine(params);
        this.setState({groupData: [...groupData], checkedAreas: checkedValues, cityObject, conditions: params});
    }

    onSearch = (value) => {
        const {conditions} = this.state;
        conditions.infoName = value;
        this.fetchCombine(conditions);
        this.setState({info: value})
    };

    handleReset = () => {
        const {cate, phaseCD, phaseSC, phaseMY, options, optionCD, optionMY, years,} = this.state;
        options.forEach(item => {
            item.checked = false
        });
        optionCD.forEach(item => {
            item.checked = false
        });
        optionMY.forEach(item => {
            item.checked = false
        });
        years.forEach(item => {
            item.checked = false
        });
        this.setState({
            info: '',
            checkedAreas: [],
            checkedYears: [],
            cityObject: {},
            options, optionCD, optionMY, years
        });
        this.fetchCombine({
            infoType: cate,
            months: cate===0? phaseSC : cate===1? phaseCD: phaseMY,
        })
    };

    renderInfoCategory() {

        return (
            <div className="infoCate">
                <Divider type="vertical" style={{width: 3, backgroundColor: '#348bda'}}/>
                <span >信息分类：</span>
                <RadioGroup value={this.state.cate} onChange={this.onChangeCate}>
                    <RadioButton value={0} className="info_button">四川省站造价信息</RadioButton>
                    <RadioButton value={1} className="info_button">成都市站造价信息</RadioButton>
                    <RadioButton value={2} className="info_button">绵阳市站造价信息</RadioButton>
                </RadioGroup>
                {/*<Button className="categoryItem">四川省站造价信息</Button>*/}
                {/*<Button className="categoryItem">成都市站造价信息</Button>*/}
                {/*<Button className="categoryItem">绵阳市站造价信息</Button>*/}
                <Search
                    style={{ width: 350, marginLeft: 20}}
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
        )
    }

    renderAreas = (index) => {
        const {cate, options, optionCD, optionMY, groupData} = this.state;

        const city = groupData[index].value;
        const opts = groupData[index].children;
        // console.log('areas opt:', opts);

        if(opts.length > 9) {
            return (
                <div>
                    <CheckboxGroup onChange={this.onSelectedAreas.bind(this, city, index)} value={this.state.checkedAreas}>
                        <Row>
                            {opts.map(lo => (
                                <Col span={3} style={{padding: 10}}>
                                    <Checkbox value={lo.value} >{lo.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>

                    </CheckboxGroup>
                </div>
            )
        }else {
            return (
                <div>
                    <CheckboxGroup options={opts} onChange={this.onSelectedAreas.bind(this, city, index)} value={this.state.checkedAreas}/>
                </div>
            )
        }

    };

    renderCities() {
        const { options, cate, optionCD, optionMY, groupData } = this.state;
        console.log('>>... render Cities');

        return (
            <div className="city">
                <div className="city_prefix">
                    <Divider type="vertical" style={{width: 3, backgroundColor: '#348bda',}}/>
                    <span >城市：</span>
                </div>
                <CheckboxGroup >
                    <Row>
                        {groupData.map((item, index) => (
                            <Col span={cate === 0 ? 2 : 24} className="city_checkbox">
                                <Popover content={this.renderAreas(index)} trigger="hover" placement="bottomLeft" arrowPointAtCenter>
                                    <Checkbox value={item.value} >
                                        {
                                            item.checked ? <span className="city_span">{item.label}</span> : <span>{item.label}</span>
                                        }
                                    </Checkbox>
                                </Popover>
                            </Col>
                        ))}
                    </Row>
                </CheckboxGroup>
            </div>
        )
    }

    onSelectedMonths(index, checkedValues) {
        console.log('years selected:', checkedValues);
        console.log('years selected index:', index);
        const { years, checkedAreas, cate, info } = this.state;
        // const cities = options[0].children;
        // years[index].checked = checkedValues.length > 0;
        if(checkedValues.length === 0) years[index].checked = false;
        switch (index) {
            case 0:
                checkedValues.forEach(lo => {
                     years[index].checked = lo.indexOf('2019') >= 0;
                 });
                break;
            case 1:
                checkedValues.forEach(lo => {
                    years[index].checked = lo.indexOf('2018') >= 0;
                });
                break;
        }
        const params = {
            infoType: cate,
            cities: checkedAreas.map(lo => lo.split(':')[1]),
            infoName: info,
            months: checkedValues
        };

        console.log('years selected params:', params);
        this.fetchCombine(params);
        this.setState({years: [...years], checkedYears: checkedValues, conditions: params})
    }

    renderMonths(index) {
        const { cate, years, phaseData } = this.state;
        let arrs;
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
                }
            })
        }
        switch (cate) {
            case 0:
                arrs = phaseSC;
                break;
            case 1:
                arrs = phaseCD;
                break;
            case 2:
                arrs = phaseMY;
                break;
        }

        const months = arrs[index].children;
        return (
            <div>
                <CheckboxGroup onChange={this.onSelectedMonths.bind(this, index)} value={this.state.checkedYears}>
                    <Row>
                        {months.map(lo => (
                            <Col span={months.length<6? 24/months.length : 4} style={{padding: 10}}>
                                <Checkbox value={lo.value}>{lo.label}</Checkbox>
                            </Col>
                        ))}
                    </Row>

                </CheckboxGroup>
            </div>
        );


    }

    fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    }

    renderYears() {
        console.log('>>... render Years');
        const { years, phaseData, phaseSC, phaseCD, phaseMY } = this.state;
        const phaseArr = [];





        return (
            <div className="city">
                <div className="city_prefix">
                    <Divider type="vertical" style={{width: 3, backgroundColor: '#348bda'}}/>
                    <span >期数：</span>
                </div>

                <CheckboxGroup>
                    <Row>
                        {years.map((item, index) => (
                            <Col span={12} className="city_checkbox">
                                <Popover content={this.renderMonths(index)} trigger="hover" placement="bottomLeft" arrowPointAtCenter>
                                    <Checkbox value={item.year} >
                                        {
                                            item.checked ? <span className="city_span">{item.year}</span> : <span>{item.year}</span>
                                        }
                                    </Checkbox>
                                </Popover>
                            </Col>
                        ))}
                    </Row>
                </CheckboxGroup>

                {/*<RadioGroup value={this.state.year} onChange={this.onChangeYear}>*/}
                {/*    {*/}
                {/*        years.map((lo, index) => (*/}

                {/*            <Popover content={content} trigger="hover" placement="bottomLeft" arrowPointAtCenter>*/}
                {/*                <RadioButton value={index} className="yearItem">{lo}</RadioButton>*/}
                {/*            </Popover>*/}

                {/*        ))*/}
                {/*    }*/}
                {/*</RadioGroup>*/}




                {/*<Popover content={content} trigger="hover" placement="bottomLeft" arrowPointAtCenter>*/}
                {/*    <Button className="yearItem">2019年</Button>*/}
                {/*</Popover>*/}
                {/*<Popover content={content} trigger="hover" placement="bottomLeft" arrowPointAtCenter>*/}
                {/*    <Button className="yearItem">2018年</Button>*/}
                {/*</Popover>*/}
            </div>
        )
    }

    handleTableChange = (pagination, filtersArg, sorter) => {
        const {conditions} = this.state;

        this.setState({pagination}, ()=> {
            this.fetchCombine({
                ...conditions,
                currentPage: pagination.current,
                pageSize: pagination.pageSize,
            })
        });
    };

    render() {

        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '规格',
                dataIndex: 'specification',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
            {
                title: '除税价（元）',
                dataIndex: 'prices',
            },
            {
                title: '地区期数',
                dataIndex: 'phase',
            }
        ];
        const { options, years, dataSource, pagination, loading } = this.state;
        if(options.length === 0 || years.length === 0) return(<div/>);
        // console.log('render', years);
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
                <div className="ddgo_buildCost">

                    {this.renderInfoCategory()}
                    <Divider />

                    {this.renderCities()}
                    <Divider />

                    {this.renderYears()}
                    <Divider />

                    <div className="header">
                        <span className="tips">提示：</span>
                        <span >材料...</span>
                    </div>
                    <Table
                        bordered={true}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={record => record._id}
                        // rowSelection={rowSelection}
                        pagination={paginationProps}
                        loading={loading}
                        onChange={this.handleTableChange}
                    />


                </div>
            </Card>


        );
    }
}
// News.contextTypes = {
//     router: PropTypes.object.isRequired
// };
CombineSearch = Form.create({})(CombineSearch);
export default CombineSearch;