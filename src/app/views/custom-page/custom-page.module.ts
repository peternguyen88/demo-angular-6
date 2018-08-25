import {NgModule} from '@angular/core';
import {CustomPageComponent} from './custom-page.component';
import {CustomPageRoutingModule} from './custom-page-routing.module';
import {GmatCommonModule} from '../../shared/modules/gmat-common-module';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    CustomPageRoutingModule, GmatCommonModule, CommonModule
  ],
  declarations: [ CustomPageComponent]
})
export class CustomPageModule { }
