import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [

  { id: 'toys', name: 'TOYS', icon: 'inventory', route: '/main/toys',
    items: [
      { id: 'new', name: 'NEW', tooltip: 'NEW', route: '/main/toys/new', icon: 'add' }
    ]
  },
];
