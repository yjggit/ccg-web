import React, { Component } from 'react';
import {  NavLink, Route, Switch } from 'react-router-dom';
import NewsBannerA from './../images/news_banner01.png'
import './newsCont.css'
import ClassNews from "./news/class_news";
import WithinNews from "./news/within_news";


class about extends Component{
    render(){
        return(
            <section id="news_banner">
                    <div>
                        <img src={NewsBannerA} alt="" />
                    </div>
                    <div>
                        <ul>
                            <li> 
                                <NavLink to="/news/ClassNews" activeClassName="newsLiDo">行业资讯</NavLink>
                            </li>
                            <li> 
                                <NavLink to="/news/WithinNews" activeClassName="newsLiDo">平台动态</NavLink>
                            </li>
                         
                        </ul>
                    </div>
                    <div id="newsCont">
                        <Switch>

                            <Route path="/news/ClassNews" component={ClassNews} />
                            <Route path="/news/WithinNews" component={WithinNews} />
                        </Switch>
                    </div>
                </section>
            
        )
    }
}

export default about;