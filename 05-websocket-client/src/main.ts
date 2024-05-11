import { connectToServer } from './socket-client'
import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>

    <br/>
    <span id="server-status">Offline</span>

    <ul id="clients-ul">
      <li>DLKFGKLJFL</li>
    </ul>
  </div>

  <form id="message-form">
    <input placeholder="message" id="message-input" />
  </form>

  <h3>Messages</h3>
  <ul id="messages-ul"></ul>

`
connectToServer()

