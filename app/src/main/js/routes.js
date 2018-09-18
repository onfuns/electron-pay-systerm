import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Wages from './views/wages'
import System from './views/system'

export default class Routes extends Component {
  render() {
    return (
      <div style={{ flex: 1 }}>
        <Route exact path="/" component={Wages} />
        <Route exact path="/system" component={System} />
      </div>
    )
  }
}
