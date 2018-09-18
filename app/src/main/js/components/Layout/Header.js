import React,{ Component } from 'react'
import { Layout,Icon} from 'antd';
const {  Header } = Layout
import Styles from './Style.less'
import { closeWIndow,hideWIndow,maxWindow,unmaxWindow } from '../../utils/Utils'

export default class Headers extends Component{
  constructor(props){
    super(props)
    this.state = {
      isMax:false
    }
  }
  _hide = () =>{
    hideWIndow()
  }
  /*最大化*/
  _maximize = () =>{
    maxWindow()
    this.setState({isMax:true})
  }
  /*取消最大化*/
  _unmaximize = () =>{
    unmaxWindow()
    this.setState({isMax:false})
  }
  _close = () =>{
    closeWIndow()
  }
  render(){
    return(
      <Header className={Styles.header} >
        <div>onfuns工资计算V1.0.0</div>
        <div>
          <Icon type="minus" onClick={this._hide}/>
          {/* {
            this.state.isMax ? <Icon type="arrows-alt" onClick={this._unmaximize}/>
                            : <Icon type="shrink" onClick={this._maximize}/>
          } */}
          <Icon type="close" onClick={this._close}/>
        </div>
      </Header>
    )
  }
}