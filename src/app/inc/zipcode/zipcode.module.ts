import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZipcodePageRoutingModule } from './zipcode-routing.module';

import { ZipcodePage } from './zipcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZipcodePageRoutingModule
  ],
  declarations: [ZipcodePage]
})
export class ZipcodePageModule {}
