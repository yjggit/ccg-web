# ccg-web

点点go网站项目前端代码

## 目录结构
    
   * `Webapp/build` 命令：`npm run build` 打包之后的文件目录
   * `Webapp/public` 首页html模板相关目录
   * `Webapp/src` 项目开发最重要的文件，放置所有源代码和资源
        * `Webapp/src/components` 项目涉及到的路由，组件等代码位置
            * `Webapp/src/components/about` 关于我们的页面相关代码
            * `Webapp/src/components/bindwxtophone` 微信扫码登录与账号登录绑定
            * `Webapp/src/components/buildcost` 造价信息相关页面
            * `Webapp/src/components/ChangePwd` 修改密码页面
            * `Webapp/src/components/help` 帮助中心页面
            * `Webapp/src/components/manager` 管理后台文件夹
                * `Webapp/src/components/manager/achievementInfo` 业绩相关管理
                * `Webapp/src/components/manager/achievementModal` 业绩管理页面的弹框
                * `Webapp/src/components/manager/companyInfo` 公司管理页面
                * `Webapp/src/components/manager/companytable` 公司管理页面的数据展示组件
                * `Webapp/src/components/manager/configInfo` 配置管理（原首页轮播图配置，已弃用）
                * `Webapp/src/components/manager/cosusercreateform` 用户管理创建用户（已弃用，使用Webapp/src/components/manager/userman）
                * `Webapp/src/components/manager/cosuserdetail` 用户管理查询表单
                * `Webapp/src/components/manager/cosusertable` 用户管理用户数据展示表格
                * `Webapp/src/components/manager/invoice/index.js` 发票管理（暂未使用）
                * `Webapp/src/components/manager/logman` 日志管理查询页面
                * `Webapp/src/components/manager/logtable` 日志管理数据展示页面
                * `Webapp/src/components/manager/newscreateform` 行业资讯编辑页面
                * `Webapp/src/components/manager/newsmanage` 行业资讯管理
                * `Webapp/src/components/manager/newstable` 行业资讯数据展示表格
                * `Webapp/src/components/manager/specifyAddCompanyManagerForm` 更新管理中的添加公司页面（已弃用）
                * `Webapp/src/components/manager/specifyManager` 更新管理页面
                * `Webapp/src/components/manager/specifyManagerForm` 更新管理页面添加更新窗口
                * `Webapp/src/components/manager/specifyManagerTable` 更新管理中待更新的队列（已弃用该方式，只有添加更新功能可用）
                * `Webapp/src/components/manager/userman` 用户管理创建用户
                * `Webapp/src/components/manager/usermanager.js` 后台管理首页
            * `Webapp/src/components/mobile` 适配手机端的文件目录
            * `Webapp/src/components/news` 行业资讯
            * `Webapp/src/components/personal` 个人中心页面基本信息，定制，成员管理，发票等
            * `Webapp/src/components/project` 业绩，招标，中标等跳转页面
            * `Webapp/src/components/search` 查询入口内路由相关代码
                * `Webapp/src/components/search/ddgo_company_details.js` 公司详情页面
                * `Webapp/src/components/search/ddgo_comprehensive_search.js` 综合查询页面
                * `Webapp/src/components/search/ddgo_credit_search.js` 信用查询（包含信用中国和中国执行信息公开网）
                * `Webapp/src/components/search/bid/EnterpriseBidInviteList.js` 招标查询
                * `Webapp/src/components/search/bid/EnterpriseBidresult.js` 中标查询
                * `Webapp/src/components/search/enterprise/BuilderCompositeSearch.js` 原综合查询页面（已弃用，改为Webapp/src/components/search/ddgo_comprehensive_search.js）
                * `Webapp/src/components/search/enterprise/BuilderCreditSearch.js` 原信用查询页面（已弃用，改为Webapp/src/components/search/ddgo_credit_search.js）
                * `Webapp/src/components/search/enterprise/BuilderPerformSearch.js` 业绩查询
                * `Webapp/src/components/search/enterprise/BuilderPersonSearch.js` 人员查询
                * `Webapp/src/components/search/enterprise/BuilderSimpleSearch.js` 企业查询
            * `Webapp/src/components/selectenterprise` 企业列表，管理后台选择绑定企业的组件
            * `Webapp/src/components/showinvoice` 发票显示页面
            * `Webapp/src/components/vipUsers` 会员尊享页面相关代码
            * `Webapp/src/components/aboutCont.js` 关于我们
            * `Webapp/src/components/agreementCont.js` 用户协议
            * `Webapp/src/components/BuilderCostInfo.js` 造价信息页面
            * `Webapp/src/components/footer.js` 网站底部代码
            * `Webapp/src/components/helpCont.js` 帮助中心
            * `Webapp/src/components/indexCont.js` 首页相关代码
            * `Webapp/src/components/newsCont.js` 行业资讯
            * `Webapp/src/components/personCont.js` 个人中心
            * `Webapp/src/components/PersonInfo.js` 人员信息独立页面（已弃用）
            * `Webapp/src/components/resetCont.js` 重置密码
            * `Webapp/src/components/searchCont.js` 查询入口路由
            * `Webapp/src/components/vipCont.js` 会员尊享
            * `Webapp/src/components/wchatCont.js` 微信登录
        * `Webapp/src/css` 公共css文件
        * `Webapp/src/images` 图片资源文件夹
        * `Webapp/src/utils` 项目涉及到的公共函数
            * `Webapp/src/utils/appUtils.js` 用户级别相关处理js
            * `Webapp/src/utils/linkutil.js` 原跳转判断的js（目前暂未使用，下个版本可能使用）
            * `Webapp/src/utils/request.js` 公共请求api，拦截处理了登录信息过期等问题
        * `Webapp/src/App.js` 项目首页，路由等，项目最重要的js文件
        * `Webapp/src/index.js` 项目实际的js入口文件，引用了app.js
        * `Webapp/src/ScrollToTop.js` 处理路由跳转时滚动条不重置问题
        