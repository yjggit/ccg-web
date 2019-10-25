import React, { Component } from 'react';
import  './helpCont.css'
import HelpBannerA from './../images/help_banner01.jpg'
import HelpQuestion from './help/helpQuestion'

class helpCont extends Component{
    render(){
        return(
            <div>
                <section id="help_bannerA">
					<div>
						<img src={HelpBannerA} />
					</div>
				</section>
                <HelpQuestion/>
            </div>
        )
    }
}

export default helpCont;