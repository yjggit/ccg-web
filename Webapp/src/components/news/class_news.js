import React, { PureComponent } from 'react';
import { Table, Card } from 'antd';
import { stringify } from 'qs';
import './class_news.css';
import PropTypes from "proptypes";

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class News extends PureComponent {

  state = {
    list: [],
    pagination: {},
    loading: true,
    startDate: '',
    endDate: '',
  };

  componentDidMount() {
    this.fetchTableList({
      newsType: 1,
      newsStatus: 1,
    });
  }

  handleCompositeTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
      newsType: 1,
      newsStatus: 1,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchTableList({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...params,
    });
  }
  fetchTableList = (params = {}) => {
    if (params == undefined) {
      params = { newsStatus: 1 };
    }
    let REQUEST_URL = `/api/news/listNews?${stringify(params)}`;
    this.setState({ loading: true });
    fetch(REQUEST_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(result => result.json())
      .then((data) => {
        this.setState({
          list: data.list,
          loading: false,
          pagination: data.pagination
        });
      });
  }


  render() {

    const columns = [
      {
        dataIndex: 'newsTitle',
        render(val, record) {
          const title = val;
          const url = "/newsDetail/" + record.id;
          if (val.length > 40) {
            const showT = `${val.substring(0, 40)}...`;
            return <a title={val} href={url} ><span title={title}>{showT}</span></a>;
          } else {
            return <a title={val} href={url} ><span title={title}>{val}</span></a>;
          }
        },
      },
      {
        dataIndex: 'publishDate',
        render: val => {
          let x = new Date(val);
          let dateStr = x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate();
          return dateStr;
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      ...this.state.pagination,
    };
    return (

      <Card bordered={false}>
        <div>
          <div id="classNews">
            <Table
              dataSource={this.state.list}
              rowKey={record => record.key}
              pagination={paginationProps}
              loading={this.state.loading}
              columns={columns}
              onChange={this.handleCompositeTableChange}
            />
          </div>
        </div>
      </Card>
    );
  }
}
News.contextTypes = {
  router: PropTypes.object.isRequired
};
export default News;