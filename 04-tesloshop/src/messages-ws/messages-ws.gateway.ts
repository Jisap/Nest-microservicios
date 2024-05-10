import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {  // Estas interfaces permiten saber cuando un usuario se conecta o desconecta
  
  @WebSocketServer() wss:Server                                                       // Funcionalidad de socket.io adaptada a Nestjs que contiene todos los clientes conectados

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection( client: Socket ) {
    this.messagesWsService.registerClient(client);                                  // Detectado el client se guarda en [ConnectedClients]
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())  // Emitimos a todos los clientes ese []string con las ids de los clientes conectados
    
  }
  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  
}
