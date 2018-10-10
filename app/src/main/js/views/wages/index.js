import React, { Component } from 'react'
import { Form, Input, Button, Table, Select, Checkbox, message, Row, Col } from 'antd';
import XLSX from 'xlsx'
import styles from './style.less'
import { saveFile } from '../../utils/Utils'
import Config from '../../../../../../config.json'
import _ from 'lodash'
const Tempalte = _.cloneDeep(Config)
const FormItem = Form.Item
const Option = Select.Option

class Wages extends Component {
  constructor(props) {
    super(props)
    let dataList = []
    for (let i = 1; i <= 50; i++) {
      dataList.push({ '序号': i })
    }
    this.state = {
      isHouseChecked: false, //是否缴纳公积金
      dataList,
      originalData: [] //原始数据
    }
  }

  _renderColumns = () => {
    const columns = [{
      title: '序号',
      dataIndex: '序号',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => index + 1
    }, {
      title: '姓名',
      dataIndex: '姓名',
      width: 100,
      fixed: 'left'
    }, {
      title: '是否转正',
      width: 80,
      dataIndex: '是否转正'
    }, {
      title: '试用薪资',
      width: 80,
      dataIndex: '试用薪资'
    }, {
      title: '转正薪资',
      width: 80,
      dataIndex: '转正薪资'
    }, {
      title: '转正前自然天数',
      width: 120,
      dataIndex: '转正前自然天数'
    }, {
      title: '转正后自然天数',
      width: 120,
      dataIndex: '转正后自然天数'
    }, {
      title: '试用期事假',
      width: 120,
      dataIndex: '试用期事假'
    }, {
      title: '事假天数',
      width: 100,
      dataIndex: '事假天数'
    }, {
      title: '入职离职缺勤天数',
      width: 120,
      dataIndex: '入职离职缺勤天数'
    }, {
      title: '考勤扣除',
      width: 80,
      dataIndex: '考勤扣除'
    }, {
      title: '缺卡扣费',
      width: 80,
      dataIndex: '缺卡扣费'
    }, {
      title: '迟到扣费',
      width: 80,
      dataIndex: '迟到扣费'
    }, {
      title: '其他扣除',
      width: 80,
      dataIndex: '其他扣除'
    }, {
      title: '工龄工资',
      width: 80,
      dataIndex: '工龄工资'
    }, {
      title: '变动工资',
      width: 80,
      dataIndex: '变动工资'
    }, {
      title: '通讯补贴',
      width: 80,
      dataIndex: '通讯补贴'
    }, {
      title: '应发工资',
      width: 80,
      dataIndex: '应发工资',
      className: styles.highlightCol
    }, {
      title: '社保扣除',
      width: 80,
      dataIndex: '社保扣除'
    }, {
      title: '公积金',
      width: 80,
      dataIndex: '公积金'
    }, {
      title: '缴纳个税',
      width: 80,
      dataIndex: '缴纳个税'
    }, {
      title: '实发工资',
      width: 80,
      dataIndex: '实发工资',
      className: styles.highlightCol
    }]
    return columns
  }

  _inputClick = (e) => {
    const { form } = this.props
    let zrts = form.getFieldValue('zrts')
    let sbjs = form.getFieldValue('sbjs')
    let gjjjs = form.getFieldValue('gjjjs')
    if (!zrts) {
      message.error('请填写自然天数')
      e.preventDefault()
      return
    }
    if (!sbjs) {
      message.error('请填写社保基数')
      e.preventDefault();
      return
    }
    if (this.state.isHouseChecked && !gjjjs) {
      message.error('请填写公积金基数')
      e.preventDefault();
      return
    }
    this.refs.fileInput.refs.input.value = ''
  }

  houseChange = (e) => {
    this.setState({ isHouseChecked: e.target.checked })
  }

  _fileChange = (event) => {
    let file;
    let files = event.target.files;
    if (!files || files.length == 0) return;
    file = files[0];
    if (!/\.(xls|xlsx)$/.test(file.name)) return
    let reader = new FileReader();
    reader.onload = (e) => {
      let binary = "";
      let bytes = new Uint8Array(e.target.result);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      /* 读取工作表 */
      let wb = XLSX.read(binary, { type: 'binary', sheetStubs: true });

      /* 读取第一个表格 */
      let ws = wb.Sheets[wb.SheetNames[0]];
      /* 格式化 */
      let json = XLSX.utils.sheet_to_json(ws, { raw: true, defval: 0 });
      console.log('json->', json)
      let newjson = []
      for (let item of json.slice(0)) {
        item = this.deepCopy({}, item)
        for (let key in item) {
          if (item[key] == 0) item[key] = '' //为0的显示为空
        }
        newjson.push(item)
      }
      this.setState({
        dataList: newjson,
        originalData: json
      })
    }
    reader.readAsArrayBuffer(file);
  }

  deepCopy = (target, source) => {
    for (let p in source) {
      if (source.hasOwnProperty(p)) {
        if (source[p] instanceof Object) {
          this.deepCopy(target[p] || {}, source[p])
        } else {
          target[p] = source[p];
        }
      }
    }
    return target;
  }

  round = (x, num) => {
    return parseFloat((Math.round(x * Math.pow(10, num)) / Math.pow(10, num)).toFixed(num));
  }

  formatData = (json) => {
    const { form } = this.props
    let zrts = parseFloat(form.getFieldValue('zrts'))  //自然天数
    let sbjs = parseFloat(form.getFieldValue('sbjs'))
    let jlgs = form.getFieldValue('jlgs') // 是否缴纳个税
    let gjjjs = form.getFieldValue('gjjjs') //公积金基数

    let copyData = [] //深拷贝数据,防止污染原始数据
    for (let item of json.slice(0)) {
      item = this.deepCopy({}, item)
      copyData.push(item)
    }
    const dataList = copyData.map((item, index) => {
      //注意：所有负值的原值都是正数，需要相应改为负数
      item['其他扣除'] = - item['其他扣除']

      item['考勤扣费'] = item['缺卡扣费'] + item['迟到扣费']
      if (item['是否转正'] == '否') {  //试用期
        item['考勤扣除'] = -this.round(item['试用薪资'] / zrts * (item['入职离职缺勤天数'] + item['试用期事假']) + item['考勤扣费'], 2)
        item['应发工资'] = this.round(item['试用薪资'] + item['考勤扣除'] + item['其他扣除'] + item['工龄工资'] + item['变动工资'] + item['通讯补贴'], 2)
      }

      else if (item['是否转正'] == '是') { //转正后
        item['考勤扣除'] = -this.round(item['转正薪资'] / zrts * (item['入职离职缺勤天数'] + item['事假天数']) + item['考勤扣费'], 2)
        item['应发工资'] = this.round(item['转正薪资'] + item['考勤扣除'] + item['其他扣除'] + item['工龄工资'] + item['变动工资'] + item['通讯补贴'], 2)
      }

      else if (item['是否转正'] == '中') { //当月中某天转正
        item['考勤扣除'] = -this.round(item['试用薪资'] / zrts * (item['入职离职缺勤天数'] + item['试用期事假'])
          + item['转正薪资'] / zrts * (item['入职离职缺勤天数'] + item['事假天数'])
          + item['考勤扣费'], 2)
        item['转正差额'] = this.round((item['转正薪资'] - item['试用薪资']) / zrts * item['转正后自然天数'], 2)
        item['应发工资'] = this.round(item['试用薪资'] + item['转正差额'] + item['考勤扣除'] + item['其他扣除'] + item['工龄工资'] + item['变动工资'] + item['通讯补贴'], 2)
      }
      /**社保扣除算法 */
      if (item['社保缴纳'] == '是') {
        item['社保扣除'] = -this.round(sbjs * 0.105, 2)
      } else {
        item['社保扣除'] = 0
      }

      item['转正前自然天数'] = zrts - item['转正后自然天数']
      item['缺卡扣费'] = - item['缺卡扣费']
      item['迟到扣费'] = - item['迟到扣费']
      item['考勤扣费'] = - item['考勤扣费']

      /**公积金是否缴纳 */
      if (this.state.isHouseChecked) {
        item['公积金'] = -this.round(gjjjs * 0.12, 2)
      } else {
        item['公积金'] = 0
      }
      /**缴纳个税算法 */
      if (jlgs) {
        let balance = item['应发工资'] + item['社保扣除'] + item['公积金'] - item['通讯补贴'] - 3500  //通讯补贴避税
        let tax = 0
        if (balance > 0 && balance <= 1500) {
          tax = balance * 0.03
        }
        else if (balance > 1500 && balance <= 4500) {
          tax = balance * 0.1 - 105
        }
        else if (balance > 4500 && balance <= 9000) {
          tax = balance * 0.2 - 555
        }
        else if (balance > 9000 && balance <= 35000) {
          tax = balance * 0.25 - 1005
        }
        else if (balance > 35000 && balance <= 55000) {
          tax = balance * 0.3 - 2755
        }
        else if (balance > 55000 && balance <= 80000) {
          tax = balance * 0.35 - 5505
        }
        else if (balance > 80000) {
          tax = balance * 0.45 - 13505
        }
        item['缴纳个税'] = - this.round(tax, 2)
        item['实发工资'] = this.round(item['应发工资'] + item['社保扣除'] + item['公积金'] + (tax > 0 ? item['缴纳个税'] : 0), 2)
      } else {
        item['缴纳个税'] = 0
        item['实发工资'] = this.round(item['应发工资'] + item['社保扣除'] + item['公积金'], 2)
      }
      /**处理可能为0的选项 赋值为空*/
      for (let key in item) {
        if (item[key] == 0) item[key] = ''
      }
      return item
    })
    this.setState({ dataList })
  }

  checkIsValid = () => {
    const { originalData } = this.state
    const arr = ['姓名', '是否转正', '试用薪资', '转正薪资', '试用期事假', '转正后自然天数', '事假天数', '入职离职缺勤天数'
      , '缺卡扣费', '迟到扣费', '通讯补贴', '其他扣除', '是否城镇', '社保缴纳', '工龄工资', '变动工资'
    ]
    let originalKeys = originalData.length ? Object.keys(originalData[0]) : []
    let msg = []
    for (let i of arr) {
      for (let j of originalKeys) {
        if (i == j && msg.indexOf(j) < 0) {
          msg.push(j)
        }
      }
    }
    msg = arr.filter((val) => !msg.includes(val))
    return msg
  }


  calculateData = () => {
    if (!this.state.originalData.length) {
      message.error('请导入数据')
      return
    }
    const result = this.checkIsValid()
    if (result.length) {
      message.error(`模板表格缺少${result.join(',')}列`)
      return
    }
    this.formatData(this.state.originalData)
  }

  exportData = () => {
    const { dataList } = this.state
    const colums = this._renderColumns()
    saveFile((path) => {
      let _headers = []
      for (let i = 0; i < colums.length; i++) {
        _headers.push(colums[i].title)
      }
      let headers = _headers
        //[ { v: 'id', position: 'A1' }]
        .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
        //[{ A1: { v: 'id' }]
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})
      let data = dataList
        .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
        .reduce((prev, next) => prev.concat(next))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})
      // 合并 headers 和 data
      let output = Object.assign({}, headers, data);
      // 获取所有单元格的位置
      let outputPos = Object.keys(output);
      // 计算出范围
      let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

      // 构建 workbook 对象
      let wb = {
        SheetNames: ['工资明细'],
        Sheets: {
          '工资明细': Object.assign({}, output, { '!ref': ref })
        }
      }
      // 导出 Excel
      XLSX.writeFile(wb, path)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 12
      },
      wrapperCol: {
        span: 10
      }
    }
    const colLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 }
    };
    return (
      <div>
        <Form className={styles.formLayout}>
          <Row>
            <Col className={styles.formCol}>
              <FormItem
                label="自然天数"
                {...colLayout}
              >
                {getFieldDecorator('zrts', {
                  initialValue: '31',
                  rules: [{ required: true }]
                })(
                  <Select style={{ with: 80 }}>
                    <Option value="31">31</Option>
                    <Option value="30">30</Option>
                    <Option value="29">29</Option>
                    <Option value="28">28</Option>
                    {/* <Option value="23">23</Option>
                    <Option value="21">21</Option> */}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className={styles.formCol}>
              <FormItem
                label="社保基数"
                {...colLayout}
              >
                {getFieldDecorator('sbjs', {
                  initialValue: '2819.3',
                  rules: [{ required: true, message: '请输入社保基数' }, {
                    validator: (rule, value, callback) => {
                      if (value && isNaN(value)) {
                        callback('社保基数不合法')
                      }
                      callback()
                    }
                  }]
                })(
                  <Input style={{ with: 80 }} />
                )}
              </FormItem>
            </Col>
            <Col className={styles.formCol}>
              <FormItem
                label="公积金基数"
                {...colLayout}
              >
                {getFieldDecorator('gjjjs', {
                  rules: [{}, {
                    validator: (rule, value, callback) => {
                      if (value && isNaN(value)) {
                        callback('公积金基数不合法')
                      }
                      callback()
                    }
                  }]
                })(
                  <Input style={{ with: 80 }} disabled={!this.state.isHouseChecked} />
                )}
              </FormItem>
            </Col>
            <Col className={styles.formCol} style={{ width: 100, marginLeft: 20 }}>
              <FormItem
                label={null}
                wrapperCol={{ span: 24 }}
              >
                {getFieldDecorator('sfjngjj', {
                })(
                  <Checkbox onChange={this.houseChange}>缴纳公积金</Checkbox>
                )}
              </FormItem>
            </Col>
            {/* <Col className={styles.formCol}>
            <FormItem
                label="公积金比例"
                {...colLayout}
              >
                {getFieldDecorator('gjjbl', {
                  initialValue:'0.12'
                })(
                  <Select style={{with:80}}>
                  <Option value="0.01">1%</Option>
                  <Option value="0.02">2%</Option>
                  <Option value="0.04">4%</Option>
                  <Option value="0.05">5%</Option>
                  <Option value="0.06">6%</Option>
                  <Option value="0.07">7%</Option>
                  <Option value="0.08">8%</Option>
                  <Option value="0.09">9%</Option>
                  <Option value="0.1">10%</Option>
                  <Option value="0.11">11%</Option>
                  <Option value="0.12">12%</Option>
                </Select>
                )}
              </FormItem>
            </Col> */}
            <Col className={styles.formCol} style={{ width: 100 }}>
              <FormItem
                label={null}
                wrapperCol={{ span: 24 }}
              >
                {getFieldDecorator('jlgs', {
                  //initialValue:'31',
                })(
                  <Checkbox>缴纳个税</Checkbox>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className={styles.buttonGrounp}>
              <Button type="primary" onClick={this.calculateData}>计算工资</Button>
              <div className={styles.fileDiv}>
                <Input
                  type="file"
                  ref="fileInput"
                  className={styles.fileInput}
                  onChange={this._fileChange}
                  onClick={this._inputClick}
                />
                <Button type="primary">导入分析表</Button>
              </div>
              <Button type="primary" onClick={this.exportData}>导出工资表</Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this._renderColumns()}
          rowKey={(record, index) => index}
          dataSource={this.state.dataList}
          scroll={{ x: 1915, y: 460 }}
          pagination={false}
          bordered={true}
        />
      </div>
    )
  }
}
export default Form.create()(Wages)