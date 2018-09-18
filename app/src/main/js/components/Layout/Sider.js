
import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu

export default class MenuList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      list: [{
        name: '薪资配置',
        url: '/system',
        key: 'system',
        icon: 'bars'
      }, {
        name: '薪资计算',
        url: '/',
        key: 'sum',
        icon: 'bars'
      }]
    }
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  render() {
    const { list } = this.state
    const menu = list.map((subMenu) => {
      if (subMenu.children && subMenu.children.length) {
        return (
          <SubMenu key={subMenu.key} title={<span><Icon type={subMenu.icon} /><span>{subMenu.name}</span></span>}>
            {subMenu.children.map(menu => (
              <Menu.Item key={menu.key}><Link to={`${menu.url}`}>{menu.name}</Link></Menu.Item>
            ))}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={subMenu.key}>
          <Link to={`${subMenu.url}`}>
            <Icon type={subMenu.icon} /><span className="nav-text">{subMenu.name}</span>
          </Link>
        </Menu.Item>
      )
    })
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        trigger={null}
      >
        <div className='mainLogo'></div>
        <Menu theme="dark" defaultSelectedKeys={['system']} mode="inline">
          {menu}
        </Menu>
        <div onClick={this.onCollapse} style={{ position: 'absolute', right: 15, bottom: 15, color: '#fff' }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </div>
      </Sider>
    )
  }
}
