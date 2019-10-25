import React, { Component } from 'react';
import { message } from 'antd';
import request from '../../../utils/request';
import './index.css'



class ConfigInfo extends Component {
	state = {
		pic_1: '/api/config/getPic/pic_1',
		// pic_2:'/api/config/getPic/pic_2',
		// pic_3:'/api/config/getPic/pic_3',
		i: 0,
	};

	componentDidMount() {

	}

	handleFile = (i) => {
		this.setState({ i });
		let picture = document.getElementById("picture_" + i).files;
		let formData = new FormData();
		formData.append('file', picture[0]);
		formData.append('configKey', "pic_" + i);
		request(`/api/config/admin/postPic`, {
			method: 'post',
			body: formData,
		}, this.c1)
	}
	c1 = (data) => {
		if (data.status === 'ok') {
			const { i } = this.state;
			let t = new Date().getTime();
			let val = '/api/config/getPic/pic_' + i + '?t=' + t;
			if (i === 1) {
				this.setState({ pic_1: val });
			} else if (i === 2) {
				this.setState({ pic_2: val });
			} else if (i === 3) {
				this.setState({ pic_3: val });
			}
			message.success('上传成功', 1);
		} else {
			message.success(`${data.message}`, 1);
		}
	}



	render() {
		const { pic_1 } = this.state;
		return (
			<div id="configIndexBanner">
				<div>
					<a href={pic_1} target="_blank">
						<img src={pic_1} />
					</a>
					<input type="file" id="picture_1" ></input>
					<button type="button" onClick={() => this.handleFile(1)}>上传图片</button>
				</div>
			</div>
		)
	}
}

export default ConfigInfo;