import React, { Component } from 'react';
import {Icon } from 'antd';
import './vip_play.css'

class Viplay extends Component{
    render(){
        return(
           <div className='ddgo_vipPay_table'>
                <h3 >会员权益</h3>
                <table>
                    <tr>
                        <th colspan="2">服务项目</th>
                        <th>服务说明</th>
                        <th>普通会员</th>
                        <th>VIP会员</th>
                        <th>钻石会员</th>
                    </tr>
                    <tr>
                        <td rowspan="11" className='ddgo_vipPay_table_bigClass'>组合查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>企业资质</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供企业资质证书信息</td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>人员证书/数量</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供企业各类人员证书信息及证书数量</td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>川内/川外</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供川内/川外企业信息</td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>一人多证/数量</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供企业一人多证及数量信息</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>备案网站</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供企业在特殊网站备案信息</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>信用来源</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供各类企业信用信息</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>业绩类型</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供工程项目信息</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>业绩状态</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供项目中标/在建/完工</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>业绩金额</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供项目金额信息</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>业绩数量</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供项目数量信息</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>业绩时间</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供近五年工程项目</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td className='ddgo_vipPay_table_bigClass'>企业查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        {/* 提供建筑业企业资质、人员、业绩、信用等信息 */}
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td className='ddgo_vipPay_table_bigClass'>人员查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        {/* 提供建筑业持证人员详细信息 */}
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td className='ddgo_vipPay_table_bigClass'>招标查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供四川省工程招标信息	</td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td className='ddgo_vipPay_table_bigClass'>中标查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供四川省工程中标信息	</td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td className='ddgo_vipPay_table_bigClass'>业绩查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>-</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供工程项目详情	</td>
                        <td></td>
                        <td></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td rowspan="2" className='ddgo_vipPay_table_bigClass'>信用查询</td>
                        <td className='ddgo_vipPay_table_smallClass'>信用中国</td>
                        <td className='ddgo_vipPay_table_smallClass'>提供企业守信、失信黑名单、行政处罚等详情</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>中国执行信息公开网</td>
                        <td className='ddgo_vipPay_table_smallClass'>由最高人民法院提供的企业官司执行情况</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td rowspan="2" className='ddgo_vipPay_table_bigClass'>定制推送</td>
                        <td className='ddgo_vipPay_table_smallClass'>招标定制</td>
                        <td rowspan="2" className='ddgo_vipPay_table_smallClass'>提供资质与等级、地区等招标、中标信息的定制与推送</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>中标定制</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>

                    <tr>
                        <td rowspan="5" className='ddgo_vipPay_table_bigClass'>增值服务</td>
                        <td className='ddgo_vipPay_table_smallClass'>招标投标专题讲座</td>
                        <td className='ddgo_vipPay_table_smallClass'>评标专家招投标专题讲座</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>施工专题讲座</td>
                        <td className='ddgo_vipPay_table_smallClass'>建筑施工领域专业人士施工专题讲座</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>工程审计专题讲座</td>
                        <td className='ddgo_vipPay_table_smallClass'>建筑工程审计专业人士工程审计专题讲座</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>政策解读</td>
                        <td className='ddgo_vipPay_table_smallClass'>行业各类专业人士政策解读座谈会</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                    <tr>
                        <td className='ddgo_vipPay_table_smallClass'>行业前景分析</td>
                        <td className='ddgo_vipPay_table_smallClass'>行业专业人士行业前景分座谈会</td>
                        <td></td>
                        <td><Icon type="check" /></td>
                        <td><Icon type="check" /></td>
                    </tr>
                </table>
           </div>
        )
    }
}

export default Viplay;