import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { roleGuard } from './shared/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/course-list/course-list').then((m) => m.CourseListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'courses/manage/:id',
    loadComponent: () =>
      import('./courses/course-manage/course-manage').then((m) => m.CourseManageComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['FORMATEUR'] },
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./courses/course-detail/course-detail').then((m) => m.CourseDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'quiz/:id',
    loadComponent: () =>
      import('./quiz/quiz-take/quiz-take').then((m) => m.QuizTakeComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
  },
  {
    path: 'dashboard/student',
    loadComponent: () =>
      import('./dashboard/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
  },
  {
    path: 'dashboard/formateur',
    loadComponent: () =>
      import('./dashboard/formateur-dashboard/formateur-dashboard').then((m) => m.FormateurDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['FORMATEUR'] },
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: '',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.LoginComponent),
  },
];
