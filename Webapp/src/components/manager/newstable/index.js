import React, { PureComponent, Fragment } from 'react';
import { Table, Modal,Icon } from 'antd';
import styles from './index.less';
import NewsCreateForm from '../newscreateform/index';
import request from '../../../utils/request';

class NewsTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    modalVisible: false,
    editItem: {},
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }


  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }
  handleEditClick = (record) => {
  
	  request(`/api/news/admin/${record.id}`,{
          method: 'GET',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          }
      },this.c1)
  }
  c1=(data)=>{
	  this.props.handleEditClick(data);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, modalVisible, editItem } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    const newsType=['行业资讯','平台动态']
    const newsStatusMem=['草稿','发布']

    const columns = [
      {
        title: '标题',
        dataIndex: 'newsTitle',
      },
      {
        title: '类型',
        dataIndex: 'newsType',
        render(val) {
          return  newsType[val-1]
        },
      },
      {
          title: '状态',
          dataIndex: 'newsStatus',
          render(val) {
        	  if(val===1){
        		  return "已发布";
        	  }else{
        		  return "草稿";
        	  }
          },
        },
      {
        title: '来源',
        dataIndex: 'newsSource',
      }, 
        {
            title: '时间',
            dataIndex: 'publishDate',
            render:(val) =>{
         	     let d = new Date(val);
         		 let dateStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
         		 return  dateStr;
        }
       },
      
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <div style={{ }}>
              <a title="编辑"><Icon type="edit" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.handleEditClick(record)} /></a>
            </div>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `第${range[0]}到${range[1]}条 总共 ${total}条`,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        <div> 
          <Modal
            title="新增"
            visible={modalVisible}
            closable={false}
            footer={null}
          >
            <NewsCreateForm
              cancelMethod={this.handleModalVisible}
              submitMethod={this.handleAddSubmitAdmin}
              dispatch={this.props.dispatch}
              item={editItem}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default NewsTable;
