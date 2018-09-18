import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import store from './store/index'
import './assets/css/Common.less'
import App from './app'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';


const Root = () => (
	<Provider store={store}>
		<LocaleProvider locale={zhCN}>
			<App />
		</LocaleProvider>
	</Provider>
)
ReactDOM.render(<Root />, document.getElementById('root'))