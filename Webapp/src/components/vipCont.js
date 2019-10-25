import React, { Component } from 'react';
import './vipCont.css'

import VipBannerA from './../images/vip_banner01.jpg'

import VipFrom from './vipUsers/vip_from'
import VipPlay from './vipUsers/vip_play'


class about extends Component{
    render(){
        return(
            <div className='ddgo_vipCont'>
                <section id="member_banner">
                    <div>
                        <img src={VipBannerA} alt="" />
                    </div>
                </section>
                <VipFrom/>
                <VipPlay/>
            </div>
        )
    }
}

export default about;