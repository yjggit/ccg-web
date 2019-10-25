import React,{Component} from 'react';
import {Icon} from 'antd';
import { NavLink } from 'react-router-dom';
import './footer.css'

class FooterCont extends Component{

    onChange=(e)=>{
        const link = e.target.value;
        // console.log(link);
        window.open(link)

    }
    render(){
       return(
        <footer className="ddgo_footer">
            <div className="ddgo_footer_box">
                <span className='ddgo_footer_box_part1'>快速导航</span>
                <select className='ddgo_footer_box_select' onChange={this.onChange}>
                    <option value ="- 指导单位 -">- 指导单位 -</option>
                    <option value ="http://fgw.sc.gov.cn/">四川发展和改革委员会</option>
                    <option value="http://www.creditchina.gov.cn">信用中国</option>
                    <option value="http://zxgk.court.gov.cn">中国执行信息公开网</option>
                    <option value="http://www.miit.gov.cn/">中华人民共和国工业和信息化部</option>
                </select>
                <select className='ddgo_footer_box_select' onChange={this.onChange}>
                    <option value ="- 国家部委 -">- 国家部委 -</option>
                    <option value ="http://www.mohurd.gov.cn/">中华人民共和国住房和城乡建设部</option>
                    <option value="http://www.mot.gov.cn/">中华人民共和国交通运输部</option>
                    <option value="http://www.mwr.gov.cn/">中华人民共和国水利部</option>
                </select>
                <select className='ddgo_footer_box_select' onChange={this.onChange}>
                    <option value ="- 友情链接 -">- 友情链接 -</option>
                    <option value ="http://www.ggzy.gov.cn/">全国公共资源交易平台</option>
                    <option value="http://www.zbsonline.com/">招标师在线</option>
                    <option value="http://www.chinabidding.cc/">中国采购与招标网</option>
                    <option value ="http://www.caigou2003.com/">政府采购信息网</option>
                    <option value="http://www.crd.net.cn/">中国改革报</option>
                    <option value="http://www.ctw.net.cn/">中国招标周刊</option>
                    <option value="http://www.ccgp.gov.cn/">中国政府采购网</option>
                    <option value="http://www.100njz.com/">百年建筑</option>
                </select>
            </div>      
            <div className="ddgo_footer_box">
                
                <div className="ddgo_footer_box_Service">
                    {/* <div>
                        <p>产品服务热线</p>
                        <p>028-83383377</p>
                        <p>Service Hotline</p>
                    </div> */}
                    <div></div>
                    <p> <Icon type="qq" /> &nbsp;QQ&nbsp;/&nbsp;2998615102</p>
                    <p> <Icon type="mail"  />&nbsp; 邮箱&nbsp;/&nbsp;zwdc@ddgo8.com</p>
                    {/* <p><Icon type="home" />&nbsp;公司&nbsp;/&nbsp;四川智网多彩科技有限公司</p> */}      
                    <p> <Icon type="environment"  />&nbsp;地址&nbsp;/&nbsp;成都市高新区环球中心E3-705</p>
                </div>
                <div className="ddgo_footer_box_units">
                    <div>
                        <div>
                            <p>理事单位</p>
                            <p>Governing units</p>
                        </div>
                        <p>四川省建筑业协会会员单位</p>
                        <p>四川省网商协会理事单位</p>
                        <p>四川省互联网协会理事单位</p>
                    </div>
                </div>
                <div className="ddgo_footer_box_Product">
                    <div>
                        <div>
                            <p>产品服务</p>
                            <p>Product services</p>
                        </div>
                        <p><NavLink to="/about" activeClassName="index_menu_li_Color">关于我们</NavLink ></p>
                        <p><NavLink to="/user" activeClassName="index_menu_li_Color">会员尊享</NavLink ></p>
                        <p><NavLink to="/help" activeClassName="index_menu_li_Color">帮助中心</NavLink ></p>
                        <p><NavLink to="/news/ClassNews" activeClassName="index_menu_li_Color">行业资讯</NavLink ></p>
                    </div>
                </div>
                <div className="ddgo_footer_box_wechat">                   
                        <div></div>
                        <p>微信公众号</p>
                        <div></div>
                        <p>下载APP 安卓版</p>
                </div>
            </div>  
            <div className="ddgo_footer_bottom">
                <div className="ddgo_footer_box">
                    <p>四川智网多彩科技有限公司版权所有 www.ddgo8.com 未经书面授权 不得复制或建立镜像 备案编号： 蜀ICP备 18022685号-1</p>
                    <p>平台建议使用浏览器极速模式，IE11以上浏览器</p>
                </div>     
            </div> 
            
        </footer>
       )
    }
}

export default FooterCont;