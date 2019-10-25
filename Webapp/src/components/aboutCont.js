import React, { Component } from 'react';
import AboutBannerA from './../images/about_banner01.png'

import AboutContent from './about/about_content';
import AboutAddr from './about/about_addr';

class AboutCont extends Component{
	render(){
		return(
			<div>
			<section id="help_bannerA">
				<div>
					<img src={AboutBannerA} />
				</div>
			</section>
			<AboutContent/>
			<AboutAddr/>
		</div>
		)
	}
}
export default AboutCont;