import { observable, action } from 'mobx'

class Store {

  @observable tagsView = []

  @action updateTagViews = (route, type) => {
    if (type === 'remove') {
      this.tagsView = [...this.tagsView.filter(item => item.path !== route.path)]
    } else if (type === 'removeAll') {
      this.tagsView = []
    } else {
      if (this.tagsView.some(item => item.path === route.path) || !route.isTag) return
      this.tagsView = [...this.tagsView, route]
    }
    return this.tagsView
  }
}

export default new Store()