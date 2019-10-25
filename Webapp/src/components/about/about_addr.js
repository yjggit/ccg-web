import React,{Component} from 'react';
import { Row, Col} from 'antd';
import './about_addr.css';

import qqA from './../../images/qq.png';
import phoneA from './../../images/phone.png';
import emailA from './../../images/email.png';
import addrA from './../../images/addr.png';


class AboutAddr extends Component {
    componentDidMount(){
        var BMap = window.BMap
        var map = new BMap.Map("allmap"); 
        map.centerAndZoom(new BMap.Point(104.0708839292,30.5750187666), 11); 
        map.addControl(new BMap.MapTypeControl());
        map.setCurrentCity("成都");
        map.enableScrollWheelZoom(true); 

        var point = new BMap.Point(104.0708839292,30.5750187666);
        map.centerAndZoom(point, 11);
        var marker = new BMap.Marker(point); 
        map.addOverlay(marker); 
        
        var opts = {    
            width : 250, 
            height: 60, 
            title : "四川智网多彩科技有限公司" 
        }    
        var infoWindow = new BMap.InfoWindow("地址：自由贸易区成都高新区环球中心", opts);  
        map.openInfoWindow(infoWindow, map.getCenter());
    }

    render(){
        return(
            <section id="about_address">
                <div>
                    <div id="address_title">
                        <h2>联系我们</h2>
                        <p>.....................................................................</p>
                        <div></div>
                    </div>
                    <div id="address_icon">
                        <Row>
                            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:6}} xl={{span:6}} xxl={{span:6}}>
                                <img src={addrA}/>
                                <span> 成都市高新区环球中心</span>
                            </Col>
                            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:4}} xl={{span:4}} xxl={{span:4}}>
                                <img src={qqA}/>
                                <span>2998615102</span>
                            </Col>
                            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:8}} xl={{span:8}} xxl={{span:8}}>
                                <img src={phoneA}/>
                                <span>028-83383377 / 199 4946 3865</span>
                            </Col>
                            <Col xs={{span:24}} sm={{span:12}} md={{span:12}} lg={{span:6}} xl={{span:6}} xxl={{span:6}}>
                                <img src={emailA}/>
                                <span>zwdc@ddgo8.com</span>
                            </Col>
                        </Row>
                    </div> 
                    <div>
                    <div id="allmap"/></div>
                </div>        
            </section>
        )
    }
}

export default AboutAddr;