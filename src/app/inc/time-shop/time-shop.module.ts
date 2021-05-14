import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeShopPageRoutingModule } from './time-shop-routing.module';

import { TimeShopPage } from './time-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeShopPageRoutingModule
  ],
  declarations: [TimeShopPage]
})
export class TimeShopPageModule {}
