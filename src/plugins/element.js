import Vue from 'vue'
import {Button, Input, Form, FormItem, Message, MessageBox} from 'element-ui'
import Element from 'element-ui'

Vue.use(Element)
Vue.use(Button)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
