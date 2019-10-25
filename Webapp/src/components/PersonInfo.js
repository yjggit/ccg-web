import React from 'react';
import { Card } from 'antd';
import "./PersonInfo.css"
import request from '../utils/request'
import genelink from '../utils/linkutil';

class PersonInfo extends React.PureComponent {
  state = {
    certData: [],
    sourceUrl: "",
    personName: "",
  }

  componentDidMount() {
    const personId = this.props.match.params.id;
    this.fetchData(personId);
    this.fetchUrl(personId);
  }
  fetchUrl = (personId) => {
    let REQUEST_URL = `/api/person/basic/${personId}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.callback2)
  }
  callback2 = (data) => {
    const { sourceUrl, personName } = data;
    this.setState({
      sourceUrl: sourceUrl,
      personName: personName,
    });
  }
  fetchData = (personId) => {
    let REQUEST_URL = `/api/person/certs/${personId}`;
    request(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }, this.callback3)
  }
  callback3 = (data) => {
    this.setState({
      certData: data,
    });
  }

  renderCertData(data, key) {
    console.log(key);
    if (data == undefined || data == null || Object.keys(data).length == 0) return;
    if (data.certNo == undefined || data.certNo == null) return;

    return (
      <table id="tablecss">
        <tbody>
          <tr>
            <td className="thcss">证书类型</td>
            <td className="tdtwocss">{data.certTypeName}</td>
            <td className="thcss">专业描述</td>
            <td className="tdtwocss">{data.registMajor}</td>
          </tr>
          <tr>
            <td className="thcss">等级</td>
            <td className="tdcss">{data.certLevelName}</td>
            <td className="thcss">注册证书号</td>
            <td className="tdcss">{data.registCertNo}</td>
          </tr>
          <tr>
            <td className="thcss">证书编号</td>
            <td className="tdcss">{data.certNo}</td>
            <td className="thcss">初始注册</td>
            <td className="tdcss">{data.registDate}</td>
          </tr>
          <tr>
            <td className="thcss">执业资格证书号</td>
            <td className="tdcss">{data.qualifyCertNo}</td>
            <td className="thcss">有效期</td>
            <td className="tdcss">{data.expiredDate}</td>
          </tr>
          <tr>
            <td className="thcss">所在单位</td>
            <td className="tdcss" colspan="3">{data.builderName}</td>
          </tr>
        </tbody>
      </table>
    );
  }
  render() {
    const { certData } = this.state;
    let url;
    if (this.state.sourceUrl != undefined || this.state.sourceUrl != null) {
      url = <a className="dataRoot" href={genelink(this.state.sourceUrl, true)} target="_blank">数据来源</a>
    }
    return (
      <div id="personInfo">
        <div>
          <Card title={this.state.personName} extra={url}>
            {
              certData != undefined ? certData.map((data, key) => {
                return this.renderCertData(data, key);
              }) : ''
            }
          </Card>
        </div>
      </div>

    );
  }
}

export default PersonInfo;
