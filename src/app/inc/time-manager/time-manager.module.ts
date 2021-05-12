import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeManagerPageRoutingModule } from './time-manager-routing.module';

import { TimeManagerPage } from './time-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeManagerPageRoutingModule
  ],
  declarations: [TimeManagerPage]
})
export class TimeManagerPageModule {}
