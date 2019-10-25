import React, { Component } from 'react';

class SearchSample extends Component{
	constructor() {
	  	super();
	 		 this.state={items:[]};
	  }
	  componentDidMount(){
	  	fetch(`/api/builder/builderinfo?isLocal=1`)
	  	.then(result=>result.json())
	    .then(data=>this.setState({items:data.list}));
	  }
	
    render(){
        return(
            <div>
                查询
                <ul>
                {this.state.items.length ?
                	this.state.items.map(item=><li key={item.enteId}>{item.enteName}</li>) 
                  : <li>Loading...</li>
                }
            </ul>
            </div>
        )
    }
}

export default SearchSample;