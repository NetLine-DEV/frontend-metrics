import { Routes } from '@angular/router';
import { authRouteGuard } from './guards/auth-route/auth-route.guard';
import { accessRouteGuard } from './guards/access-route/access-route.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [authRouteGuard]
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./components/pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => 
      import('./components/pages/register/register.component').then((c) => c.RegisterComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => 
      import('./components/pages/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => 
      import('./components/pages/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent)
  },
  {
    path: 'reset-password/:uidb64/:token',
    loadComponent: () => 
      import('./components/pages/confirm-reset-password/confirm-reset-password.component').then((c) => c.ConfirmResetPasswordComponent)
  },
  { 
    path: 'page/:pageName', 
    loadComponent: () =>
      import('./components/iframe/iframe.component').then((c) => c.IframeComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => 
      import('./components/pages/admin/users/list-users/list-users.component').then((c) => c.ListUsersComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  },
  {
    path: 'admin/edit-user/:id',
    loadComponent: () => 
      import('./components/pages/admin/users/edit-user/edit-user.component').then((c) => c.EditUserComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  },
  {
    path: 'admin/groups',
    loadComponent: () => 
      import('./components/pages/admin/groups/groups/groups.component').then((c) => c.GroupsComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  },
  {
    path: 'admin/edit-group/:id',
    loadComponent: () => 
      import('./components/pages/admin/groups/edit-group/edit-group.component').then((c) => c.EditGroupComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  },
  {
    path: 'admin/create-group',
    loadComponent: () => 
      import('./components/pages/admin/groups/create-group/create-group.component').then((c) => c.CreateGroupComponent),
    canActivate: [authRouteGuard, accessRouteGuard]
  }
];
