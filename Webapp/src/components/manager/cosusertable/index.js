import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Modal, message, Icon, Popconfirm } from 'antd';
import styles from './index.less';
import CosUserCreateForm from '../cosusercreateform/index';

import request from '../../../utils/request';
class CosUserTable extends PureComponent {
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
    const bef = 604800000;
    let beforeStr = null;
    if(record&&record.vipEndDate&&record.vipEndDate>0){
      const d = new Date(record.vipEndDate);
      beforeStr = d.toLocaleDateString();
    }else{
       const now = new Date();
       const beforefifteen = now.getTime() + bef;
       const beforeDateyc = new Date(beforefifteen);
       beforeStr = beforeDateyc.toLocaleDateString();
    }
    console.log("beforeStr:"+beforeStr);
    record.vipEndDateStr=beforeStr;
    this.props.handleEditClick(record);
  }
  resetUserPwd = (record) => {

    request(`/api/user/admin/restpwd/${record.userId}`,{
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      }
  },this.c1)
  }
  c1=(data)=>{
	   if (data.status === 'ok') {
		      message.success('重置成功');
		    } else {
		      message.success(data.message);
		    }
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, modalVisible, editItem } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    const vipLevelMap=['普通会员', 'vip会员1年', 'vip会员2年', 'vip会员3年', '钻石会员1年', '钻石会员2年', '钻石会员3年']

    const columns = [
      {
        title: '真实姓名',
        dataIndex: 'userRealName',
      },
      {
        title: '电话号码',
        dataIndex: 'phoneNo',
        sort: true,
      },
      {
          title: '所属公司',
          dataIndex: 'enterpriseName',
          sort: true,
          render(val) {
              if(val==null){
            	  return "未绑定";
              }else{
            	  return val;
              }
          },
       },
      {
        title: '用户级别',
        dataIndex: 'userLevel',
        render(val) {
          return  vipLevelMap[val-1]
        },
      },
     /* {
        title: '用户类型',
        dataIndex: 'userType',
        render(val) {
          if (val === 1) {
            return '个人用户';
          } else if (val === 2) {
            return '企业用户';
          }
        },
      }, */
      {
        title: '是否企业管理员',
        dataIndex: 'isEnterAdmin',
        sort: true,
        render(val) {
          if (val === 1) {
            return '否';
          } else if (val === 2) {
            return '是';
          }
        },
      },
      {
        title: '注册时间',
        dataIndex: 'createDate',
        render(val) {
        	   let vipDateStr='';
               if(val>0){
                  const vipDate = new Date(val);
                  vipDateStr = vipDate.getFullYear()+"-"+(vipDate.getMonth()+1)+"-"+vipDate.getDate();
               }
               return vipDateStr;
        },
      }, 
      
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <div style={{ }}>
              <a title="编辑"><Icon type="edit" style={{ fontSize: 18, color: '#08c' }} onClick={() => this.handleEditClick(record)} /></a>
              <Divider type="vertical" />
              <Popconfirm placement="top" title="重置后为初始密码：888888，您确定要重置该账户的密码吗？" onConfirm={() => this.resetUserPwd(record)} okText="确定" cancelText="取消">
                <a title="重置密码"><Icon type="unlock" style={{ fontSize: 18, color: '#08c' }} /></a>
              </Popconfirm>
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
            title="新增用户"
            visible={modalVisible}
            closable={false}
            footer={null}
          >
            <CosUserCreateForm
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

export default CosUserTable;
