import React, { Component } from 'react';
import  './newsChildren.css'
import {  NavLink, Route, Switch} from 'react-router-dom';
import NewsBannerA from './../../images/news_banner01.png'


import ClassNews from "./class_news";
import WithinNews from "./within_news";


class NewDetail extends Component{
	
		state={
				item:{}	
		}
	
	  constructor(props) {
	        super(props);
	        let id = this.props.match.params.id;
	        fetch(`/api/news/${id}`,{
	            method: 'GET',
	            headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	            }
	        })
	        .then(result=>result.json())
	        .then(data=>{
	        let d = data.publishDate
			let x = new Date(d);
			let dateStr = x.getFullYear()+"-"+(x.getMonth() + 1)+"-"+x.getDate();
			data.dateStr= dateStr;
	      	 this.setState({item:data});
	        });
	    }
    render(){
    	let xxx = this.state.item.newsContent;
    	console.log(xxx);
        return(
                <div id="newsChildren">
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
						
                    <div id="newsChildrenCont"> 
                        <h2>{this.state.item.newsTitle}</h2>
                        <div dangerouslySetInnerHTML={{__html: xxx
                          }}/>
                        <div>                          
                            <p>来源：<span>  {this.state.item.newsSource} </span></p>
                            <p>时间：<span>{this.state.item.dateStr} </span></p>
                        </div>
                    </div> 
					<Switch>
						<Route path="/news/ClassNews" component={ClassNews} />
						<Route path="/news/WithinNews" component={WithinNews} />
					</Switch>  
                </div>
        )
    }
}
export default NewDetail;