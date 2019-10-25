import React,{Component} from 'react';
import './zhaobiao.css';
import request from '../../utils/request'

class Zhaobiao extends Component {

    componentDidMount(){
        const sourceId = this.props.match.params.id;
        request(`/api/bid/inviteSource/${sourceId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            document.getElementById('zhaobiao').innerHTML = data.html;
        })
    }

    render(){
        
        return(
            <div id="zhaobiao"></div>
        )
    }
}

export default Zhaobiao;