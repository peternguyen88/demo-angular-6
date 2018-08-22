import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Import Containers
import {DefaultLayoutComponent} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'gmat-practice',
        loadChildren: './views/gmat-practice/gmat-practice.module#GMATPracticeModule'
      },
      {
        path: 'custom-pages',
        loadChildren: './views/custom-page/custom-page.module#CustomPageModule'
      },
      {
        path: 'management',
        loadChildren: './views/management/management.module#ManagementModule'
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
