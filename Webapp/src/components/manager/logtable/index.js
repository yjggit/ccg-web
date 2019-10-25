import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class LogsTable extends PureComponent {
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
  c1=(data)=>{
	  this.props.handleEditClick(data);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, modalVisible, editItem } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    const logType=['用户日志','管理员日志']
    const logRes=['成功','失败']

    const columns = [
	  {
        title: '操作人',
        dataIndex: 'opeAccount',
      },
      {
        title: '日志标题',
        dataIndex: 'opeTitle',
      },
      {
        title: '日志内容',
        dataIndex: 'opeContent',
        render(val) {
        	if(val!=null&&val.length>30){
        		let xx = val.substring(0,30)+"...";
        		return <span title={val}>{xx}</span>
        	}else{
        		return <span title={val}>{val}</span>
        	}
           },
      },
      {
          title: '操作结果',
          dataIndex: 'logResult',
          render(val) {
            return  logRes[val-1]
           },
       },{
          title: '日志类型',
          dataIndex: 'logType',
          render(val) {
            return  logType[val-1]
          },
        },
        {
            title: '失败原因',
            dataIndex: 'opeErrDetail',
            render(val) {
            	if(val!=null&&val.length>30){
            		let xx = val.substring(0,30)+"...";
            		return <span title={val}>{xx}</span>
            	}else{
            		return <span title={val}>{val}</span>
            	}
               },
          },
          {
              title: '操作人IP',
              dataIndex: 'opeIp',
            },
        {
            title: '时间',
            dataIndex: 'opeDate',
            render:(val) =>{
         	     let d = new Date(val);
         		 let dateStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
         		 return  dateStr;
            }
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
      </div>
    );
  }
}

export default LogsTable;
