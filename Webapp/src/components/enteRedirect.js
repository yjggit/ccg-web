import React, { Component } from 'react';
import PropTypes from "proptypes";
import request from '../utils/request';

class EnteRedirect extends Component {

    componentWillMount() {
        let builderName = this.props.match.params.name;
        try {
            request(`/api/builder/info/${builderName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }, data => {
                let builderId = data.builderId || -1;
                let history = this.context.router.history;
                history.push('/show/ente/' + builderId);
            })
        } catch (error) {
            let history = this.context.router.history;
            history.push('/show/ente/' + -1);
        }
    }

    render(){
        return "";
    }

}
EnteRedirect.contextTypes = {
    router: PropTypes.object.isRequired
};
export default EnteRedirect;