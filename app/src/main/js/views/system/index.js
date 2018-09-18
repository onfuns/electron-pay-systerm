import React, { Component } from 'react'
import TempalteSetting from '../../components/Wages/TempalteSetting'
import SocialSecurity from '../../components/Wages/SocialSecurity'
import { Button } from 'antd'
import styles from './style.less'
import Template from '../../../../../../config.json'
import { writeJsonSync } from 'fs-extra'

class System extends Component {
  constructor(props) {
    super(props)
    this.state = {
      templateList: [{
        name: '人员信息',
        key: "person",
        default: Template.personDefault,
        extra: Template.personExtra
      }, {
        name: '薪资信息（相加项）',
        key: "wagesPlus",
        default: Template.wagesPlusDefault,
        extra: Template.wagesPlusExtra
      }, {
        name: '扣减额（相减项）',
        key: "wagesMinus",
        default: Template.wagesMinusDefault,
        extra: Template.wagesMinusExtra
      }, {
        name: '免计税项',
        key: "tax",
        default: Template.taxDefault,
        extra: Template.taxExtra
      }]
    }
  }

  save = () => {
    console.log('Template', Template)
    try {
      writeJsonSync('config.json', Template)
    } catch (err) {
      console.log(err)
    }

  }

  render() {
    return (
      <div className={styles.table}>
        <div className={styles.tempalte}>
          <div className={styles.title}>
            <span>模板配置</span>
            <Button type="primary" size="small" onClick={this.save}>保存</Button>
          </div>
          <TempalteSetting list={this.state.templateList} />
        </div>
        <div className={styles.socialSecurity}>
          <div className={styles.title}>
            <span>社保配置</span>
            <Button type="primary" size="small" onClick={this.save}>保存</Button>
          </div>
          <SocialSecurity dataSource={Template.socialSecurity} />
        </div>
      </div>
    );
  }
}

export default System