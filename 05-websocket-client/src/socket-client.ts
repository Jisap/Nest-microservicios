import { Manager, Socket } from 'socket.io-client'

export const connectToServer = () => {

  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js'); // Conexión al servidor
  const socket = manager.socket('/');                                          // Se obtienen los sockets (canales de información)
  addListeners( socket );                                                      // Se envía los sockets a la fn que escucha eventos -> modifica html   
}

const addListeners = (socket:Socket) => {

  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector("#clients-ul")!;

  socket.on('connect', () => {                                                  // Escuchamos el evento de conexión
    serverStatusLabel.innerHTML = 'connected'                                   // Si se produce cambiamos la etiqueta de span  
  });

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'connected'
  });

  socket.on('clients-updated', (clients: string[]) => {                         // Escuchamos el evento de cliente agregado/borrado al [ConnectedClients]
    let clientsHtml = ''                                                        // y modificamos el html
    clients.forEach( clientId => {  
      clientsHtml += `
        <li>${clientId}</li>                                  
      `
    });
    clientsUl.innerHTML = clientsHtml
  })
}