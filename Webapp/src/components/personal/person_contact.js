import React, { Component } from 'react';
import './person_contact.css'
import qq from '../../images/qq.png';
import wechat from '../../images/wechat.png';
import email from './../../images/email.png';
import phone from './../../images/phone.png'

class PersonContact extends Component{
    render(){
        return(
            <div id="personacaont">
                <h3>联系我们</h3>
                <div>
                    <p>
                        <img src={qq}/>
                        QQ：2998615102
                    </p>
                    <p>
                        <img src={phone}/>
                        电话：028-83383377
                    </p>
                </div>
                <div>
                    <p>
                        <img src={email}/>
                        邮箱：zwdc@ddgo.com
                    </p>
                    <p>
                        <img src={wechat}/>
                        客服微信：19949463865
                    </p>
                </div>
            </div>
          
        )
    }
}

export default PersonContact;