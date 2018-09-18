import React, { Component } from 'react';
import { Table, Input } from 'antd'

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class SocialSecurity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: props.dataSource.filter(item => item.checked).map(item => item.name),
      editingKey: '',
      dataSource: props.dataSource
    }
  }


  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.name, column)}
      />
    );
  }

  columns = [
    {
      title: '基数类型',
      dataIndex: 'name'
    },
    {
      title: '基数设置',
      dataIndex: 'set',
      width: 120,
      children: [
        { title: '最低下线', dataIndex: 'floor', editable: true, render: (text, record) => this.renderColumns(text, record, 'floor'), },
        { title: '最高上限', dataIndex: 'upper', editable: true, render: (text, record) => this.renderColumns(text, record, 'upper'), }]
    }, {
      title: '比例',
      dataIndex: 'c',
      width: 120,
      children: [
        { title: '公司部分(%)', dataIndex: 'company', editable: true, render: (text, record) => this.renderColumns(text, record, 'company') },
        { title: '个人部分(%)', dataIndex: 'personal', editable: true, render: (text, record) => this.renderColumns(text, record, 'personal') }]
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text, record, index) => {
        const { editable } = record;
        return (
          <div>
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.name)}>保存</a>
                </span>
                : <a onClick={() => this.edit(record.name)}>编辑</a>
            }
          </div>
        );
      }
    }]

  onSelectChange = (selectedRowKeys) => {
    const newData = [...this.state.dataSource];
    for (let j = 0; j < newData.length; j++) {
      newData[j].checked = false
      for (let i = 0; i < selectedRowKeys.length; i++) {
        if (newData[j].name == selectedRowKeys[i]) {
          newData[j].checked = true
        }
      }
    }
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, dataSource: newData });
  }

  handleChange(value, name, column) {
    const newData = [...this.state.dataSource];
    const target = newData.find(item => name === item.name)
    if (target) {
      target[column] = value;
      this.setState({ dataSource: newData });
    }
  }
  edit(name) {
    const newData = [...this.state.dataSource];
    const target = newData.find(item => name === item.name)
    if (target) {
      target.editable = true;
      this.setState({ dataSource: newData });
    }
  }
  save(name) {
    const newData = [...this.state.dataSource];
    const target = newData.find(item => name === item.name)
    if (target) {
      delete target.editable;
      this.setState({ dataSource: newData });
    }
  }


  render() {
    const { selectedRowKeys, dataSource } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnTitle: '是否计算'
    }

    return (
      <Table
        bordered
        rowSelection={rowSelection}
        columns={this.columns}
        dataSource={dataSource}
        style={{ marginTop: 10 }}
        pagination={false}
        rowKey={(record) => record.name}
      />
    );
  }
}

export default SocialSecurity;