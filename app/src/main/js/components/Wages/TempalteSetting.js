import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Tag } from 'antd'
import styles from './style.less'

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: props.list
    }
  }

  onDragEnd = (result) => {
    const { source, destination = {}, draggableId } = result
    const { droppableId: sourceDroppableId, index: sourceIndex } = source
    console.log(result)
    if (!destination || !destination.droppableId) return
    const { droppableId: desDroppableId = '', index: desIndex = 0 } = destination
    let { list } = this.state
    const [sourceId, sourceKey] = sourceDroppableId.split('-')
    const [desId, desKey] = desDroppableId.split('-')
    let current = list.find(item => item.key === sourceId)
    current[sourceKey].splice(sourceIndex, 1) //删除
    current[desKey].splice(desIndex, 0, { name: draggableId })
    this.setState({ list })
  }

  disable = (name) => {
    return ['姓名', '是否转正', '试用薪资', '转正薪资', '转正前自然天数', '试用期事假', '事假天数'
      , '入职离职缺勤天数'].some(item => item === name)
  }

  render() {
    const { list } = this.state
    return (
      <div className={styles.template}>
        {list.map((item, index) => (
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            key={index}
          >
            <div>
              <p>{item.name}</p>
              <div className={styles.row}>
                <Droppable droppableId={item.key + '-default'} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                    >
                      {item.default.map((c, index) => (
                        <Draggable draggableId={c.name} key={c.name} index={index} isDragDisabled={this.disable(item.name)}>
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Tag style={{ marginTop: 10 }}>{c.name}</Tag>
                            </span>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <div className={styles.row}>
                <Droppable droppableId={item.key + '-extra'}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={styles.extraRow}>
                      {item.extra.map((c, index) => (
                        <Draggable draggableId={c.name} key={c.name} index={index}>
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Tag style={{ marginTop: 10 }}>{c.name}</Tag>
                            </span>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        ))}
      </div>
    );
  }
}

export default Setting;