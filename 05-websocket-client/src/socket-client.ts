import { Manager, Socket } from 'socket.io-client'

let socket: Socket                                                                // Socket definido globalmente

export const connectToServer = ( token: string ) => {

  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {   // Conexión al servidor
    extraHeaders:{                                                                // con extraHeaders
      authentication: token                                                       // que contienen el toke de autenticación
    }
  }); 
  socket = manager.socket('/');                                                   // Se obtienen el socket (canal de información) que este abierto.
  socket?.removeAllListeners()                                                    // Se borran los antiguos.
  addListeners();                                                                 // Se llama a la fn que escucha eventos del socket.
}

const addListeners = () => {                                                      // Escucha eventos del socket por referencia global

  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector("#clients-ul")!;

  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

  const messageUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

  socket.on('connect', () => {                                                    // Escuchamos el evento de conexión
    serverStatusLabel.innerHTML = 'connected'                                     // Si se produce cambiamos la etiqueta de span  
  });

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'connected'
  });

  socket.on('clients-updated', (clients: string[]) => {                           // Escuchamos el evento de cliente agregado/borrado al [ConnectedClients]
    let clientsHtml = ''                                                          // y modificamos el html
    clients.forEach( clientId => {  
      clientsHtml += `
        <li>${clientId}</li>                                  
      `
    });
    clientsUl.innerHTML = clientsHtml
  });

  messageForm?.addEventListener('submit', (event) => {                             // Obtenemos el value del input del form
    event.preventDefault();
    if(messageInput.value.trim().length <= 0) return

    socket.emit('message-from-client', { id: 'yo', message: messageInput.value }); // y lo emitimos a todo el mundo -> MessagesWsGateway -> emit('message-from-server') -> socket.on('message-from-server') -> modifica el html

    messageInput.value = '';
  });

  socket.on('message-from-server', (payload:{ fullName:string, message:string }) => {
    console.log(payload)
    const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `
    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messageUl.append(li)
  })
}