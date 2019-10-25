import React, { Component } from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import ClassNews from "./news/class_news";
import SingleInfo from "./buildcost/singleSearch";
import CombineInfo from "./buildcost/combineSearch";
import './BuilderCostInfo.css';
import NewsBannerA from "../images/news_banner01.png";

class BuilderCostInfo extends Component {
    state = {

    };

    componentDidMount() {

    }

    render() {
        return (
            <section id="cost_container">

                {/*<div>*/}
                {/*    <img src={NewsBannerA} alt="" />*/}
                {/*</div>*/}
                <div>
                    <ul>
                        <li>
                            <NavLink to="/BuildCost/SingleInfo" activeClassName="tabActive">单个信息查找</NavLink>
                        </li>
                        <li>
                            <NavLink to="/BuildCost/CombineInfo" activeClassName="tabActive">多组合查找</NavLink>
                        </li>
                    </ul>
                </div>
                <hr color='#348bda'/>

                <div id="searchCon">
                    <Switch>
                        <Route path="/BuildCost/SingleInfo" component={SingleInfo} />
                        <Route path="/BuildCost/CombineInfo" component={CombineInfo} />
                    </Switch>
                </div>

            </section>
        )
    }
}

export default BuilderCostInfo;