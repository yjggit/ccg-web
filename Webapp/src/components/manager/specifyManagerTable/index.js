import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import styles from './index.less';
import SpecifyManagerForm from '../specifyManagerForm/index';

class SpecifyManagerTable extends PureComponent {
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

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, modalVisible, editItem } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    const updateTypeMap=['企业资质','人员证书','业绩信息']

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
          title: '公司名称',
          dataIndex: 'builderName',
          sort: true,
       },
      {
        title: '更新信息',
        dataIndex: 'specifyType',
        render(val) {
           return updateTypeMap[val-1];
        },
      },
      {
        title: '创建时间',
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
            title="新增更新"
            visible={modalVisible}
            closable={false}
            footer={null}
          >
            <SpecifyManagerForm
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

export default SpecifyManagerTable;
