import React,{Component} from 'react';
import './zhaobiao.css';
import request from '../../utils/request';

class Project extends Component {

    componentDidMount(){
        // console.log('props>>params:', this.props);
        const sourceId = this.props.match.params.id;
        // const uuid = '5cb029bfcb13191378fa88f2';
        request(`/api/project/source/${sourceId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            console.log('fetch backstage...', data);
            document.getElementById('project').innerHTML = data.html;
        })
    }

    render(){
        return(
            <div id="project"></div>
        )
    }
}

export default Project;