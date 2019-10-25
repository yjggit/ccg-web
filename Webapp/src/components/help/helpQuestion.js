import React, { Component } from 'react';
import './helpQuestion.css'

class HelpQuestion extends Component{
    render(){
        return(
            <section id="help_question">
                <div>
                    <h1>常见问题</h1>
                    <p>.....................................................................</p>
                    <div></div>
                </div>
                <div>
                    <div class="question_ans">
                        <div>
                            <p>1</p>
                            <p>如何注册、登录？</p>
                        </div>
                        <p>注册：在网站首页“新用户注册”栏输入手机号码获取验证码，设置登录密码。<br/>登录：在网站首页“用户登录”栏，输入已注册手机号+密码登录。或点击微信登录，扫描二维码登录。首次微信登录请跟进页面提示绑定已注册手机号码。</p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>2</p>
                            <p>如何找回登录密码?</p>
                        </div>
                        <p>在网站首页登录栏中点击忘记密码，根据网页提示重置密码。</p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>3</p>
                            <p>成功缴费后怎样开取发票？</p>
                        </div>
                        <p>用户成功缴费后，进入个人中心-发票申请页面，扫描填写相关信息，平台会在周一至周五9:00-17:00开具普通增值税电子发票。<br/>
                        注：请用户正确填写邮箱地址，以便我们能及时将发票发送到您预留的邮箱。用户每次缴费成功，只能申请当次缴费金额发票，请不要重复申请，平台不支持同一张发票重复开具。
                        </p>    
                </div>
                    <div class="question_ans">
                        <div>
                            <p>4</p>
                            <p>如何更改已注册的手机号码？</p>
                        </div>
                        <p>当用户手机号码发生变化时，请及时电话联系我们的客服帮助您进行修改。</p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>5</p>
                            <p>用户在未注册的情况下，选择了微信登录方式，账号和密码分别是什么？</p>
                        </div>
                        <p>如果用户未注册，直接微信登录，扫描二维码绑定手机号码。该用户账号为绑定的手机号码，密码请联系客服028-83383377获取。
                        </p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>6</p>
                            <p>普通会员、VIP会员、钻石会员三者有何区别？</p>
                        </div>
                            <p>会员等级不同，享受的服务不同，不同等级的会员服务内容及收费标准详见网站“会员尊享”内容。</p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>7</p>
                            <p>会员到期后如何续费？</p>
                        </div>
                        <p>平台会在会员到期前一个月内通过电话或者短信等方式提醒用户。用户续费成功后，会员有效期自动叠加顺延。</p>    
                    </div>
                    <div class="question_ans">
                        <div>
                            <p>8</p>
                            <p>如何更改已绑定企业？</p>
                        </div>
                        <p>若需更改已绑定企业，请联系客服028-83383377。</p>         
                    </div>
                    
                </div>
            </section>
        )
    }
}

export default HelpQuestion;