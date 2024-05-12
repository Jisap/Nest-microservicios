import { connectToServer } from './socket-client'
import './style.css'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>

    <input id="jwt-token" placeholder="Json Web Token" />
    <button id="btn-connect">Connect</button></buttonA>

    <br/>
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
//connectToServer()

const jwtToken = document.querySelector<HTMLInputElement>("#jwt-token")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect?.addEventListener("click", () => {                                 // Para conectar al servidor hay que mandar un jwt
  if(jwtToken.value.trim().length <= 0) return alert("Enter a valid JWT");    // Sino se envía mensaje de error

  connectToServer(jwtToken.value.trim())                                      // Si si se introdujo en el input se envía al connectToServer   
})