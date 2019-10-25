import React, { Component } from 'react';
import './project.css';
import request from '../../utils/request'

class Project extends Component {

    state = {
        dataSource: [],
        html: false
    };

    componentDidMount() {
        let uuid = this.props.match.params.id;
        // const uuid = '5cb029bfcb13191378fa88f2';
        request(`/api/project/source/new/${uuid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }, data => {
            // document.getElementById('project').innerHTML = data.html;
            console.log('fetch 1 backstage...', data);
            if(data.html) {
                this.setState({html: true});
                document.getElementById('project').innerHTML = data.html;
            }

            this.setState({ dataSource: data });// .html
        })
    }

    render() {

        const { dataSource, html } = this.state;

        // console.log(dataSource);
        console.log('render render!');
        if(html) {
            return (
                <div id="project"></div>
            )
        }else {
            if (dataSource.length === 0) {
                return (
                    <div>稍等...</div>
                )
            } else {
                console.log('project not html')
                console.log(dataSource);
                const data = dataSource.data;
                const detail = dataSource.detail;
                console.log(detail);
                //detail   { .candidate  .managementMainPerson  .similarPerformance  }
                // const mainPeople1st = [];
                // const mainPeople2nd = [];
                // const mainPeople3rd = [];

                // const similar1stPerson = [];
                // const similar1stProject = [];
                // const similar1stTech = [];
                // const similar2ndPerson = [];
                // const similar2ndProject = [];
                // const similar2ndTech = [];
                // const similar3rdPerson = [];
                // const similar3rdProject = [];
                // const similar3rdTech = [];

                // const candidate_people = [];
                // if(data !== undefined && detail !== undefined){
                const candidate = detail.candidate;//[]中标候选人
                const candidate_people = [];
                if (candidate !== undefined) {
                    for (let i = 0; i < candidate.length; i++) {
                        candidate_people.push(
                            <tr>
                                <td colSpan="1">第{candidate[i].ranking}名</td>
                                <td colSpan="3">{candidate[i].name}</td>
                                <td colSpan="1">{candidate[i].tenderPrice}</td>
                                <td colSpan="1">{candidate[i].reviewPrice}</td>
                                <td colSpan="1">{candidate[i].score}</td>
                            </tr>
                        );
                    }

                }
                const managementMainPerson = detail.managementMainPerson;// []中标候选人项目管理机构主要人员 managementMainPerson
                const mainPeople1st = [];
                const mainPeople2nd = [];
                const mainPeople3rd = [];
                if (managementMainPerson !== undefined) {
                    for (let i = 0; i < managementMainPerson.length; i++) {
                        switch (managementMainPerson[i].ranking) {
                            case '1':
                                // delete managementMainPerson[i].ranking;
                                mainPeople1st.push(managementMainPerson[i]);
                                break;
                            case '2':
                                // delete managementMainPerson[i].ranking;
                                mainPeople2nd.push(managementMainPerson[i]);
                                break;
                            case '3':
                                // delete managementMainPerson[i].ranking;
                                mainPeople3rd.push(managementMainPerson[i]);
                                break;
                        }
                    }
                }

                const similarPerformance = detail.similarPerformance;// []类似业绩
                const similar1stPerson = [];
                const similar1stProject = [];
                const similar1stTech = [];
                const similar2ndPerson = [];
                const similar2ndProject = [];
                const similar2ndTech = [];
                const similar3rdPerson = [];
                const similar3rdProject = [];
                const similar3rdTech = [];
                if (similarPerformance !== undefined) {
                    for (let i = 0; i < similarPerformance.length; i++) {
                        switch (similarPerformance[i].ranking) {
                            case '1':
                                // delete similarPerformance[i].ranking;
                                switch (similarPerformance[i].type) {
                                    case '1':
                                        // delete similarPerformance[i].type;
                                        similar1stPerson.push(similarPerformance[i]);
                                        break;
                                    case '2':
                                        // delete similarPerformance[i].type;
                                        similar1stProject.push(similarPerformance[i]);
                                        break;
                                    case '3':
                                        // delete similarPerformance[i].type;
                                        similar1stTech.push(similarPerformance[i]);
                                        break;
                                }
                                break;
                            case '2':
                                // delete similarPerformance[i].ranking;
                                switch (similarPerformance[i].type) {
                                    case '1':
                                        // delete similarPerformance[i].type;
                                        similar2ndPerson.push(similarPerformance[i]);
                                        break;
                                    case '2':
                                        // delete similarPerformance[i].type;
                                        similar2ndProject.push(similarPerformance[i]);
                                        break;
                                    case '3':
                                        // delete similarPerformance[i].type;
                                        similar2ndTech.push(similarPerformance[i]);
                                        break;
                                }
                                break;
                            case '3':
                                // delete similarPerformance[i].ranking;
                                switch (similarPerformance[i].type) {
                                    case '1':
                                        // delete similarPerformance[i].type;
                                        similar3rdPerson.push(similarPerformance[i]);
                                        break;
                                    case '2':
                                        // delete similarPerformance[i].type;
                                        similar3rdProject.push(similarPerformance[i]);
                                        break;
                                    case '3':
                                        // delete similarPerformance[i].type;
                                        similar3rdTech.push(similarPerformance[i]);
                                        break;
                                }
                                break;
                        }
                    }
                }
                // }


                return (
                    <div id="project">
                        <h2>{data.projectName}评标结果公示</h2>
                        {/*<p>发布时间：2019-20--02-22</p>*/}
                        <table>
                            <tr>
                                <td colspan="1">项目及标段名称</td>
                                <td colspan="6">{data.projectName}</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="3">{detail.ownerName}</td>
                                <td colspan="1">项目业主联系电话</td>
                                <td colspan="2">{detail.ownerPhone}</td>
                            </tr>
                            <tr>
                                <td colspan="1">招标人</td>
                                <td colspan="3">{detail.tenderer}</td>
                                <td colspan="1">招标人联系电话</td>
                                <td colspan="2">{detail.tendererPhone}</td>
                            </tr>
                            <tr>
                                <td colspan="1">招标代理机构</td>
                                <td colspan="3">{detail.bidAgency}</td>
                                <td colspan="1">招标代理机构联系电话</td>
                                <td colspan="2">{detail.bidAgencyPhone}</td>
                            </tr>
                            <tr>
                                <td colspan="1">开标地点</td>
                                <td colspan="3">{detail.bidOpenLocation}</td>
                                <td colspan="1">开标时间</td>
                                <td colspan="2">{detail.openDate}</td>
                            </tr>
                            <tr>
                                <td colspan="1">公示期</td>
                                <td colspan="3">{detail.publicityPeriod}</td>
                                <td colspan="1">投标最高限价(元)</td>
                                <td colspan="2">{detail.maxPrice}</td>
                            </tr>


                            <tr>
                                <td colspan="1">中标候选人排序</td>
                                <td colspan="3">中标候选人名称</td>
                                <td colspan="1">投标报价(元)</td>
                                <td colspan="1">经评审的投标价(元)</td>
                                <td colspan="1">综合评标得分</td>
                            </tr>
                            {candidate_people}


                            <tr>
                                <td colspan="7">第一中标候选人项目管理机构主要人员</td>
                            </tr>
                            <tr>
                                <td colspan="1" rowSpan="2">职务</td>
                                <td colspan="1" rowSpan="2">姓名</td>
                                <td colspan="3">执业或职业资格</td>
                                <td colspan="2">职称</td>
                            </tr>
                            <tr>
                                <td colspan="2">证书名称</td>
                                <td colspan="1">证书编号</td>
                                <td colspan="1">职称专业</td>
                                <td colspan="1">级别</td>
                            </tr>
                            {mainPeople1st.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.position}</td>
                                        <td colSpan="1">{item.name}</td>
                                        <td colSpan="2">{item.certName}</td>
                                        <td colSpan="1">{item.certNumber}</td>
                                        <td colSpan="1">{item.professionalTitle}</td>
                                        <td colSpan="1">{item.level}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第二中标候选人项目管理机构主要人员</td>
                            </tr>
                            <tr>
                                <td colspan="1" rowSpan="2">职务</td>
                                <td colspan="1" rowSpan="2">姓名</td>
                                <td colspan="3">执业或职业资格</td>
                                <td colspan="2">职称</td>
                            </tr>
                            <tr>
                                <td colspan="2">证书名称</td>
                                <td colspan="1">证书编号</td>
                                <td colspan="1">职称专业</td>
                                <td colspan="1">级别</td>
                            </tr>
                            {mainPeople2nd.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.position}</td>
                                        <td colSpan="1">{item.name}</td>
                                        <td colSpan="2">{item.certName}</td>
                                        <td colSpan="1">{item.certNumber}</td>
                                        <td colSpan="1">{item.professionalTitle}</td>
                                        <td colSpan="1">{item.level}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第三中标候选人项目管理机构主要人员</td>
                            </tr>
                            <tr>
                                <td colspan="1" rowSpan="2">职务</td>
                                <td colspan="1" rowSpan="2">姓名</td>
                                <td colspan="3">执业或职业资格</td>
                                <td colspan="2">职称</td>
                            </tr>
                            <tr>
                                <td colspan="2">证书名称</td>
                                <td colspan="1">证书编号</td>
                                <td colspan="1">职称专业</td>
                                <td colspan="1">级别</td>
                            </tr>
                            {mainPeople3rd.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.position}</td>
                                        <td colSpan="1">{item.name}</td>
                                        <td colSpan="2">{item.certName}</td>
                                        <td colSpan="1">{item.certNumber}</td>
                                        <td colSpan="1">{item.professionalTitle}</td>
                                        <td colSpan="1">{item.level}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第一名中标候选人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1" className="projectStandard">项目业主</td>
                                <td colspan="1" className="projectStandard">项目名称</td>
                                <td colspan="1" className="projectStandard">开工日期</td>
                                <td colspan="1" className="projectStandard">竣工(交工)日期</td>
                                <td colspan="1" className="projectStandard">建设规模</td>
                                <td colspan="1" className="projectStandard">合同价格(元)</td>
                                <td colspan="1" className="projectStandard">项目负责人</td>
                            </tr>
                            {similar1stPerson.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第一名中标候选人项目负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar1stProject.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第一名中标候选人技术负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar1stTech.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第二名中标候选人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar2ndPerson.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colspan="7">第二名中标候选人项目负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar2ndProject.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colspan="7">第二名中标候选人技术负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar2ndTech.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}


                            <tr>
                                <td colspan="7">第三名中标候选人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar3rdPerson.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colspan="7">第三名中标候选人项目负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar3rdProject.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colspan="7">第三名中标候选人技术负责人类似业绩</td>
                            </tr>
                            <tr>
                                <td colspan="1">项目业主</td>
                                <td colspan="1">项目名称</td>
                                <td colspan="1">开工日期</td>
                                <td colspan="1">竣工(交工)日期</td>
                                <td colspan="1">建设规模</td>
                                <td colspan="1">合同价格(元)</td>
                                <td colspan="1">项目负责人</td>
                            </tr>
                            {similar3rdTech.map(item => {
                                return (
                                    <tr>
                                        <td colSpan="1">{item.projectOwner}</td>
                                        <td colSpan="1">{item.projectName}</td>
                                        <td colSpan="1">{item.startDate}</td>
                                        <td colSpan="1">{item.completionDate}</td>
                                        <td colSpan="1">{item.scale}</td>
                                        <td colSpan="1">{item.contractPrice}</td>
                                        <td colSpan="1">{item.projectLeader}</td>
                                    </tr>
                                )
                            })}


                            {/*<tr>*/}
                            {/*    <td colspan="7">其他投标人（除中标候选人之外的）评审情况</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">投标人名称</td>*/}
                            {/*    <td colspan="2">投标报价（元）或否决投标依据条款（投标文件被认定为不合格所依据的招标文件评标办法中的评审因素和评审标准的条款）</td>*/}
                            {/*    <td colspan="2">经评审的投标价（元）或否决投标理由（投标文件被认定为不合格的具体事实,不得简单地表述为未响应招标文件实质性内容、某处有问题等）</td>*/}
                            {/*    <td colspan="1">综合评标得分或备注</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">四川宜康环保科技有限公司</td>*/}
                            {/*    <td colspan="2">4657900</td>*/}
                            {/*    <td colspan="2">4657900</td>*/}
                            {/*    <td colspan="1">59.88</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">四川润源环保工程有限公司</td>*/}
                            {/*    <td colspan="2">4656000</td>*/}
                            {/*    <td colspan="2">4656000</td>*/}
                            {/*    <td colspan="1">59.86</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">四川川泰众鑫建设工程有限公司</td>*/}
                            {/*    <td colspan="2">4668000</td>*/}
                            {/*    <td colspan="2">4668000</td>*/}
                            {/*    <td colspan="1">59.98</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">其它需公示的内容</td>*/}
                            {/*    <td colspan="5"></td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td colspan="2">评标委员会成员名单</td>*/}
                            {/*    <td colspan="5">姓名：伍贤 单位：西昌市建筑设计院*/}
                            {/*        姓名：王帆春 单位：四川德政建设工程管理有限公司*/}
                            {/*        姓名：候军 单位：凉山州建设工程监理公司*/}
                            {/*        姓名：王仁建 单位：四川省泸州市第三建筑工程公司*/}
                            {/*        姓名：张文 单位：西昌市土木建筑工程有限公司*/}
                            {/*        姓名：易必超 单位：核工业西南建设集团有限公司*/}
                            {/*        姓名：马发光 单位：核工业西南建设集团有限公司*/}
                            {/*    </td>*/}
                            {/*</tr>*/}
                        </table>
                    </div>
                )
            }
        }
    }
}

export default Project;