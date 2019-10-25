import React, { Component } from 'react';
import { Tabs, Row, Col, Form, message, Tooltip, Input, Button, Table, Modal } from 'antd';
import './ddgo_credit_search.css'
import { stringify } from 'qs';
import genelink from '../../utils/linkutil';
import request from '../../utils/request';
import Utils from '../../utils/appUtils';
import emitter from "../../event";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class DdgoCredit extends Component {

    state = {
        list: [],
        pagination: {},
        creditChina_loading: false,
        creditChina_builderName: '',
        ZXGKCourt_loading: false,
        ZXGKCourt_builderName: '',
        ZXGKCourt_personName: '',
        ZXGKCourt_data: {
            list: [],
            pagination: {}
        },
        visible: false,
        url: '',
        captchaId: '',
        imgSrc: '',
        captchaValue: '',
        zgxydisplay: false,
        zgzxxxgkwdisplay: false,
        growUpVisiable: false,
    }

    componentDidMount() {
        let level = Utils.getUserType();
        let isValid = Utils.isValid();
        let isUser = Utils.isUser();
        this.setState({ userLevel: isUser ? (isValid ? level : 0) : -1 }, () => {
            this.loadZXGKCache();
        });
        this.eventEmitter = emitter.addListener("updateUserLevel", (level) => {
            if(level<0) {
                this.reSetCreditChina();
                this.resetZXGKCredit();
            }
            this.setState({
                userLevel: level
            }, ()  => this.loadZXGKCache());
        });
    }

    // 创建iframe加载中国执行信息公开网的缓存
    loadZXGKCache = () => {
        let zxgkBox = document.getElementById("zxgk-cache");
        var m_iframe=document.createElement("iframe");
        m_iframe.src="http://zxgk.court.gov.cn/";
        zxgkBox.appendChild(m_iframe);
    }

    changeCreditChinaBuilderName = (e) => {
        let value = e.target.value;
        this.setState({
            creditChina_builderName: value
        })
    }

    reSetCreditChina = () => {
        this.setState({
            creditChina_builderName: "",
            zgxydisplay: false,
        })
    }

    creditChinaSearch = (e, pageParam = {}) => {
        e.preventDefault();
        const {userLevel} = this.state;
        if(userLevel<0) {
            emitter.emit("loginModal", true);
            return;
        }else if(userLevel === 0) {
            this.setState({ growUpVisiable: true });
            return;
        }
        let { creditChina_builderName } = this.state;
        if (creditChina_builderName) {
            this.setState({
                creditChina_loading: true
            })
            let param = {
                builderName: creditChina_builderName,
                ...pageParam
            }
            request(`/api/credit/creditChina?${stringify(param)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }, (res) => {
                const { pageSize, current } = res.pagination;
                const startno = (current - 1) * pageSize;
                res.list.map(function (value, key) {
                    let nm = { no: startno + key + 1 };
                    return Object.assign(value, nm);
                });
                this.setState({
                    list: res.list,
                    pagination: res.pagination,
                    creditChina_loading: false,
                    zgxydisplay: true
                })
            })
        } else {
            this.setState({
                list: [],
                pagination: {}
            })
        }
    }

    changeZXGKCourtPersonName = (e) => {
        let value = e.target.value;
        this.setState({
            ZXGKCourt_personName: value
        })
    }

    changeZXGKCourtBuilderName = (e) => {
        let value = e.target.value;
        this.setState({
            ZXGKCourt_builderName: value
        })
    }

    ZXGKCourtSearch = (e, pageParam = {}) => {
        e.preventDefault();
        const {userLevel} = this.state;
        if(userLevel<0) {
            emitter.emit("loginModal", true);
            return;
        }else if(userLevel <= 1) {
            this.setState({ growUpVisiable: true });
            return;
        }
        let { ZXGKCourt_builderName, ZXGKCourt_personName } = this.state;
        if (ZXGKCourt_builderName || ZXGKCourt_personName) {
            this.setState({
                ZXGKCourt_loading: true
            })
            let param = {
                builderName: ZXGKCourt_builderName,
                personName: ZXGKCourt_personName,
                ...pageParam
            }
            request(`/api/credit/zxgkCourt?${stringify(param)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }, (res) => {
                const { pageSize, current } = res.pagination;
                const startno = (current - 1) * pageSize;
                res.list.map(function (value, key) {
                    let nm = { no: startno + key + 1 };
                    return Object.assign(value, nm);
                });
                this.setState({
                    ZXGKCourt_data: res,
                    ZXGKCourt_loading: false,
                    zgzxxxgkwdisplay: true,
                })
            })
        } else {
            this.setState({
                list: [],
                pagination: {}
            })
        }
    }

    showCaptchaModal = (url, e) => {
        e.preventDefault();
        let captchaId = url.substr(url.indexOf('captchaIdNewDel') + 16);
        let src = `http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=${captchaId}&random=${Math.random()}`
        this.setState({
            visible: true,
            url: url,
            captchaId: captchaId,
            imgSrc: src,
        })

    }

    creditChinaTableChange = (pagination, filtersArg, sorter) => {
        let params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
        };
        this.creditChinaSearch(document.createEvent("HTMLEvents"), params);
    }

    ZXGKCourtTableChange = (pagination, filtersArg, sorter) => {
        let params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
        };
        this.ZXGKCourtSearch(document.createEvent("HTMLEvents"), params);
    }

    changeCaptchaValue = (e) => {
        let value = e.target.value;
        this.setState({
            captchaValue: value
        })
    }

    changeImageSrc = () => {
        let { captchaId } = this.state;
        let src = `http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=${captchaId}&random=${Math.random()}`
        this.setState({
            imgSrc: src
        })
    }

    handleCancel = () => {
        this.setState({
            captchaValue: '',
            visible: false
        })
    }

    handleOk = () => {
        let { captchaValue, captchaId, url } = this.state;
        url = decodeURI(url);
        if(url.match(/[\(（]/g)){
            url = url.replace(/[\(（].{10,12}[\)）]/, "")
        }
        url = encodeURI(url);
        url = url.replace(/j_captchaNewDel=.{4}/, `j_captchaNewDel=${captchaValue}`).replace(/captchaIdNewDel=.*/, `captchaIdNewDel=${captchaId}`);
        window.open(url)
        this.setState({
            captchaValue: '',
            visible: false
        })
    }

    resetZXGKCredit = () => {
        let { ZXGKCourt_data } = this.state;
        ZXGKCourt_data["list"] = [];
        ZXGKCourt_data["pagination"] = {};
        this.setState({ ZXGKCourt_builderName: '', ZXGKCourt_personName: '', ZXGKCourt_data: ZXGKCourt_data, zgzxxxgkwdisplay: false })
    }

    upgradeTip = (a, b, c) => {
        // console.log(a)
        // return a = 1;
        // console.log(b)
        // console.log(c)
        // // e.preventDefault();
        message.info('功能升级优化中，敬请期待！');
    }

    openSourceWindow = (data, e) => {
        e.preventDefault();
        try {
            request(`/credit/api/credit_info_search?keyword=${data.builderName}&templateId=&page=1&pageSize=10`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }, res => {
                if (res.data.results && res.data.results.length > 0) {
                    let result = res.data.results[0];
                    if (result) {
                        let encryStr = result.encryStr;
                        let url = data.sourceUrl.replace(/&encryStr=.*&/, "&encryStr=" + encodeURIComponent(encryStr) + "&");
                        window.open(url);
                    } else {
                        message.info('暂无数据源');
                    }
                } else {
                    message.info('暂无数据源');
                }
            })
        } catch (error) {
            message.error("来源网站服务器繁忙，请重试")
        }
    }

    growUpTip = (e) => {
        e.preventDefault();
        window.open("/user");
    }
    handleGrowUpCancel = (e) => {
        e.preventDefault();
        this.setState({ growUpVisiable: false })
    }
    handleGrowUpOk = (e) => {
        this.setState({ growUpVisiable: false })
        window.open("/user");
    }

    render() {
        let xyzg_columns = [
            {
                title: '序号',
                dataIndex: 'no',
            }, {
                title: '企业名称',
                dataIndex: 'builderName',
                align: 'center',
                render: (text, row, index) => (
                    <a key={index} onClick={this.openSourceWindow.bind(this, row)}>{row.builderName}</a>
                ),
            }, {
                title: '查看',
                dataIndex: 'view',
                render: (text, row, index) => {
                    if (row.sourceUrl) {
                        return <a key={index} onClick={this.openSourceWindow.bind(this, row)}>查看</a>
                    } else {
                        return (
                            <Tooltip title="暂无数据来源">
                                <a>查看</a>
                            </Tooltip>
                        )
                    }
                }
            }
        ];
        let zgzxxxgkw_columns = [
            {
                title: '序号',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: '企业名称',
                dataIndex: 'builderName',
                key: 'builderName',
                align: 'center',
            }, {
                title: '企业法人',
                dataIndex: 'personName',
                key: 'personName',
            }, {
                title: '立案时间',
                dataIndex: 'filingTime',
                key: 'filingTime',
                render: (text, row, index) =>
                    new Date(row.filingTime).format('yyyy-MM-dd')
            }, {
                title: '案号',
                dataIndex: 'filingNum',
                key: 'filingNum',
            }, {
                title: '查看',
                dataIndex: 'view',
                key: 'view',
                render: (text, row, index) => (
                    <a key={index} onClick={this.showCaptchaModal.bind(this, row.sourceUrl)}>查看</a>
                ),
            }
        ];
        let { creditChina_builderName, ZXGKCourt_builderName, ZXGKCourt_personName, ZXGKCourt_data, captchaValue, zgxydisplay, zgzxxxgkwdisplay, userLevel } = this.state;
        let locale = {
            emptyText: userLevel == 0 ? "请升级为会员！" : userLevel == 1 ? "请升级为钻石会员！" : "暂无此类信息",
        }
        return (
            <div className="ddgo_credit_search">
                <div id="zxgk-cache" style={{display: 'none'}}></div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="信用中国" key="1">
                        <div className='ddgo_zgxy_search'>
                            <Row>
                                <Form onSubmit={this.creditChinaSearch}>
                                    <Col md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} xxl={{ span: 18 }}>
                                        <FormItem label="企业名称">
                                            <Input value={creditChina_builderName} onChange={this.changeCreditChinaBuilderName} placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                                        <FormItem>
                                            <Button htmlType="submit" type="primary">查询</Button>
                                            <Button htmlType="reset" onClick={this.reSetCreditChina} style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                                        </FormItem>
                                    </Col>
                                </Form>
                            </Row>
                        </div>
                        <div className='ddgo_zgxy_tableBox' style={{ display: zgxydisplay ? "" : "none" }}>
                            <Table
                                dataSource={this.state.list}
                                columns={xyzg_columns}
                                rowKey={record => record.id}
                                pagination={{ showSizeChanger: true, showQuickJumper: true, total: this.state.pagination.total, current: this.state.pagination.current, pageSize: this.state.pagination.pageSize, showTotal: () => `共 ${this.state.pagination.total} 条记录` }}
                                loading={this.state.creditChina_loading}
                                onChange={this.creditChinaTableChange}
                                locale={locale}
                            />
                        </div>
                        <div className='ddgo_credit_instructions' style={{ display: zgxydisplay ? "none" : "" }}>
                            <h3>信用信息查询使用声明</h3>
                            <p>一、本网站提供的信息仅供查询人参考，如有争议，以源网站或执行法院有关法律文书为准。因使用本网站信息而造成不良后果的，本网站不承担任何责任。 </p>
                            <p>二、查询人必须依法依规使用查询信息，不得用于非法目的和不正当用途。非法使用本网站信息给他人造成损害的，由使用人自行承担相应责任, 本网站不承担任何责任。</p>
                            <p>三、未经许可，任何企业或个人不得拷贝、复制或传播本网站信息。</p>
                            <p>点点go建筑业大数据平台</p>
                            <p>二零一八年十二月二十二日</p>
                        </div>
                    </TabPane>
                    <TabPane tab="中国执行信息公开网" key="2">
                        <div className='ddgo_zgzxxxgkw_search'>
                            <Row>
                                <Form>
                                    <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
                                        <FormItem label="企业名称" >
                                            <Input placeholder="请输入企业名称" value={ZXGKCourt_builderName} onChange={this.changeZXGKCourtBuilderName} />
                                        </FormItem>
                                    </Col>
                                    <Col md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
                                        <FormItem label="企业法人" >
                                            {/* 功能升级优化中，敬请期待！ */}
                                            <Input placeholder="请输入法人姓名" value={ZXGKCourt_personName} onChange={this.changeZXGKCourtPersonName} />
                                        </FormItem>
                                    </Col>
                                    <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
                                        <FormItem>
                                            <div className='ddgo_creditSearchSubmit'>
                                                {/*  this.upgradeTip */}
                                                <Button htmlType="button" type="primary" onClick={this.ZXGKCourtSearch}>查询</Button>
                                                <Button htmlType="button" onClick={this.resetZXGKCredit} style={{ backgroundColor: '#e98d19', bordercolor: '#e98d19', color: '#fff', boxShadow: '#e98d19' }}>重置</Button>
                                            </div>

                                        </FormItem>
                                    </Col>
                                </Form>
                            </Row>
                        </div>
                        <div className='ddgo_zgzxxxgkw_tableBox' style={{ display: zgzxxxgkwdisplay ? "" : "none" }}>
                            <Table
                                dataSource={ZXGKCourt_data.list}
                                columns={zgzxxxgkw_columns}
                                rowKey={record => record.id}
                                pagination={{ showSizeChanger: true, showQuickJumper: true, total: ZXGKCourt_data.pagination.total, current: ZXGKCourt_data.pagination.current, pageSize: ZXGKCourt_data.pagination.pageSize, showTotal: () => `共 ${ZXGKCourt_data.pagination.total} 条记录` }}
                                loading={this.state.ZXGKCourt_loading}
                                onChange={this.ZXGKCourtTableChange}
                                locale={locale}
                            />
                        </div>
                        <div className='ddgo_credit_instructions' style={{ display: zgzxxxgkwdisplay ? "none" : "" }}>
                            <h3>信用信息查询使用声明</h3>
                            <p>一、本网站提供的信息仅供查询人参考，如有争议，以源网站或执行法院有关法律文书为准。因使用本网站信息而造成不良后果的，本网站不承担任何责任。 </p>
                            <p>二、查询人必须依法依规使用查询信息，不得用于非法目的和不正当用途。非法使用本网站信息给他人造成损害的，由使用人自行承担相应责任, 本网站不承担任何责任。</p>
                            <p>三、未经许可，任何企业或个人不得拷贝、复制或传播本网站信息。</p>
                            <p>点点go建筑业大数据平台</p>
                            <p>二零一八年十二月二十二日</p>
                        </div>
                    </TabPane>
                </Tabs>
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
                        onOk={this.handleGrowUpOk}
                        onCancel={this.handleGrowUpCancel}
                        visible={this.state.growUpVisiable}
                        wrapClassName={"ddgo_company_details_smallBox"}
                    >
                        <p>是否升级为钻石会员？</p>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default DdgoCredit;
