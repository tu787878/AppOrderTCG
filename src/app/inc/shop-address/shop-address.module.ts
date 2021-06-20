import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopAddressPageRoutingModule } from './shop-address-routing.module';

import { ShopAddressPage } from './shop-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopAddressPageRoutingModule
  ],
  declarations: [ShopAddressPage]
})
export class ShopAddressPageModule {}
