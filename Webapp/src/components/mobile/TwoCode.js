import React, { Component } from 'react';
const QRCode = require('qrcode.react');

class TwoCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: ""
        }
    }

    componentDidMount() {
        this.setState({
            url: "http://www.ddgo8.com"//这儿就写注册页面的地址+分享用户id
        })
    }
    render() {

        return (
            <div>
                <QRCode size={150} value={this.state.url} />
            </div>
        );
    }
}

export default TwoCode;