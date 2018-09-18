import React, { Component } from 'react';
import { HashRouter as RouterContainer } from 'react-router-dom'
import RootRouter from './routes'
import { Layout } from 'antd';
import Headers from './components/Layout/Header'
import Sider from './components/Layout/Sider'

const styles = {
  content: {
    background: '#fff',
    padding: 20,
    paddingBottom: 0,
    display: 'flex',
    flex: 1
  }
}
class App extends Component {
  render() {
    return (
      <RouterContainer>
        <Layout className="mainLayout">
          {/* <Headers /> */}
          <div style={styles.content}>
            <Sider />
            <RootRouter />
          </div>
        </Layout>
      </RouterContainer>
    );
  }
};
export default App