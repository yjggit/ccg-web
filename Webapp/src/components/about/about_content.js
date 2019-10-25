import React,{Component} from 'react';
import './about_content.css'

class AboutContent extends Component {
    render(){
        return(
            <section id="about_us">
                <div>
                    <p>“点点GO”平台隶属于四川智网多彩科技有限公司，公司成立于2018年,简称智网公司，注册地址自由贸易试验区成都高新区。我们是智网公司旗下一家致力于运用互联网大数据分析，解决建筑企业信息不对称、 盘活企业沉淀资产、提高企业效益的资源共享信息平台。</p>
                    <p>我们的技术团队以丰富的互联网经验，采用现代化信息处理、云技术分析、 大数据筛选等全新的互联网思维和技术手段让用户快速获取准确的、高价值的信息资源； 从而迅速提升市场竞争力。  
                    </p>
                    <p>欢迎您加入“点点GO”平台这个大家庭，您的需求和建议是我们前行的动力。 “专业、专注、高效、诚信”是我们的宗旨 ，“让企业经营变得简单、快乐！”是我们的目标。   
                    </p>
                    <div id="about_img">
                        <div className="aboutImgA"></div>
                        <div>
                            <div className="aboutImgB"></div>
                            <div className="aboutImgC"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default AboutContent;