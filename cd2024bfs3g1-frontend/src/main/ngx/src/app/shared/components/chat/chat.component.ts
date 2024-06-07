import { AfterViewChecked, Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatMessageModelInterface, ChatMessageResponseInterface } from '../../interfaces/chat-message.interface';
import { ChatService } from '../../services/chat.service';
import { JukidsAuthService } from '../../services/jukids-auth.service';
import { ChatJoinRoomInterface } from '../../interfaces/chat-join-room.interface';
import { MainService } from '../../services/main.service';
import { ServiceResponse } from 'ontimize-web-ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  baseUrl: string;
  toyId: number;
  price: number;
  toyName: string;
  customer_id: string;

  @ViewChild('chatInput') chatInput: any;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  //============================= CHAT ARRAY =============================
  messages: ChatMessageResponseInterface[] = [];

  msgCount: number = -1;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chatService: ChatService,
    private jkAuthService: JukidsAuthService
  ) {

    this.chatService.connect();
  }

  /**
   * 
   * 
   *  constructor(private socket: Socket) { }

  ngOnInit(): void {
    this.socket.fromEvent('message').subscribe((data: any) => {
      console.log(data);
    });
  }
   * 
   * 
   * 
   * 
   */

  ngOnInit(): void {

    // console.log("MODAL DATA:", this.data);
    this.customer_id = this.data.customer_id
    this.toyId = this.data.toyId;
    this.toyName = this.data.toyName;
    this.price = this.data.price;

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }


    //============================= AL INICIAR TIENE QUE CONECTAR VER SI HAY QUE CREAR LA SALA =============================
    let chatJR: ChatJoinRoomInterface = {
      customerId: this.data.customer_id,
      toyId: this.toyId
    }
    this.chatService.joinRoom(chatJR);


    this.chatService.getCurrentMessagesCount().subscribe({
      next: (data: any) => {
        this.msgCount = data;        
        console.log("msgCount: ", this.msgCount);
        
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    //============================= Ver mensajes y actualizar =============================
    this.chatService.getMessage().subscribe({
      next: (data: ChatMessageResponseInterface) => {
        console.log("DATA: ", data);
        this.messages.push(data);
        //Ver control para bajarlo a abajo de todo.
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete, messages: ', this.messages );
        this.scrollToBottom();
      }

    });


  }



  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll', err);
    }
  }


  closeModal() {
    this.chatService.disconnectRoom();
    this.dialog.getDialogById('Chat').close();
  }


  sendMessage(message: string) {

    
    let msg: ChatMessageModelInterface = {
      customerId: this.data.customer_id,
      message: message,
      toyId: this.toyId.toString()
    }

    this.chatService.sendMessage(msg);

    this.chatInput.nativeElement.value = '';

  }


}
