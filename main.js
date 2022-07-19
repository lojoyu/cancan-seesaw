import './style.css'
import {startAll} from './src/player'


document.querySelector('#app').innerHTML = /*html*/`
  <div>
    <button id="start" type="button" disabled> START </button>
  </div>
`
function start() {
  console.log('start!!!!')
  startAll()
  document.querySelector('#app').innerHTML = /*html*/`
  <div id="app-param"></div>
  <div id="app-device"></div>`
}

document.querySelector('#start')?.addEventListener('click', start)