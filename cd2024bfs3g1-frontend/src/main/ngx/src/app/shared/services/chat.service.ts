import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatJoinRoomInterface } from '../interfaces/chat-join-room.interface';
import { ChatMessageModelInterface } from '../interfaces/chat-message.interface';
import { ChatUserProfileInterfaceResponse } from '../interfaces/chat-user-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private userProfileChatData$ = new BehaviorSubject<ChatUserProfileInterfaceResponse| null>( null );
  private userProfileChatData =  this.userProfileChatData$.asObservable();

  constructor(private socket: Socket) { }

  setUserProfileChatData(data: ChatUserProfileInterfaceResponse) {   
    this.userProfileChatData$.next(data);
  }

  getUserProfileChatData(): Observable<any> {
            
    return this.userProfileChatData;
  }




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
