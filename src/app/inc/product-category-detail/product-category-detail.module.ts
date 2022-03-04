import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCategoryDetailPageRoutingModule } from './product-category-detail-routing.module';

import { ProductCategoryDetailPage } from './product-category-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCategoryDetailPageRoutingModule,
  ],
  declarations: [ProductCategoryDetailPage]
})
export class ProductCategoryDetailPageModule {}
