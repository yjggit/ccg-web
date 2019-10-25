import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from "proptypes";
import { message } from 'antd';
class ScrollToTop extends React.Component{

    componentWillUpdate(prevProps){
        let path = prevProps.location.pathname;
        let history = this.context.router.history;
        // console.log('user path: ', path)
        if(path === "/toLogin"){
            window.scrollTo(0, 0);
            history.push("/index");
        }

        let userInfo = JSON.parse(sessionStorage.getItem("userinfo")) || {}
        let logined = (!(!userInfo || JSON.stringify(userInfo) === '{}'));
        if(prevProps.location.pathname === "/login" && !logined){
            message.info("请先登录！", 0.5);
            history.push("/index");
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.location.pathname !== prevProps.location.pathname){
            window.scrollTo(0, 0);
        }
    }
    render(){
        return this.props.children;
    }
}
ScrollToTop.contextTypes = {
    router: PropTypes.object.isRequired
};
export default withRouter(ScrollToTop);
