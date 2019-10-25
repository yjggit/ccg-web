
import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, message,Select} from 'antd';
import './index.css';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const Option = Select.Option;
const FormItem = Form.Item;
class NewsCreateForm extends PureComponent {
	
	state = {
		editcontent:'',	
		editorState: null,
	}
	  setContent = (value) => {
		  this.setState({editcontent:value});
	  }
	  componentDidMount () {
		    // 假设此处从服务端获取html格式的编辑器内容
		    let htmlContent ='';
		    if(this.props.item){
		    	htmlContent = this.props.item.newsContent;
		    }
		    this.setState({
		      editorState: BraftEditor.createEditorState(htmlContent)
		    })
		  }
	
  aflerAddCall = (res) => {
    if (res.status === 'ok') {
      const { form } = this.props;
      message.success('添加成功');
      form.resetFields();
    } else {
      message.success(`添加失败:+${res.message}`);
    }
  };
  handleAddSubmit = (e) => {
    e.preventDefault();

    const { form, item } = this.props;
    
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let ec = this.state.editcontent;
      if(ec===''){
    	  if(item!=null){
    		  ec =  item.newsContent;
    	  }
      }
      let files = document.getElementById("news_pic").files;
      const values = {
        ...fieldsValue,
        id: item.id,
        newsContent:ec,
        file:files!=null&&files.length>0?files[0]:null,
      };
      this.props.submitMethod(values);
      form.resetFields();
      this.setState({
        enteId: '',
        vipDateMem:{},
      });
    });
  }
  cancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.cancelMethod();
  }
changexxx=(va)=>{
	
}
submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML()
    this.setState({editcontent:htmlContent});
  }
handleEditorChange = (editorState) => {
    this.setState({ editorState })
    const htmlContent = this.state.editorState.toHTML()
    this.setState({editcontent:htmlContent});
}
 formatEditHtml = (va)=>{
	 if(va===''||va===null){
		 return '';
	 }
	 return BraftEditor.createEditorState(va)
 }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
    	      labelCol: {
    	        xs: { span: 3},
    	        sm: { span: 3 },
    	      },
    	      wrapperCol: {
    	        xs: { span: 21 },
    	        sm: { span: 21 },
    	      },
    	    };
    const { item } = this.props;
    const { editorState } = this.state
    
    return (
      <div className='addNews'>
          <Card bordered={false}>
            <Form
              onSubmit={this.handleAddSubmit}
            >
              <FormItem
                {...formItemLayout}
                label="标题"
              >
                {getFieldDecorator('newsTitle', {
                  initialValue: item ? item.newsTitle : '',
                  rules: [{
                    required: true, message: '请输入标题',
                  }],
                })(
                  <Input placeholder="标题" />
                )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="图片"
             >
             <span><img src={item&&item.pic1Url?'/api/news/getPic/'+item.id+'?t='+new Date().getTime():''} height="30" width="30" />
               <input type="file" id="news_pic" />
            </span>  
            	 
            </FormItem>
            <FormItem
               {...formItemLayout}
               label="状态"
             >
               {getFieldDecorator('newsStatus', {
                 rules: [{
                   required: true, message: '请填状态',
                 }],
                 initialValue: (!item || item.newsStatus === null || item.newsStatus === 0 || item.newsStatus === undefined) ? '1' : `${item.newsStatus}`,
               })(
                 <Select  >
                   <Option  value="1">发布</Option >
                   <Option  value="-1">草稿</Option >
                 </Select>
               )}
             </FormItem>
              <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('newsType', {
                rules: [{
                  required: true, message: '请填类型',
                }],
                initialValue: (!item || item.newsType === null || item.newsType === 0 || item.newsType === undefined) ? '1' : `${item.newsType}`,
              })(
                <Select  >
                  <Option  value="1">行业资讯</Option >
                  <Option  value="2">平台动态</Option >
                </Select>
              )}
            </FormItem>
            <FormItem
            {...formItemLayout}
            label="来源"
          >
            {getFieldDecorator('newsSource', {
              initialValue: item ? item.newsSource : '',
              rules: [{
                required: true, message: '请输入来源',
              }],
            })(
              <Input placeholder="来源" />
            )}
            </FormItem>
            <FormItem {...formItemLayout} label="内容">
              {getFieldDecorator('xxnewsContent', {
                initialValue: item ? item.newsContent : '',
              })(
            	 <div className="my-component">
            	        <BraftEditor
            	        excludeControls = {['emoji']}
            	          value={editorState}
            	          onChange={this.handleEditorChange}
            	          onSave={this.submitContent}
            	        />
            	 </div>
              )}
            </FormItem>
              <div style={{ float: 'right' }}>
                <Button key="submit" type="primary" onClick={this.handleAddSubmit}>
                保存
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.cancel}>
                  取消
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      );
  }
}
NewsCreateForm = Form.create({})(NewsCreateForm)
export default NewsCreateForm;
