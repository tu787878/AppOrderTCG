import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopStylePageRoutingModule } from './shop-style-routing.module';

import { ShopStylePage } from './shop-style.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopStylePageRoutingModule
  ],
  declarations: [ShopStylePage]
})
export class ShopStylePageModule {}
