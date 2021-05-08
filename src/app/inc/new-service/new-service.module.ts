import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewServicePageRoutingModule } from './new-service-routing.module';

import { NewServicePage } from './new-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewServicePageRoutingModule
  ],
  declarations: [NewServicePage]
})
export class NewServicePageModule {}
