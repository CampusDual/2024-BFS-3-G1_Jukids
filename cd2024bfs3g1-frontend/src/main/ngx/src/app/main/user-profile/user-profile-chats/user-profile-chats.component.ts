import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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



  @ViewChild('chat') chat: ChatComponent;
  @ViewChild('chatList') chatList: OListComponent;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private chatService: ChatService,
    private toyService: OntimizeService
  ) {

    this.subscription = this.chatService.getUserProfileChatData().subscribe({
      next: (data: ChatUserProfileInterfaceResponse) => {
        if (data != null && data != this.productDetail) {
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

    this.chatRoom = chat;
    this.chatService.setUserProfileChatData(chat);
    
  }

  isChatRoomSelected(chat: ChatUserProfileInterfaceResponse) {
    return (this.chatRoom == chat);
  }

  refreshChatList() {
    this.chatList.reloadData();
  }

  goBack() {
    this.location.back();
  }
}
