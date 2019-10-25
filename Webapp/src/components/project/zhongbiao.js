import React,{Component} from 'react';
import './zhongbiao.css';
import request from '../../utils/request'

class Zhongbiao extends Component {

    componentDidMount(){
        const sourceId = this.props.match.params.id;
        request(`/api/bid/resultSource/${sourceId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            console.log(data)
            document.getElementById('zhongbiao').innerHTML = data.html;
        })
    }

    render(){
        return(
            <div id="zhongbiao"></div>
        )
    }
}

export default Zhongbiao;