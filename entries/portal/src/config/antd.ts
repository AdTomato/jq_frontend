import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

Vue.use(Antd);

import { Message, Modal } from 'h3-antd-vue';

Vue.prototype.$message = Message;
Vue.prototype.$confirm = Modal.confirm;

/**
 * 是否是钉钉
 */
Vue.prototype.isDingTalk = /DingTalk/.test(navigator.userAgent);
