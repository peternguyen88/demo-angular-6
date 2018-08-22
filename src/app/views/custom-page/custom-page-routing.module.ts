import {RouterModule, Routes} from '@angular/router';
import {CustomPageComponent} from './custom-page.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: ':page-name', component: CustomPageComponent, data: {title: 'Custom Pages'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPageRoutingModule {}
