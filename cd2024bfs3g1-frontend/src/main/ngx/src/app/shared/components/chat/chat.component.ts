import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatMessageModelInterface, ChatMessageResponseInterface } from '../../interfaces/chat-message.interface';
import { ChatService } from '../../services/chat.service';
import { JukidsAuthService } from '../../services/jukids-auth.service';
import { ChatJoinRoomInterface } from '../../interfaces/chat-join-room.interface';
import { MainService } from '../../services/main.service';
import { ServiceResponse } from 'ontimize-web-ngx';
import { ChatUserProfileInterfaceResponse } from '../../interfaces/chat-user-profile.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  //============================= CHAT SEND VARIABLE =============================
  isUserProfileChat: boolean = false;
  
  //============================= CHAT DATA =============================
  currentProfileChatData: ChatUserProfileInterfaceResponse | null = null;
  currentUserId: any;
  
 


  baseUrl: string;
  userImage: string = 'assets/images/no-image.png';

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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private chatService: ChatService,
    private mainService: MainService
  ) {
    // console.log('MATLOGDATA:', data);

    this.mainService.getUserInfo().subscribe({
      next: (data: ServiceResponse) => {        
        this.currentUserId = data.data.usr_id;
      }
    })
    this.chatService.connect();

  }


  ngOnInit(): void {

    this.isUserProfileChat = (this.data == null) ? true : false;

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

    //Si viene la data por  ----->  MODAL (ToyDetails)
    if (this.data != null) {
      // this.isUserProfileChat = false;
      // console.log("MODAL DATA:", this.data);
      this.customer_id = this.data.customer_id
      this.toyId = this.data.toyId;
      this.toyName = this.data.toyName;
      this.price = this.data.price;

    }



    //Si viene la data por  ----->  USER-PROFILES/CHATS
    if (this.data == null) {

      // this.isUserProfileChat = true;
      // console.log("chatSevice");
      // console.log("UserID", this.currentUserId);

      this.chatService.getUserProfileChatData().subscribe({
        next: (data: ChatUserProfileInterfaceResponse) => {          
          // console.log(data);
          //Si es la primera vez se asigna la data
          if(this.currentProfileChatData == null){
            this.currentProfileChatData = data;
          }

          //Si la data es distinta se actualiza y se genera las acciones.
          if(this.currentProfileChatData != data){
            this.currentProfileChatData = data;

            this.chatService.disconnectRoom();
            this.messages = [];
            this.msgCount = -1;
            this.chatService.connect();

            this.chatService.joinRoom({
              customerId: data.customer_id,
              toyId: data.toy_id
            });

          }

          
          this.customer_id = data.customer_id.toString();
          this.toyId = data.toy_id;
          this.toyName = data.toyName;
        },
        error: (err: any) => {
          console.log(err);
        }
      })

    }

    //============================= AL INICIAR TIENE QUE CONECTAR VER SI HAY QUE CREAR LA SALA =============================

    let chatJR: ChatJoinRoomInterface = {
      customerId: this.customer_id,
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
        console.log("data: ", data);
        let nowInsertedDateChat;
        if (typeof data.insertedDate == "string"
          && data.insertedDate.indexOf('CEST') > -1) {
          nowInsertedDateChat = new Date();
          data.insertedDate = nowInsertedDateChat;
        }

        this.getUserImage(data.ownerId);

        // console.log("DATA: ", data);
        this.messages.push(data);
        //Ver control para bajarlo a abajo de todo.
        // console.log("messages: ", this.messages);              
      },
      error: (err: any) => {
        console.log(err);
      },
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
    this.dialog.getDialogById('Chat').close();
    this.messages = [];
    this.msgCount = -1;
    this.chatService.disconnectRoom();
  }

  sendMessage(message: string) {

    // console.log("customer_id: ", this.customer_id);
    // console.log("currrentUserId: ", this.currentUserId);
    

    let msg: ChatMessageModelInterface = {
      customerId: this.customer_id,
      message: message,
      toyId: this.toyId.toString(),
      owner: (this.customer_id != this.currentUserId) ? "true" : "false"
    }

    // console.log("msg: ", msg);
    
    this.chatService.sendMessage(msg);

    this.chatInput.nativeElement.value = '';


  }

  async getUserImage(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/restapi/get-image?userId=${userId}`);
      if (response.ok) {
        const blob = await response.blob();
        this.userImage = URL.createObjectURL(blob);
      } else {
        this.userImage = 'assets/images/user_profile.png';
      }
    } catch (error) {
      this.userImage = 'assets/images/user_profile.png';
    }
  }






}
