import React, {PureComponent} from 'react';
import {Button, Card, Col, DatePicker, Spin, Form, Icon, Input, InputNumber, Menu, Row, Select, Table} from "antd";
import { stringify } from 'qs';
import request from "../../../utils/request";
import './index.css';
import styles from "./index.less";
import genelink from "../../../utils/linkutil";

const FormItem = Form.Item;
const { Option } = Select;
class PlatformMonitorSys extends PureComponent {

    state = {
        loading: false,
        sysClickData: {},
        userClickData: {},
        date: '',
        values: {}
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (params) => {
        let REQUEST_URL = `/api/sys/searchMonitorList?${stringify(params)}`;
        this.setState({ loading: true });
        request(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, this.c1)
    };

    c1 = (data) => {
        this.setState({
            loading: false,
            sysClickData: data.sysClick[0],
            userClickData: data.userClick[0]
        })
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            date: '',
            values: {}
        });
        this.fetchData();
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {values} = this.state;
        this.fetchData(values);
    };

    changeDate = (date, format) => {
        const values = {
            startDate: format
        };
        this.setState({
            date: format,
            values
        })
    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div >
                <Row>
                    <Form onSubmit={this.handleSubmit} layout="inline">
                        <Col md={{ span: 24 }} sm={{ span: 24 }} lo={{ span: 12 }} xl={{ span: 8 }} xxl={{span: 8}}>
                            <FormItem label="日期">
                                <div className='comprehensive_chooseTime'>
                                    {getFieldDecorator('date')(
                                        <DatePicker disabledDate={this.disableProjectdDate} onChange={this.changeDate} format={dateFormat} />
                                    )}
                                </div>
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <FormItem label="来源渠道：">
                                {getFieldDecorator('userType')(
                                    <Select placeholder="请选择" allowClear="true" style={{width:200}} disabled>
                                        <Option value="注册">注册</Option>
                                        <Option value="付费">付费</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col xs={{span:24}} sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:8}} xxl={{span:8}}>
                            <Button type="primary" htmlType="submit" style={{width: 100}} onClick={this.handleSubmit}>查询</Button>
                            <Button style={{ marginLeft: 8 , width: 100}} onClick={this.handleFormReset}>重置</Button>
                        </Col>
                    </Form>
                </Row>

            </div>

        );
    }

    render() {
        const { loading, sysClickData, userClickData, values } = this.state;

        return (
            <Spin spinning={loading} size='large'>
            <div className='cookieSearch'>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>

                        <div className='tab'>
                            <table className='tab'>
                                <tbody>
                                <tr>
                                    <th rowSpan={2}>日期</th>
                                    <th rowSpan={2}>访问用户数(UV)</th>
                                    <th rowSpan={2}>访问次数(VV)</th>
                                    <th rowSpan={2}>浏览量(PV)</th>
                                    <th rowSpan={2}>来源渠道</th>
                                    <th rowSpan={2}>平均访问时长(ms)</th>
                                    <th rowSpan={2}>跳出率(%)</th>
                                    <th colSpan={2}>转化目标量</th>
                                    <th rowSpan={2}>用户登录量</th>
                                </tr>
                                <tr>
                                    <th>注册用户</th>
                                    <th>付费用户</th>

                                </tr>

                                <tr>
                                    <td>{userClickData.createTime}</td>
                                    <td>{userClickData.userUV}</td>
                                    <td>{userClickData.accessVV}</td>
                                    <td>{userClickData.browsePV}</td>
                                    <td>{userClickData.sourceChannel}</td>
                                    <td>{userClickData.spendTime}</td>
                                    <td>{userClickData.bounceRate}</td>
                                    <td>{userClickData.payUser}</td>
                                    <td>{userClickData.registeredUser}</td>
                                    <td>{userClickData.userLoginClick}</td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                        <Button type='primary'>
                            <a href={genelink(`http://192.168.0.113:8080/sys/sysUserClickExportExcel?${stringify(values)}`, true)} target="_blank">导出表格</a>
                        </Button>

                        <div className='tab'>
                            <table className='tab'>
                                <tbody>
                                <tr>
                                    <th colSpan={11}>组合查询点击量</th>
                                </tr>

                                <tr>
                                    <th rowSpan={2}>资质</th>
                                    <th rowSpan={2}>人员证书</th>
                                    <th rowSpan={2}>一人多证</th>
                                    <th colSpan={4}>业绩</th>
                                    <th colSpan={2}>信用</th>
                                    <th rowSpan={2}>川内-川外</th>
                                    <th rowSpan={2}>注册地区</th>
                                </tr>
                                <tr>
                                    <th>业绩类型</th>
                                    <th>业绩状态</th>
                                    <th>业绩金额</th>
                                    <th>业绩时间</th>

                                    <th>备案网站</th>
                                    <th>信用来源</th>
                                </tr>

                                <tr>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <Button type='primary'>
                            {/*<a href={genelink(`http://192.168.0.113:8080/sys/exportExcel`, true)} target="_blank">导出表格</a>*/}
                            导出表格
                        </Button>

                        <div className='tab'>
                            <table className='tab'>
                                <tbody>
                                <tr>
                                    <th >公司查询点击量</th>
                                    <th >人员查询点击量</th>
                                    <th >业绩查询点击量</th>
                                    <th >招标公告点击量</th>
                                    <th >中标信息点击量</th>
                                    <th >信用查询点击量</th>
                                    <th >定制专栏点击量</th>
                                    <th >造价信息点击量</th>
                                    <th >个人中心点击量</th>
                                    <th >论坛点击量</th>
                                    <th >客服通讯点击量</th>
                                    <th >广告宣传点击量</th>
                                </tr>

                                <tr>
                                    <td>{sysClickData.companyClick}</td>
                                    <td>{sysClickData.personalClick}</td>
                                    <td>{sysClickData.projectClick}</td>
                                    <td>{sysClickData.invitationClick}</td>
                                    <td>{sysClickData.resultClick}</td>
                                    <td>{sysClickData.creditChinaClick}</td>
                                    <td>暂无</td>
                                    <td>{sysClickData.costsClick}</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                    <td>暂无</td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Button type='primary'>
                        <a href={genelink(`http://192.168.0.113:8080/sys/sysClickExportExcel?${stringify(values)}`, true)} target="_blank">导出表格</a>
                    </Button>
                </Card>
            </div>
            </Spin>
        )
    }

}

PlatformMonitorSys = Form.create({})(PlatformMonitorSys);
export default PlatformMonitorSys;
