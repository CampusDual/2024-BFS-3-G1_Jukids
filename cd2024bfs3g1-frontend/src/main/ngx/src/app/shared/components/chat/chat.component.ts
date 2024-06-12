import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatMessageModelInterface, ChatMessageResponseInterface } from '../../interfaces/chat-message.interface';
import { ChatService } from '../../services/chat.service';
import { ChatJoinRoomInterface } from '../../interfaces/chat-join-room.interface';
import { MainService } from '../../services/main.service';
import { OTranslateService, ServiceResponse } from 'ontimize-web-ngx';
import { ChatUserProfileInterfaceResponse } from '../../interfaces/chat-user-profile.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  scrolledToBottom: boolean = false;
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
    private mainService: MainService,
    private translate: OTranslateService
  ) {    

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
      this.customer_id = this.data.customer_id
      this.toyId = this.data.toyId;
      this.toyName = this.data.toyName;
      this.price = this.data.price;

    }



    //Si viene la data por  ----->  USER-PROFILES/CHATS
    if (this.data == null) {

      // this.isUserProfileChat = true;

      this.chatService.getUserProfileChatData().subscribe({
        next: (data: ChatUserProfileInterfaceResponse) => {          
          //Si es la primera vez se asigna la data
          if (this.currentProfileChatData == null) {
            this.currentProfileChatData = data;
          }

          //Si la data es distinta se actualiza y se genera las acciones.
          if (this.currentProfileChatData != data) {
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
          console.error(err);
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
      },
      error: (err: any) => {
        console.error(err);
      }
    });

    //============================= Ver mensajes y actualizar =============================
    this.chatService.getMessage().subscribe({
      next: (data: ChatMessageResponseInterface) => {
        let nowInsertedDateChat;
        if (typeof data.insertedDate == "string"
          && data.insertedDate.indexOf('CEST') > -1) {
          nowInsertedDateChat = new Date();
          data.insertedDate = nowInsertedDateChat;
        }

        this.getUserImage(data.ownerId);

        this.messages.push(data);
      },
      error: (err: any) => {
        console.error(err);
      }
    });

  }
  ngAfterViewInit(): void {
    this.scrollToBottomIfNeeded();
  }

  ngAfterViewChecked(): void {
    // Analizar posible bug
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.msgCount = -1;
    this.messages = [];
  }



  // Método para comprobar y realizar el scroll al final si es necesario
  scrollToBottomIfNeeded(): void {
    if (!this.scrolledToBottom) {
      const chatContainer = this.chatContainer.nativeElement;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      this.scrolledToBottom = true;
    }
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


    if (message.length != 0) {
      let msg: ChatMessageModelInterface = {
        customerId: this.customer_id,
        message: message,
        toyId: this.toyId.toString(),
        owner: (this.customer_id != this.currentUserId) ? "true" : "false"
      }

      this.chatService.sendMessage(msg);


      this.chatInput.nativeElement.value = '';

      this.scrolledToBottom = false; // Indicamos que el scroll no se ha realizado al agregar un nuevo mensaje
      this.scrollToBottomIfNeeded();

    }
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

  // ============================== TRANSLATES ==============================

  getTranslate(key: string): string {
    return this.translate.get(key);
  }

}
