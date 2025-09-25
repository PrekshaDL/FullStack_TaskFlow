import { Routes } from '@angular/router';

import { AdminLandingpage } from './component/admin/admin-landingpage/admin-landingpage';
import { UserLandingpage } from './component/user/user-landingpage/user-landingpage';
import { AdminLogin } from './component/admin/admin-login/admin-login';
import { AuthComponent } from './component/user/user-login/user-login';
import { UserDashboard } from './component/user/user-dashboard/user-dashboard';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';
import { UserProfileComponent } from './component/user/user-profile/user-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/user-landingpage', pathMatch: 'full' },
  { path: 'user-landingpage', component: UserLandingpage },
  { path: 'user-login', component: AuthComponent },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'user/profile/:id', component: UserProfileComponent },
  { path: 'user/projects', loadComponent: () => import('./component/user/project/project').then(m => m.ProjectComponent) },
  { path: 'user/board', loadComponent: () => import('./component/user/board/board').then(m => m.BoardComponent) },
  { path: 'user/activitylog', loadComponent: () => import('./component/user/activitylog/activitylog').then(m => m.ActivityLogComponent) },
  { path: 'user/tasks', loadComponent: () => import('./component/user/task/task').then(m => m.TaskComponent) },
  { path: 'user/notifications', loadComponent: () => import('./component/user/notification/notification').then(m => m.NotificationComponent) },
  { path: 'admin-landingpage', component: AdminLandingpage },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin-dashboard', component: AdminDashboard },
  // Admin pretty URLs used by navbar
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/manage-project', loadComponent: () => import('./component/admin/manage-project/manage-project').then(m => m.ManageProjectComponent) },
  { path: 'admin/manage-task', loadComponent: () => import('./component/admin/manage-task/manage-task').then(m => m.ManageTaskComponent) },
  { path: 'admin/manage-user', loadComponent: () => import('./component/admin/manage-user/manage-user').then(m => m.ManageUserComponent) },
  { path: 'admin/manage-board', loadComponent: () => import('./component/admin/manage-board/manage-board').then(m => m.ManageBoardComponent) },
  { path: 'admin/manage-activitylog', loadComponent: () => import('./component/admin/manage-activitylog/manage-activitylog').then(m => m.ManageActivityLogComponent) },
  { path: 'admin/manage-notification', loadComponent: () => import('./component/admin/manage-notification/manage-notification').then(m => m.ManageNotificationComponent) },
  //{ path: '', redirectTo: 'admin', pathMatch: 'full' },
];
