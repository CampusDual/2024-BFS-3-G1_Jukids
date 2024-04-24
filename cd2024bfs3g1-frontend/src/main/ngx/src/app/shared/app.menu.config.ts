import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [
  { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
  {
    id: 'admin', name: 'ADMIN', tooltip: 'ADMIN', icon: 'admin_panel_settings',
    items: [
      { id: 'roles', name: 'ROLES', tooltip: 'ROLES', route: '/main/admin/roles', icon: 'supervisor_account' },
      { id: 'users', name: 'USERS', tooltip: 'USERS', route: '/main/admin/users', icon: 'person' },
    ]
  },
  { id: 'toys', name: 'TOYS', icon: 'inventory', route: '/main/toys',
    items: [
      { id: 'new', name: 'NEW', tooltip: 'NEW', route: '/main/toys/new', icon: 'add' }
    ]
   },
  { id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' }
];
