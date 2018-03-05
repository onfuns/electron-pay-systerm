import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as RouterContainer} from 'react-router-dom'
import RootRouter from './routes'
import { Layout ,Button,Icon} from 'antd';
const {  Content } = Layout
import SiderBar from './components/common/Sider'
import Headers from './components/common/Header'

class App extends Component{
  render() {
    return (
      <RouterContainer>
        <Layout className="mainLayout">
          <Layout>
            <Headers/>
            <Content style={{background:'#fff',padding:20}}>
              <RootRouter />
            </Content>
          </Layout>
        </Layout>
      </RouterContainer>
    );
  }
};
export default App