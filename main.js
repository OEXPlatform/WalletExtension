import Vue from 'vue'
import App from './App'
import Base from './common/base.js'
import CommonJS from './common/common.js'
import Api from './common/api.js'
import Web3Wrapper from 'common/web3Wrapper.js'
import store from './store/store.js'

Vue.config.productionTip = false

//中英文翻译
import i18n from './lang/index' 
Vue.prototype._i18n = i18n

Vue.prototype.BASE = Base
Vue.prototype.$CommonJS = CommonJS
Vue.prototype.$API = Api
Vue.prototype.$Web3Wrapper = Web3Wrapper

App.mpType = 'app'




const app = new Vue({
		i18n,
    ...App,
		store
})
app.$mount()
