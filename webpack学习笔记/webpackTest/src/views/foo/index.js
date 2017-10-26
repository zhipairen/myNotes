/**
 * Created by gbl17 on 2017/6/21.
 */
import template from './index.html'
import './style.css'

export default class {
  mount(container) {
    document.title = 'foo'
    container.innerHTML = template
  }
}