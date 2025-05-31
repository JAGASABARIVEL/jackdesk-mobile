import { Routes } from '@angular/router';
import { ChatdetailPage } from './features/chat/pages/chatdetail/chatdetail.page';
import { ChatResolver } from './shared/resolvers/chat.resolvers';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.page').then(m => m.ChatPage)
  },
  {
    path: 'chat/:id',
    //loadComponent: () => import('./features/chat/pages/chatdetail/chatdetail.page').then( m => m.ChatdetailPage)
    component: ChatdetailPage,
    //resolve: {
    //  chatData: ChatResolver
    //}
  },

  {
    path: 'drive',
    loadComponent: () => import('./features/drive/drive.page').then(m => m.DrivePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
];

