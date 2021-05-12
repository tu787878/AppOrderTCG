import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesManagerPageRoutingModule } from './services-manager-routing.module';

import { ServicesManagerPage } from './services-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesManagerPageRoutingModule
  ],
  declarations: [ServicesManagerPage]
})
export class ServicesManagerPageModule {}
