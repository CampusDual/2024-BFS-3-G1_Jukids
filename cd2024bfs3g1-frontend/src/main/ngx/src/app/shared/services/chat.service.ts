import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, map } from 'rxjs';
import { ChatJoinRoomInterface } from '../interfaces/chat-join-room.interface';
import { ChatMessageModelInterface } from '../interfaces/chat-message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private socket: Socket) { }

  connect() {
    this.socket.connect();
  }


  sendMessage(msg: ChatMessageModelInterface) {
    this.socket.emit('messageSendToUser', msg);
  }
  getMessage(): Observable<any> {
    return this.socket.fromEvent('receiveMessage');
  }

  getCurrentMessagesCount(): Observable<any> {
    return this.socket.fromEvent('messageCount');
  }

  joinRoom(chatJR: ChatJoinRoomInterface) {
    this.socket.emit('joinRoom', chatJR);
  }

  disconnectRoom() {
    this.socket.disconnect();
  }
}
