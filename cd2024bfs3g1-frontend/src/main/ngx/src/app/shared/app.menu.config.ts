import { NgIf } from '@angular/common';
import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [

  //TODO dejamos este código comentado por si decidimos rescatar el Profile para el menú lateral general 
  // { id: 'user-profile', name: 'PROFILE', icon: 'folder_shared', route: '/main/user-profile',
  //   items: [
  //     { id: 'usertoylist', name: "YOUR_TOYS", tooltip: 'NEW', route: '/main/user-profile/toylist', icon: 'list' }
  //   ]
  // },
  { id: 'toys', name: 'TOYS', icon: 'inventory', route: '/main/toys',
    items: [
      { id: 'new', name: 'NEW', tooltip: 'NEW', route: '/main/toys/new', icon: 'add' }
    ]
  },
];
