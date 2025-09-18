import { Routes } from '@angular/router';
import { Login } from './component/admin/login/login';
import { Dashboard } from './component/admin/dashboard/dashboard';
import { User } from './component/admin/user/user';
import { Project } from './component/admin/project/project';
import { Board } from './component/admin/board/board';
import { Task } from './component/admin/task/task';

import { Landingpage } from './component/admin/landingpage/landingpage';
import { Activitylog } from './component/admin/activitylog/activitylog';

export const routes: Routes = [
  { path: '', component: Landingpage, pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'users', component: User },
      { path: 'projects', component: Project },
      { path: 'boards', component: Board },
      { path: 'tasks', component: Task },
      { path: 'activitylogs', component: Activitylog}
    ]
  },

  { path: '**', redirectTo: '' }
];
