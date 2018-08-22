import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GMATPracticeComponent} from './gmat-practice.component';

const routes: Routes = [
  {path: ':section', component: GMATPracticeComponent, data: {title: 'GMAT Practice'}},
  {path: ':section/:setID', component: GMATPracticeComponent, data: {title: 'GMAT Practice'}, },
  {path: ':section/:setID/practice/:questionNoPractice', component: GMATPracticeComponent, data: {title: 'GMAT Practice'}, },
  {path: ':section/:setID/review/:questionNoReview', component: GMATPracticeComponent, data: {title: 'GMAT Practice'}, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMATPracticeRoutingModule {
}
