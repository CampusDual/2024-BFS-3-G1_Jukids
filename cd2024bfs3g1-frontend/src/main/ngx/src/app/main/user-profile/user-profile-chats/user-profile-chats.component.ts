import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OListComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';
import { ChatUserProfileInterfaceResponse } from 'src/app/shared/interfaces/chat-user-profile.interface';
import { ChatService } from 'src/app/shared/services/chat.service';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-user-profile-chats',
  templateUrl: './user-profile-chats.component.html',
  styleUrls: ['./user-profile-chats.component.scss']
})
export class UserProfileChatsComponent implements OnInit, OnDestroy {

  baseUrl: string;
  isChatSelected: boolean = false;

  private chatRoom: ChatUserProfileInterfaceResponse;

  //============================= CHAT PRODUCT & USER DETAIL =============================
  private subscription: Subscription;
  productDetail: any = null;
  loadingDataSubscription: boolean = true;
  
  userDetail: any = null;
  
  location: any;


  @ViewChild('chat') chat: ChatComponent;
  @ViewChild('chatList') chatList: OListComponent;

  constructor(
    private chatService: ChatService,
    private toyService: OntimizeService,
    private userService: OntimizeService,
    private toysMapService: ToysMapService
  ) {

    this.subscription = this.chatService.getUserProfileChatData().subscribe({
      next: (data: ChatUserProfileInterfaceResponse) => {
        // console.log("user-profile-chats", data);
        if(data != null && data != this.productDetail){        
          this.productDetail = data;
          this.loadingDataSubscription = false;
        }
      }, 
      error: (error) => {
        console.log("error", error);
        this.loadingDataSubscription = false;
      }
    });


    const confToys = this.toyService.getDefaultServiceConfiguration("toys");
    this.toyService.configureService(confToys);

  }
  ngOnDestroy(): void {
    this.chatService.setUserProfileChatData(null);
    // this.productDetail = null;
    // this.userDetail = null;
  }
  ngOnInit(): void {
   

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

  }


  removeToolbar() {
    let toolbar: any = document.getElementsByTagName("o-data-toolbar")[0];
    toolbar.remove();
  }

  selectChat(chat: ChatUserProfileInterfaceResponse) {
    this.isChatSelected = true;
    let chatRoomID: string =
      `${chat.customer_id}C${chat.toy_id}`;


      
    this.chatRoom = chat;
    this.chatService.setUserProfileChatData(chat);

    // console.log(chatRoomID);

    // ======================= Query de toys =======================
    const filter = {
      toyid: chat.toy_id,
    };
    const columns = [
      "toyid",
      "name",
      "description",
      "price",
      "photo",
      "latitude",
      "longitude",
      "email",
      "usr_id",
      "shipping",
      "transaction_status",
      "category",
      "status"
    ];
    this.toyService
      .query(filter, columns, "toy")
      .subscribe({
        next: (data: ServiceResponse) => {
          // console.log("data toyservice", data.data[0]);
          this.productDetail = data.data[0];
          this.toysMapService.setLocation(data.data[0].latitude, data.data[0].longitude);
        },
        error: (error: any) => {
          console.log(error);
        }
      });   
  }


  isChatRoomSelected(chat: ChatUserProfileInterfaceResponse) {

    return (this.chatRoom == chat);
  }

}
