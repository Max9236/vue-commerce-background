import Vue from 'vue';
import { 
  Button, 
  Select, 
  Radio, 
  Form, 
  Input, 
  FormItem, 
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Tooltip,
  Dialog,
  MessageBox,
  Tree,
  Tag
 } from 'element-ui';

 Vue.use(Button);
 Vue.use(Select);
 Vue.use(Radio);
 Vue.use(Form);
 Vue.use(Input);
 Vue.use(FormItem);
 Vue.use(Container);
 Vue.use(Header);
 Vue.use(Aside);
 Vue.use(Main);
 Vue.use(Menu);
 Vue.use(Submenu);
 Vue.use(MenuItem);
 Vue.use(Breadcrumb);
 Vue.use(BreadcrumbItem);
 Vue.use(Card);
 Vue.use(Row);
 Vue.use(Col);
 Vue.use(Table);
 Vue.use(TableColumn);
 Vue.use(Switch);
 Vue.use(Pagination);
 Vue.use(Tooltip);
 Vue.use(Dialog);
 Vue.use(Tree);
 Vue.use(Tag);
 
 console.dir("Vue构造函数",Vue);

 // 配置消息弹框
Vue.prototype.$message = Message;

Vue.prototype.$confirm = MessageBox.confirm;
