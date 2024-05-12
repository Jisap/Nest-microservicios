import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {  // Estas interfaces permiten saber cuando un usuario se conecta o desconecta
  
  @WebSocketServer() wss:Server                                                       // Funcionalidad de socket.io adaptada a Nestjs que contiene todos los clientes conectados

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection( client: Socket ) {                                              // Detecta el client
    const token = client.handshake.headers.authentication as string;                // Recuperamos el token desde los extraheaders del mismo 
    console.log(token) 
    this.messagesWsService.registerClient(client);                                  // Se guarda el client en [ConnectedClients]
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())  // Emitimos a todos los clientes ese []string con las ids de los clientes conectados
    
  }
  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')                                           // El server escucha los eventos 'message-from-client' emitidos por el cliente
  onMessageFromClient(client: Socket, payload: NewMessageDto){
    
    // Desde el server el mensaje recibido se emite únicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

    // Desde el server el mensaje recibido se emite al resto de clientes menos al que lo emitio
    // client.broadcast.emit('message-from-server', {
    //  fullName: 'Soy yo',
    //  message: payload.message || 'no message'
    // })

    // Desde el server el mensaje recibido se emite a todos los clientes conectados al server
    this.wss.emit('message-from-server', {
      fullName: 'Soy yo',//this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });
  }
}
