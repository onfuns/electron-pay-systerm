import React,{ Component } from 'react'
import { Route } from 'react-router-dom'

import Wages from './views/wages'

export default class Routes extends Component {
	render() {
		return (
      <div>
        <Route exact path="/" component={Wages} />
        <Route path="/sum" component={Wages} /> 
      </div>
		)
	}
}
